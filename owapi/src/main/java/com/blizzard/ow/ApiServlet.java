package com.blizzard.ow;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.blizzard.ow.action.Action;
import com.blizzard.ow.action.LoginAction;
import com.blizzard.ow.action.LoginPageAction;
import com.blizzard.ow.action.NoRedirectAction;
import com.blizzard.ow.action.SrpCsrfTokenAction;
import com.oralcewdp.async.AsyncServlet;
import com.oralcewdp.async.ServletCallAble;
import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import javax.servlet.AsyncContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 核心的API接口
 */
@WebServlet(value = "/api",asyncSupported = true)
public class ApiServlet extends AsyncServlet<String> {

    private static final long serialVersionUID = -473497004532991511L;

    @Override
    public ServletCallAble<String> getCallable() {
        return new ServletCallAble<String>() {
            @Override
            public String call() throws Exception {

                HttpClient httpClient = HttpClients.createDefault();

                HttpServletRequest request = getRequest();

                String user = request.getParameter("username");
                String pass = request.getParameter("password");

                String cached = RedisUtil.getCache(user,pass);
                if(cached != null){
                    return cached;
                }


                LoginPageAction action1 = new LoginPageAction();
                String sessionTimeout = action1.doAction(httpClient);
                JSONObject jsonObject = new SrpCsrfTokenAction(user).doAction(httpClient);
                Action action = new LoginAction(user,pass,jsonObject,sessionTimeout);
                HttpResponse response = action.action(httpClient);
                while (response.getStatusLine().getStatusCode() == 302){
                    String location = findHeader(response,"Location");
                    action = new NoRedirectAction(location,"GET");
                    response = action.action(httpClient);
                }

                String html = EntityUtils.toString(response.getEntity());
                Document document = Jsoup.parse(html);

                if(document.getElementById("display-errors") != null){
                    return "{\"ret_code\":300,\"ret_msg\":\""+document.getElementById("display-errors").text()+"\",data:{}}";
                }

                //封装data
                JSONObject data = new JSONObject();
                data.put("username",user);

                DataParser.parse(document,data);

                String json = data.toJSONString();

                RedisUtil.putCache(user,pass,json);

                return "{\"ret_code\":0,\"ret_msg\":\"success\",data:"+json+"}";
            }

            private String findHeader(HttpResponse response,String key){
                Header[] headers = response.getAllHeaders();
                for(Header header : headers){
                    if(header.getName().equals(key)){
                        return header.getValue();
                    }
                }
                return null;
            }

        };
    }

    private void allowCORS(HttpServletResponse response){
        response.addHeader("Access-Control-Allow-Origin","*");
        response.addHeader("Access-Control-Allow-Credentials","true");
        response.addHeader("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Response-Time");
        response.addHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS");
        long time = getAsyncTime();
        if(time > 0){
            response.addHeader("Response-Time", String.valueOf(time));
        }
    }

    @Override
    public long getTimeout() {
        return 8000L;
    }

    @Override
    public boolean doAsync(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String user = request.getParameter("username");
        String pass = request.getParameter("password");
        if(user == null || user.isEmpty() || pass == null || pass.isEmpty()){
            allowCORS(response);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().print("{\"ret_code\":200,\"ret_msg\":\"参数错误！\",data:{}}");
            return false;
        }
        return true;
    }

    @Override
    public void onComplete(AsyncContext asyncContext, ServletCallAble<String> callAble, String str) throws IOException {
        HttpServletResponse response = callAble.getResponse();
        allowCORS(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().print(str);
    }

    @Override
    public void onError(AsyncContext asyncContext, ServletCallAble<String> callAble, Throwable e) throws IOException {
        e.printStackTrace();
        HttpServletResponse response = callAble.getResponse();
        allowCORS(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().print("{\"ret_code\":500,\"ret_msg\":\"服务异常！\",data:{}}");
    }

    @Override
    public void onTimeout(AsyncContext asyncContext, ServletCallAble<String> callAble) throws IOException {
        HttpServletResponse response = callAble.getResponse();
        allowCORS(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().print("{\"ret_code\":400,\"ret_msg\":\"系统超时！\",data:{}}");
    }
}
