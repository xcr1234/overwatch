package com.blizzard.ow;


import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

public final class RedisUtil {


    private static boolean cache;
    private static int exp;
    private static JedisCluster jedisCluster;

    static {
        try {
            Properties properties = new Properties();
            properties.load(Thread.currentThread().getContextClassLoader().getResourceAsStream("config.properties"));

            cache = Boolean.valueOf(properties.getProperty("cache"));

            if (cache) {
                JedisPoolConfig config = new JedisPoolConfig();
                config.setMaxTotal(100);
                config.setMaxIdle(50);
                config.setMinIdle(20);
                config.setMaxWaitMillis(6 * 1000);
                config.setTestOnBorrow(true);

                Set<HostAndPort> jedisClusterNodes = new HashSet<HostAndPort>();
                for (String address : properties.getProperty("redis.cluster").split(",")) {
                    String[] host = address.split(":");
                    jedisClusterNodes.add(new HostAndPort(host[0], Integer.valueOf(host[1])));
                }
                jedisCluster = new JedisCluster(jedisClusterNodes, 2000, 100, config);
            }


        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    public static String getCache(String user, String pass) {
        if (cache) {
            String key = user + "@$$@" + pass;
            String result = jedisCluster.get(key);
            return GZipUtil.uncompress(result);
        }
        return null;
    }

    public static void putCache(String user, String pass, String json) {
        if (cache) {

            String key = user + "@$$@" + pass;
            String result = GZipUtil.compress(json);
            jedisCluster.set(key, result);
            jedisCluster.expire(key, exp); //一个key有3天的有效期

        }
    }

}
