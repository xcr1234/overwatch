package com.blizzard.ow.action;

import com.blizzard.ow.Application;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.message.BasicNameValuePair;

import java.io.IOException;
import java.nio.Buffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Action {

    private static Log log = LogFactory.getLog("http");

    public Action(String url, String method) {
        this.url = url;
        this.method = method;
    }

    private String url;
    private Map<String,String> headers = new HashMap<>();
    private Map<String,String> body = new HashMap<>();
    private String method;
    private String json;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Map<String, String> getHeaders() {
        return headers;
    }

    public void setHeaders(Map<String, String> headers) {
        this.headers = headers;
    }

    public Map<String, String> getBody() {
        return body;
    }

    public void setBody(Map<String, String> body) {
        this.body = body;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getJson() {
        return json;
    }

    public void setJson(String json) {
        this.json = json;
    }


    public final HttpResponse action() throws IOException {
        return action(Application.getClient());
    }

    public final HttpResponse action(HttpClient httpClient) throws IOException{
        if(httpClient == null){
            return action();
        }
        HttpRequestBase requestBase = request();
        RequestConfig config = config();
        if(config != null){
            requestBase.setConfig(config);
        }
        return httpClient.execute(requestBase);
    }

    protected RequestConfig config(){
        return builder().build();
    }

    protected HttpRequestBase request() throws IOException{
        if("GET".equalsIgnoreCase(method)){
            if(!body.isEmpty() || json != null){
                throw new IOException("GET doesn't support body!");
            }
            HttpGet httpGet = new HttpGet(url);
            for(Map.Entry<String,String> entry : headers.entrySet()){
                httpGet.addHeader(entry.getKey(),entry.getValue());
            }
            return httpGet;
        }else if("POST".equalsIgnoreCase(method)){
            HttpPost httpPost = new HttpPost(url);
            for(Map.Entry<String,String> entry : headers.entrySet()){
                httpPost.addHeader(entry.getKey(),entry.getValue());
            }
            if(json != null){
                StringEntity stringEntity = new StringEntity(json);
                stringEntity.setContentType("application/json");
                httpPost.setEntity(stringEntity);
            }
            if(!body.isEmpty()){
                List<NameValuePair> params = new ArrayList<>();
                for(Map.Entry<String,String> entry : body.entrySet()){
                    params.add(new BasicNameValuePair(entry.getKey(),entry.getValue()));
                }
                httpPost.setEntity(new UrlEncodedFormEntity(params,"UTF-8"));
            }
            return httpPost;
        }else{
            throw new IOException("unsupported method:" + method);
        }
    }

    public Action header(String name,String value){
        headers.put(name,value);
        return this;
    }

    public Action body(String name,String value){
        body.put(name,value);
        return this;
    }



    protected final RequestConfig.Builder builder(){
        RequestConfig.Builder builder =  RequestConfig.custom();
        builder.setCookieSpec(CookieSpecs.STANDARD);        //非常重要的设置，解决cookie的日期格式问题
        return builder;
    }


}
