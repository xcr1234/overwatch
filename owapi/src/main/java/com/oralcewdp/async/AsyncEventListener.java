package com.oralcewdp.async;

import javax.servlet.AsyncContext;
import java.io.IOException;

/**
 * 异步消息执行事件。
 */
public interface AsyncEventListener<E> {

    /**
     * 当异步消息完成后，触发该事件
     * @param asyncContext 当前异步的上下文
     * @param callAble 当前线程(CallAble)
     * @param result 执行的结果
     * @throws IOException
     */
    public void onComplete(AsyncContext asyncContext, ServletCallAble<E> callAble, E result)throws IOException;

    /**
     * 当异步过程发生了异常时，触发该事件
     * @param asyncContext 异步过程上下文
     * @param callAble 异步过程线程
     * @param throwable 发生的异常
     * @throws IOException
     */
    public void onError(AsyncContext asyncContext,ServletCallAble<E> callAble,Throwable throwable) throws IOException;
    /**
     * 当异步过程执行超时时，触发该事件。
     * @param asyncContext 异步过程上下文
     * @param callAble 异步过程线程
     * @throws IOException
     */
    public void onTimeout(AsyncContext asyncContext,ServletCallAble<E> callAble) throws IOException;
    /**
     * 当异步过程开始执行时，触发该事件
     * @param asyncContext 异步过程上下文
     * @param callAble 异步过程线程
     * @throws IOException
     */
    public void onStartAsync(AsyncContext asyncContext,ServletCallAble callAble) throws IOException;
}
