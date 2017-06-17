package com.blizzard.ow.bean;


import java.util.ArrayList;
import java.util.List;

public class Achievements {

    public Achievements(String name, String title) {
        this.name = name;
        this.title = title;
    }

    private String name;
    private String title;
    private List<Achieve> achieveList = new ArrayList<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Achieve> getAchieveList() {
        return achieveList;
    }

    public void setAchieveList(List<Achieve> achieveList) {
        this.achieveList = achieveList;
    }

    @Override
    public String toString() {
        return "Achievements{" +
                "name='" + name + '\'' +
                ", title='" + title + '\'' +
                ", achieveList=" + achieveList +
                '}';
    }
}
