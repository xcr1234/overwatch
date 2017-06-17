package com.blizzard.ow;


import com.blizzard.ow.bean.Achieve;
import com.blizzard.ow.bean.Achievements;
import com.blizzard.ow.bean.Game;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Parser {

    private Document document;

    private String escape;

    private static final int IMG_OFFSET = "http://overwatch.nos.netease.com/images/game/heroes/small/".length();
    private static final int TOOLTIP_OFFSET = "achievement-".length();
    private static final String STYLE = "background-image:url(";
    private static final int STYLE_OFFSET = STYLE.length();


    public Parser(Document document) throws IOException {
        this.document = document;
        init();
    }

    public Map<String,List<String>> parseDetail(Element section){
        Map<String,List<String>> map = new HashMap<>();

        for(Element div : section.getElementsByClass("card")){
            String title = null;
            for(Element element : div.children()){
                if(element.is(":not(" + escape + ")")) {
                    for(Element e : element.children()){
                        if(e.is(":not(" + escape + ")") && e.hasText()){
                            title = e.text();
                        }
                    }
                }
            }
            List<String> list = new ArrayList<>();
            map.put(title,list);
            for(Element span:div.getElementsByTag("span")){
                if(!span.attr("style").isEmpty()){
                    String style = span.attr("style");
                    int i = style.indexOf(STYLE) , j = style.lastIndexOf(")");
                    String str = "http://ow.blizzard.cn"+style.substring(i + STYLE_OFFSET,j);
                    list.add(str);
                }
            }
        }
        return map;
    }

    public  Map<Long,Hero> parseHeroes(Element section){
        Map<Long,Hero> heroMap = new HashMap<>();

        for(Element element : section.select("div[data-tag]")){
            for(Element progress : element.getElementsByClass("progress-2")){
                String imgSrc = progress.getElementsByTag("img").get(0).attr("src");
                long id = Long.decode(imgSrc.substring(IMG_OFFSET,imgSrc.length() - 4));
                Element container = progress.getElementsByClass("bar-container").get(0);
                String sp = null,sr = null;
                for(Element containerElement : container.children()){
                    if(containerElement.is(":not(" + escape + ")") && !"display:none".equals(containerElement.attr("style")) && containerElement.hasText()){
                        String[] split = containerElement.text().split(" ");
                        sp = split[0];
                        sr = split[1];
                    }
                }
                String tag = element.attr("data-tag");
                Hero hero = heroMap.computeIfAbsent(id, k -> new Hero(id));
                if(hero.getName() == null){
                    hero.setName(sp);
                }
                switch (tag){
                    case "0x0860000000000021":hero.setTime(sr);break;
                    case "0x0860000000000039":hero.setWin(parseInt(sr));break;
                    case "0x08600000000003D1":hero.setWinRate(parseInt(sr));break;
                    case "0x086000000000002F":hero.setHitRate(parseInt(sr));break;
                    case "0x08600000000003D2":hero.setSurviveSkill(parseFloat(sr));break;
                    case "0x0860000000000223":hero.setRunKill(parseInt(sr));break;
                    case "0x0860000000000346":hero.setInstantKill(parseInt(sr));break;
                    case "0x086000000000039C":hero.setAvaTargetKill(parseFloat(sr));break;
                }
            }
        }
        return heroMap;
    }

    public List<Game> parseHistory(Element section){
        List<Game> gameList = new ArrayList<>();
        for(Element table : section.select("table:not(" + escape + ")")){
            if(!table.getElementsByTag("tbody").isEmpty()){
                Game game = new Game();
                gameList.add(game);
                game.setTitle(table.getElementsByClass("stat-title").get(0).text());
                for(Element tr : table.getElementsByTag("tr")){
                    Elements elements = tr.select("td:not(" + escape + ")");
                    if(!elements.isEmpty()){
                        String name = elements.get(0).text();
                        Object value = null;
                        Element td = elements.get(1);
                        if(td.text().isEmpty()){
                            List<String> list = new ArrayList<>();
                            for(Element span : td.getElementsByTag("span")){
                                if(!span.attr("style").isEmpty()){
                                    String style = span.attr("style");
                                    int i = style.indexOf(STYLE) , j = style.lastIndexOf(")");
                                    list.add("http://ow.blizzard.cn"+style.substring(i + STYLE_OFFSET,j));
                                }
                            }
                            value = list;
                        }else{
                            value = td.text();
                        }
                        game.addData(name,value);
                    }
                }
            }

        }
        return gameList;
    }

    public List<Achievements> parseAchieve(Element section){
        List<Achievements> achievementsList = new ArrayList<>();

        Element dropDown = section.getElementsByClass("js-career-select").get(0);
        for(Element select : dropDown.getElementsByTag("option")){
            String name = select.val();
            String title = select.text();
            Achievements achievements = new Achievements(name,title);
            achievementsList.add(achievements);
        }

        Element ul = section.getElementsByTag("ul").get(0);
        Elements divCates = ul.children();
        for(int i=0;i<divCates.size();i++){
            Element divCate = divCates.get(i);
            Achievements achievements = achievementsList.get(i);
            for(Element divColumn : divCate.children()){
                Element div = divColumn.child(0);
                String tooltip = div.attr("data-tooltip");
                long id = Long.decode(tooltip.substring(TOOLTIP_OFFSET));
                String title = div.getElementsByClass("content").text();
                Element mediaCard = divColumn.getElementsByClass("tooltip-media-card").get(0);

                Achieve achieve = new Achieve();
                achieve.setId(id);
                achieve.setName(title);
                achieve.setDescription(mediaCard.child(2).text());
                achieve.setComplete(div.is(".m-hoverable"));
                achieve.setImage(div.getElementsByTag("img").get(0).attr("src"));
                achievements.getAchieveList().add(achieve);
            }
        }
        return achievementsList;
    }

    private void init() throws IOException {
        String styleText = document.getElementsByTag("style").get(0).html();
        InputSource source = new InputSource(new StringReader(styleText));
        CSSOMParser parser = new CSSOMParser(new SACParserCSS3());
        CSSStyleSheet sheet = parser.parseStyleSheet(source, null, null);
        CSSRuleList rules = sheet.getCssRules();
        for (int i = 0; i < rules.getLength(); i++){
            CSSRule cssRule = rules.item(i);
            if(cssRule instanceof CSSStyleRuleImpl){
                CSSStyleRuleImpl cssStyleRule = (CSSStyleRuleImpl)cssRule;
                ConditionalSelector selector  = isClassStyle(cssStyleRule);
                if(selector != null && isHide(cssStyleRule)){
                    escape = selector.getCondition().toString();
                }
            }
        }
    }


    private static boolean isHide(CSSStyleRuleImpl cssRule){
        CSSValue cssValue = cssRule.getStyle().getPropertyCSSValue("display");
        if(cssValue != null){
            return "none".equals(cssValue.getCssText());
        }
        return false;
    }

    private static ConditionalSelector isClassStyle(CSSStyleRuleImpl cssStyleRule){
        SelectorList selectorList = cssStyleRule.getSelectors();
        if(selectorList.getLength() != 1){
            return null;
        }
        Selector selector = selectorList.item(0);
        if(selector instanceof ConditionalSelector){
            ConditionalSelector conditionalSelector = (ConditionalSelector)selector;
            if(conditionalSelector.getCondition().getConditionType() == Condition.SAC_CLASS_CONDITION){
                return conditionalSelector;
            }
        }
        return null;
    }

    private static Float parseFloat(String str){
        if(str == null){
            return null;
        }
        if("--".equals(str)){
            return null;
        }
        return Float.valueOf(str);
    }

    private static Integer parseInt(String str){
        if(str == null){
            return null;
        }
        if("--".equals(str)){
            return null;
        }
        if(str.endsWith("%")){
            return Integer.valueOf(str.substring(0,str.length() - 1));
        }
        return Integer.valueOf(str);
    }

}
