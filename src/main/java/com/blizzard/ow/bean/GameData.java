package com.blizzard.ow.bean;

/**
 * 生涯统计资料项目
 */
public class GameData {

    private String name;
    private Object value;

    public GameData(String name, Object value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "{" + name + "=" + value + "}";
    }
}
