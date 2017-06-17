package com.blizzard.ow;


import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.blizzard.ow.bean.Achieve;
import com.blizzard.ow.bean.Achievements;
import com.blizzard.ow.bean.Game;
import com.blizzard.ow.bean.Hero;
import com.steadystate.css.dom.CSSStyleRuleImpl;
import com.steadystate.css.parser.CSSOMParser;
import com.steadystate.css.parser.SACParserCSS3;
import com.sun.webkit.dom.CSSRuleImpl;
import org.apache.commons.io.IOUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;
import org.jsoup.select.Elements;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.w3c.css.sac.Condition;
import org.w3c.css.sac.ConditionalSelector;
import org.w3c.css.sac.InputSource;
import org.w3c.css.sac.Selector;
import org.w3c.css.sac.SelectorList;
import org.w3c.dom.css.CSSRule;
import org.w3c.dom.css.CSSRuleList;
import org.w3c.dom.css.CSSStyleRule;
import org.w3c.dom.css.CSSStyleSheet;
import org.w3c.dom.css.CSSValue;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;

public class TestDataParser {

    private static long time;

    private static Document document;
    private static Elements sections;
    private static Parser parser;


    @BeforeClass
    public static void init() throws IOException {
        time = System.currentTimeMillis();

        document = Jsoup.parse(IOUtils.toString(Thread.currentThread().getContextClassLoader().getResourceAsStream("test.html"), "UTF-8"));
        sections = document.select("section.content-box");

        parser = new Parser(document);


        System.out.println("解析html用时：" + (System.currentTimeMillis() - time) + "ms.");
    }


    @Test   //精选统计资料
    public void parseDetailForQuickGame() {
        Element quickHeroElement = sections.get(0);

        Map<String, List<String>> map = parser.parseDetail(quickHeroElement);

        System.out.println(map);

    }

    @Test
    public void parseHeroesForQuickGame() {
        Element quickHeroElement = sections.get(1);

        Map<Long, Hero> heroMap = parser.parseHeroes(quickHeroElement);


        for (Hero hero : heroMap.values()) {
            System.out.println(hero);
        }


    }


    @Test
    public void parseHistoryForQuickGame() {
        Element quickHeroElement = sections.get(2);
        List<Game> gameList = parser.parseHistory(quickHeroElement);
        for (Game game : gameList) {
            System.out.println(game);
        }
    }

    @Test
    public void parseAchieveForQuickGame() {
        Element element = sections.get(6);

        List<Achievements> achievementsList = parser.parseAchieve(element);

        for (Achievements achievements : achievementsList) {
            System.out.println(achievements);
        }


    }


    @AfterClass
    public static void finish() {
        System.out.println("测试用时：" + (System.currentTimeMillis() - time) + "ms.");
    }


}
