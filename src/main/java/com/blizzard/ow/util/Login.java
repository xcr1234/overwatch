package com.blizzard.ow.util;

import com.blizzard.ow.action.Action;
import org.apache.commons.io.IOUtils;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.ImporterTopLevel;
import org.mozilla.javascript.NativeFunction;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.Script;
import org.mozilla.javascript.Scriptable;


import java.io.IOException;


/**
 * 封装登录表单
 */
public class Login {


    private static Context context;
    private static Scriptable scope;


    public static void init() {
        context = Context.enter();
        scope = context.initStandardObjects();
        try {
            //srp.clazz其实是srp.class，它是srp.js编译过来的，提高运行速度
            //参考：https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino/JavaScript_Compiler
            PluginClassLoader pluginClassLoader = PluginClassLoader.get("srp.clazz");
            Class srpClass = pluginClassLoader.loadClass(null);
            if(!Script.class.isAssignableFrom(srpClass)){
                throw new RuntimeException("srp class must be instance of org.mozilla.javascript.Script!");
            }
            Script script = (Script) srpClass.newInstance();
            script.exec(context,scope);
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    public static void handleAction(Action action, String user, String pass, String modulus, String generator, String salt, String publicB) {
        Object[] o = login(user, pass, modulus, generator, salt, publicB);
        action.body("publicA", o[0].toString());
        action.body("clientEvidenceM1", o[1].toString());
    }

    private static Object[] login(String user, String pass, String modulus, String generator, String salt, String publicB) {

        //这里参考login.js的onSuccess方法。用java模拟js代码
        NativeObject srpClientSession = (NativeObject) context.newObject(scope, "SrpClientSession", new Object[]{
                modulus, generator, "SHA-256"
        });

        NativeFunction nativeFunction = (NativeFunction) srpClientSession.getPrototype().get("step1", srpClientSession);
        NativeObject nativeObject = (NativeObject) nativeFunction.call(context, scope, srpClientSession, new Object[]{
                user, pass, salt, publicB
        });
        NativeObject publicA = (NativeObject) nativeObject.get("publicA", nativeObject);
        NativeObject clientEvidenceM1 = (NativeObject) nativeObject.get("clientEvidenceM1", nativeObject);
        return new Object[]{
                ((NativeFunction) publicA.getPrototype().get("toString", publicA)).call(context, scope, publicA, new Object[]{16}),
                ((NativeFunction) clientEvidenceM1.getPrototype().get("toString", clientEvidenceM1)).call(context, scope, clientEvidenceM1, new Object[]{16})
        };


    }
}
