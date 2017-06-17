package com.oralcewdp.async;

import javax.servlet.*;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.*;


/**
 * 处理Async异步消息的Servlet，也就是在Servlet中处理一些比较耗时的操作（例如io）。
 *
 * 要求服务器支持Servlet 3.0协议。
 *
 * Servlet原生提供了startAsync方法，但是该方法使用起来比较繁琐，具体的多线程模型还是要自己写，因此我写了AsyncServlet来处理其中的线程模型。
 *
 * 异步的启动需要一个AsyncExecutors（线程池），你可以手动使用setAsyncExecutors方法来加载，或者在web.xml中注册listener{@link AsyncExecutorsContextListener}，
 * 该监听器将自动创建一个固定尺寸的线程池.
 * 如果没有配置AsyncExecutors，在执行service方法时将抛出ServletException: no AsyncExecutors.
 *
 * 然后写一个类继承{@link AsyncServlet}类，并实现getCallable方法，该方法返回一个{@link ServletCallAble}
 *
 * @author misaka-misaka:xcr
 * @see javax.servlet.AsyncContext
 */
@SuppressWarnings("serial")
public abstract class AsyncServlet<E> extends HttpServlet implements AsyncEventListener<E>{

    private long timeout = 10000L;

    private Long start;

    private ExecutorService execute;

    public long getTimeout() {
        return timeout;
    }

    public void setTimeout(long timeout) {
        this.timeout = timeout;
    }

    /**
    * 当异步消息完成后，触发该事件
    * @param asyncContext 当前异步的上下文
    * @param callAble 当前线程(CallAble)
    * @param result 执行的结果
    * @throws IOException
    */
    public void onComplete(AsyncContext asyncContext,ServletCallAble<E> callAble,E result)throws IOException {


    }

    /**
     * 返回一个ServletCallAble对象，通常该方法是实现应该是这样，也就是每次请求该方法都new一个对象，以免出现线程安全问题。
     *
     * return new ServletCallAble<E>(){
     *     pulibc E call() throws Exception{
     *         //do something.
     *     }
     *
     * };
     */
    public abstract ServletCallAble<E> getCallable();




    private ExecutorService getAsyncExecutors() throws ServletException {
        ExecutorService executorService = null;
        if(execute!=null){
            executorService = execute;
        }else{
            Object exec = getServletContext().getAttribute(AsyncExecutorsContextListener.contextName);
            if(exec!=null&&exec instanceof ExecutorService){
                executorService = (ExecutorService) exec;
            }
        }
        if(executorService==null){
            throw new ServletException("no async executors.");
        }
        if(executorService.isShutdown()){
            throw new ServletException("async Executors is shutdown.");
        }
        if(executorService.isTerminated()){
            throw new ServletException("async Executors is terminated.");
        }
        return executorService;

    }


    /**
     * 设置AsyncExecutors（线程池），该方法只能调用一次，如果调用多次将抛出ServletException
     * @param executorService 要设置的线程池。
     * @throws NullPointerException 当参数executorService为空时抛出
     */
    public void setAsyncExecutors(ExecutorService executorService) throws ServletException {
        if(executorService==null){
            throw new NullPointerException();
        }
        if(this.execute!=null){
            throw new ServletException("duplicate async executors.");
        }
        this.execute = executorService;
    }




    /**
     * 控制是否进入Async过程，该方法通常用作校验用户输入等。
     * @param request HttpServletRequest
     * @param response HttpServletResponse
     * @return 返回true则进入Async过程，返回false则service方法正常结束。
     * @throws ServletException
     * @throws IOException
     */
    public boolean doAsync(HttpServletRequest request, HttpServletResponse response) throws ServletException,IOException{
        return true;
    }


    /**
     * 当异步过程发生了异常时，触发该事件
     * @param asyncContext 异步过程上下文
     * @param callAble 异步过程线程
     * @param throwable 发生的异常
     * @throws IOException
     */
    public void onError(AsyncContext asyncContext,ServletCallAble<E> callAble,Throwable throwable) throws IOException {
        defaultErrorHandle(callAble,throwable);
    }

    /**
     * 当异步过程执行超时时，触发该事件。
     * @param asyncContext 异步过程上下文
     * @param callAble 异步过程线程
     * @throws IOException
     */
    public void onTimeout(AsyncContext asyncContext,ServletCallAble<E> callAble) throws IOException{
        throw new IOException("async timeout");
    }

