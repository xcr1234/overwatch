package com.oralcewdp.async;

import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.concurrent.Callable;

/**
 * 实现{@link Callable}接口的抽象类，使用方式于{@link Callable}接口一样，但是在其中可以使用getRequest和getResponse方法拿到HttpServletRequest与HttpServletResponse的引用。
 *
 * @see Callable
 */
public abstract class ServletCallAble<E> implements Callable<E> {

    private HttpServletRequest request;
    private HttpServletResponse response;
    private AsyncContext asyncContext;

    public final AsyncContext getAsyncContext() {
        return asyncContext;
    }

    void setAsyncContext(AsyncContext asyncContext) {
        this.asyncContext = asyncContext;
    }

    public final HttpServletRequest getRequest() {
        return request;
    }

    final void setRequest(HttpServletRequest request) {
        this.request = request;
    }

    public final HttpServletResponse getResponse() {
        return response;
    }

    final void setResponse(HttpServletResponse response) {
        this.response = response;
    }
}
