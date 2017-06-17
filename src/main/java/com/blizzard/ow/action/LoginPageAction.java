package com.blizzard.ow.action;


import com.blizzard.ow.Constants;

import org.apache.http.client.HttpClient;
import org.apache.http.util.EntityUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;


import java.io.IOException;


public class LoginPageAction extends Action {

    public LoginPageAction(){
        super(Constants.LOGIN_PAGE,"GET");
        header("Referer","http://ow.blizzard.cn/career/").header("Connection","keep-alive")
                .header("Host",Constants.BATTLE_NET).header("Upgrade-Insecure-Requests","1")
                .header("User-Agent", Constants.USER_AGENT);
    }

    public String doAction() throws IOException{
        String html =  EntityUtils.toString(action().getEntity());

        Document document = Jsoup.parse(html);
        return document.getElementById("sessionTimeout").val();
    }

    public String doAction(HttpClient client) throws IOException {

        String html =  EntityUtils.toString(action(client).getEntity());

        Document document = Jsoup.parse(html);
        return document.getElementById("sessionTimeout").val();
    }

}