    /**
     * 当异步过程开始执行时，触发该事件
     * @param asyncContext 异步过程上下文
     * @param callAble 异步过程线程
     * @throws IOException
     */
    public void onStartAsync(AsyncContext asyncContext,ServletCallAble callAble) throws IOException{

    }

    /**
     * 返回异步过程开始到现在经过的毫秒数。
     * @return 如果没有开始异步过程，则返回-1。
     */
    public long getAsyncTime(){
        if(start==null){
            return -1;
        }
        return System.currentTimeMillis()-start;
    }


    @Override
    public final void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        if(!doAsync(request,response)){
            return;
        }

        AsyncContext asyncContext = request.startAsync(request,response);
        asyncContext.setTimeout(getTimeout());

        ServletCallAble<E> callable = getCallable();
        callable.setRequest(request);
        callable.setResponse(response);
        callable.setAsyncContext(asyncContext);
        start = System.currentTimeMillis();
        AsyncServlet.this.onStartAsync(asyncContext,callable);

        final boolean[] isTimeout = {false};

        FutureTask<E> futureTask = new FutureTask<E>(callable){
            @Override
            public void done() {
                try {
                    asyncContext.complete();
                }catch (IllegalStateException e) {}
                //ignore the bug:java.lang.IllegalStateException: Calling [asyncComplete()] is not valid for a request with Async state [DISPATCHING]
            }
        };

        getAsyncExecutors().execute(futureTask);

        asyncContext.addListener(new AsyncListener() {
            @Override
            public void onComplete(AsyncEvent asyncEvent) throws IOException {

                if(!isTimeout[0]){

                    try {
                        E e = futureTask.get();

                        AsyncServlet.this.onComplete(asyncContext,callable,e);
                    } catch (InterruptedException e) {

                        AsyncServlet.this.onError(asyncContext,callable,e);
                    } catch (ExecutionException ex) {

                        AsyncServlet.this.onError(asyncContext,callable,ex.getCause());
                    }
                }
            }

            @Override
            public void onTimeout(AsyncEvent asyncEvent) throws IOException {
                try {

                    isTimeout[0] = true;
                    AsyncServlet.this.onTimeout(asyncContext,callable);
                }finally {
                    futureTask.cancel(true);
                }
            }

            @Override
            public void onError(AsyncEvent asyncEvent) throws IOException {
                try {
                    AsyncServlet.this.onError(asyncContext,callable,asyncEvent.getThrowable());
                }finally {
                    futureTask.cancel(true);
                }
            }

            @Override
            public void onStartAsync(AsyncEvent asyncEvent) throws IOException {

            }
        });


    }



    private String date(){
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(date);
    }

    private void defaultErrorHandle(ServletCallAble<E> callAble,Throwable throwable) throws IOException {
        throwable.printStackTrace();

        HttpServletResponse response = callAble.getResponse();
        response.setContentType("text/html");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

        Throwable rootCause = throwable;
        while (rootCause.getCause()!=null){
            rootCause = rootCause.getCause();
        }

        PrintWriter out = response.getWriter();
        out.print("<!DOCTYPE html><html><head><title>Async Servlet - Error report</title><style type=\"text/css\">H1 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:22px;} H2 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:16px;} H3 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:14px;} BODY {font-family:Tahoma,Arial,sans-serif;color:black;background-color:white;} B {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;} P {font-family:Tahoma,Arial,sans-serif;background:white;color:black;font-size:12px;}A {color : black;}A.name {color : black;}.line {height: 1px; background-color: #525D76; border: none;}</style> </head><body><h1>HTTP Status 500 - ");
        out.print(throwable.toString());
        out.print("</h1><div class=\"line\"></div><p><b>type</b> Exception report</p><p><b>message</b> <u>");
        out.print(throwable.toString());
        out.print("</u></p><p><b>description</b> <u>");
        out.print(getServletName());
        out.print(".</u></p><p><b>exception</b></p><pre>");
        throwable.printStackTrace(out);
        out.print("</pre><p><b>root cause</b></p><pre>");
        rootCause.printStackTrace(out);
        out.print("</pre><hr class=\"line\"><h3>Async Servlet Exception - ");
        out.print(date());
        out.print("</h3></body></html>");


    }



}
