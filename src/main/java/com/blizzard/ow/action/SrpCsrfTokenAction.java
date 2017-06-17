package com.blizzard.ow.action;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.blizzard.ow.Constants;
import org.apache.http.client.HttpClient;
import org.apache.http.util.EntityUtils;

import java.io.IOException;

public class SrpCsrfTokenAction extends Action{
    public SrpCsrfTokenAction(String account){
        super(Constants.CSRF,"POST");

        setJson("{\"inputs\":[{\"input_id\":\"account_name\",\"value\":\"" + account + "\"}]}");

        header("Referer","https://www.battlenet.com.cn/login/zh/?ref=https://www.battlenet.com.cn/oauth/authorize?client_id%3Dnetease-d3-site%26response_type%3Dcode%26scope%3Did%2Bbattletag%2Blogout%26redirect_uri%3Dhttps%253A%252F%252Faccount.bnet.163.com%252Fbattlenet%252Flogin%253Finner_client_id%253Dow%2526inner_redirect_uri%253Dhttp%25253A%25252F%25252Fow.blizzard.cn%25252Fbattlenet%25252Flogin%25253Fredirect_url%25253Dhttp%2525253A%2525252F%2525252Fow.blizzard.cn%2525252Fcareer%2525252F&app=oauth");
        header("Host",Constants.BATTLE_NET).header("Connection","keep-alive").header("User-Agent", Constants.USER_AGENT);
    }

    public JSONObject doAction() throws IOException{
        String str = EntityUtils.toString(action().getEntity());
        return JSON.parseObject(str);
    }

    public JSONObject doAction(HttpClient httpClient) throws IOException{
        String str = EntityUtils.toString(action(httpClient).getEntity());
        return JSON.parseObject(str);
    }
}
