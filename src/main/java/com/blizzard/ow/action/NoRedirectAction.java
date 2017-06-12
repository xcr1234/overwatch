package com.blizzard.ow.action;


import org.apache.http.client.config.RequestConfig;


/**
 * 不会自动重定向的Action
 */
public  class NoRedirectAction extends Action {
    public NoRedirectAction(String url, String method) {
        super(url, method);
    }


    @Override
    protected RequestConfig config() {
        return builder().setRedirectsEnabled(false).build();
    }
}
