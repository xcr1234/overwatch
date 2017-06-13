package com.blizzard.ow.util;

import com.blizzard.ow.action.Action;


import java.math.BigInteger;


/**
 * 封装登录表单
 */
public class Login {



    public static void handleAction(Action action, String user, String pass, String modulus, String generator, String salt, String publicB) {
        String[] o = login(user, pass, modulus, generator, salt, publicB);
        action.body("publicA", o[0]);
        action.body("clientEvidenceM1", o[1]);
    }

    private static String[] login(String user, String pass, String modulus, String generator, String salt, String publicB) {
        SrpClientSession srpClientSession = new SrpClientSession(modulus,generator);
        BigInteger[] bigIntegers = srpClientSession.step1(user,pass,salt,publicB);
        return new String[]{
                bigIntegers[0].toString(16),
                bigIntegers[1].toString(16),
        };
    }
}
