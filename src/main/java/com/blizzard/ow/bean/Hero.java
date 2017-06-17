package com.blizzard.ow.bean;

/**
 * 英雄角色
 */
public class Hero {

    public Hero(long id) {
        this.id = id;
    }

    public Hero() {
    }

    private long id;         //内部id

    private String name;    //名字

    private String time;    //游戏时间

    private Integer win;     //比赛胜利局数

    private Integer winRate;    //获胜占比  %

    private Integer hitRate;    //武器命中率 %

    private Float surviveSkill;   //单次存活时消灭

    private Integer runKill;    //最佳连续消灭

    private Integer instantKill;    //最佳瞬间消灭

    private Float avaTargetKill;    //平均攻防目标消灭

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Integer getWin() {
        return win;
    }

    public void setWin(Integer win) {
        this.win = win;
    }

    public Integer getWinRate() {
        return winRate;
    }

    public void setWinRate(Integer winRate) {
        this.winRate = winRate;
    }

    public Integer getHitRate() {
        return hitRate;
    }

    public void setHitRate(Integer hitRate) {
        this.hitRate = hitRate;
    }

    public Float getSurviveSkill() {
        return surviveSkill;
    }

    public void setSurviveSkill(Float surviveSkill) {
        this.surviveSkill = surviveSkill;
    }

    public Integer getRunKill() {
        return runKill;
    }

    public void setRunKill(Integer runKill) {
        this.runKill = runKill;
    }

    public Integer getInstantKill() {
        return instantKill;
    }

    public void setInstantKill(Integer instantKill) {
        this.instantKill = instantKill;
    }

    public Float getAvaTargetKill() {
        return avaTargetKill;
    }

    public void setAvaTargetKill(Float avaTargetKill) {
        this.avaTargetKill = avaTargetKill;
    }

    @Override
    public String toString() {
        return "Hero{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", time='" + time + '\'' +
                ", win=" + win +
                ", winRate=" + winRate +
                ", hitRate=" + hitRate +
                ", surviveSkill=" + surviveSkill +
                ", runKill=" + runKill +
                ", instantKill=" + instantKill +
                ", avaTargetKill=" + avaTargetKill +
                '}';
    }
}
