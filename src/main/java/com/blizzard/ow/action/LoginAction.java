package com.blizzard.ow.action;

import com.alibaba.fastjson.JSONObject;
import com.blizzard.ow.Constants;
import com.blizzard.ow.util.Login;


public class LoginAction extends Action {


    public LoginAction(String user, String pass, JSONObject jsonObject,String sessionTimeout){
        super(Constants.LOGIN_URL,"POST");

        header("Referer","https://www.battlenet.com.cn/login/zh/?ref=https://www.battlenet.com.cn/oauth/authorize?client_id%3Dnetease-d3-site%26response_type%3Dcode%26scope%3Did%2Bbattletag%2Blogout%26redirect_uri%3Dhttps%253A%252F%252Faccount.bnet.163.com%252Fbattlenet%252Flogin%253Finner_client_id%253Dow%2526inner_redirect_uri%253Dhttp%25253A%25252F%25252Fow.blizzard.cn%25252Fbattlenet%25252Flogin%25253Fredirect_url%25253Dhttp%2525253A%2525252F%2525252Fow.blizzard.cn%2525252Fcareer%2525252F&app=oauth");
        header("Upgrade-Insecure-Requests","1").header("Host",Constants.BATTLE_NET).header("Connection","keep-alive").header("User-Agent", Constants.USER_AGENT);
        header("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8").header("Accept-Encoding","gzip, deflate, br").header("Accept-Language","zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3");

        body("accountName",user).body("password",buildPassword(pass)).body("useSrp","true");

        Login.handleAction(this,jsonObject.getString("username"),   //注意这里是jsonObject.getString("username")，不是用户输入的username.
                pass,jsonObject.getString("modulus"),jsonObject.getString("generator"),jsonObject.getString("salt"),jsonObject.getString("public_B"));
        body("persistLogin","true").body("csrftoken",jsonObject.getString("csrf_token")).body("sessionTimeout",sessionTimeout).body("fp",Constants.FP);
    }

    private String buildPassword(String pass){
        StringBuilder stringBuilder = new StringBuilder(pass.length());
        for(int i=0;i<pass.length();i++){
            stringBuilder.append('.');
        }
        return stringBuilder.toString();
    }


}
