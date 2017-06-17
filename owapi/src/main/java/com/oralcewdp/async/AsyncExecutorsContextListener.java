package com.oralcewdp.async;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 在ServletContext中创建一个固定尺寸的线程池，供AsyncServlet服务使用。
 *
 * 通过在context-param中配置"asyncExecutorsSize"参数来配置线程池尺寸，默认为（CPU核心数+1）。
 */
public class AsyncExecutorsContextListener implements ServletContextListener{

    public static final String configName = "asyncExecutorsSize";

    public static final String contextName = "async-Executors";

    private static final int availableProcessors = Runtime.getRuntime().availableProcessors();

    @Override
    public void contextInitialized(ServletContextEvent event) {
        String config = event.getServletContext().getInitParameter(configName);
        int size = config==null||config.isEmpty()?(availableProcessors+1):Integer.valueOf(config);
        ExecutorService executorService = Executors.newFixedThreadPool(size);
        event.getServletContext().setAttribute(contextName,executorService);
    }

    @Override
    public void contextDestroyed(ServletContextEvent event) {
        Object object = event.getServletContext().getAttribute(contextName);
        if(object instanceof ExecutorService){
            ((ExecutorService) object).shutdown();
        }
    }
}
