package com.blizzard.ow.bean;

import java.util.ArrayList;
import java.util.List;

/**
 * 生涯统计资料
 */
public class Game {

    private String title;   //标题

    private List<GameData> data = new ArrayList<>();

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<GameData> getData() {
        return data;
    }

    public void setData(List<GameData> data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "Game{" +
                "title='" + title + '\'' +
                ", data=" + data +
                '}';
    }

    public void addData(String name,Object value){
        getData().add(new GameData(name,value));
    }
}
