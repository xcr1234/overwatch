package com.blizzard.ow;

import com.alibaba.fastjson.JSONObject;
import com.blizzard.ow.bean.Hero;
import com.steadystate.css.dom.CSSStyleRuleImpl;
import com.steadystate.css.parser.CSSOMParser;
import com.steadystate.css.parser.SACParserCSS3;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.w3c.css.sac.Condition;
import org.w3c.css.sac.ConditionalSelector;
import org.w3c.css.sac.InputSource;
import org.w3c.css.sac.Selector;
import org.w3c.css.sac.SelectorList;
import org.w3c.dom.css.CSSRule;
import org.w3c.dom.css.CSSRuleList;
import org.w3c.dom.css.CSSStyleSheet;
import org.w3c.dom.css.CSSValue;

import java.io.IOException;
import java.io.StringReader;
import java.util.HashMap;
import java.util.Map;


public class DataParser {


    private static final int RANK_OFF = "background-image:url(".length();
    private static final int IMG_OFFSET = "http://overwatch.nos.netease.com/images/game/heroes/small/".length();


    public static void parse(Document document, JSONObject rootObject) throws IOException{

        Element sectionElement = document.getElementById("overview-section");

        rootObject.put("name",sectionElement.getElementsByClass("header-masthead").get(0).text());
        rootObject.put("level",sectionElement.getElementsByClass("player-level").get(0).text());
        rootObject.put("portrait",sectionElement.getElementsByClass("player-portrait").get(0).attr("src"));
        String style = sectionElement.getElementsByClass("player-rank").get(0).attr("style");
        rootObject.put("rank",style.substring(RANK_OFF,style.length() - 1));
        rootObject.put("win","http://ow.blizzard.cn" + sectionElement.getElementsByTag("img").get(1).attr("src"));
        String border = sectionElement.getElementsByClass("player-level").get(0).attr("style");
        rootObject.put("border",border.substring(RANK_OFF,border.length() - 1));

        JSONObject quick = new JSONObject();
        JSONObject sports = new JSONObject();

        rootObject.put("quick",quick);
        rootObject.put("sports",sports);

        Elements sections = document.select("section.content-box");

        Parser parser = new Parser(document);
        quick.put("detail",parser.parseDetail(sections.get(0)));
        quick.put("hero",parser.parseHeroes(sections.get(1)));
        quick.put("history",parser.parseHistory(sections.get(2)));
        sports.put("detail",parser.parseDetail(sections.get(3)));
        sports.put("hero",parser.parseHeroes(sections.get(4)));
        sports.put("history",parser.parseHistory(sections.get(5)));

        rootObject.put("achieve",parser.parseAchieve(sections.get(6)));


    }



}
