package com.blizzard.ow.util;


import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.objectweb.asm.ClassReader;


import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 从.class文件中加载类的classloader，不用知道.class文件的类名也可以加载
 * 用法是
 * Class c = PluginClassLoader.get(classpath路径).loadClass(null);
 * Class c1 = PluginClassLoader.getFile(绝对路径).loadClass(null);
 */
public final class PluginClassLoader extends ClassLoader {


    private String className;
    private byte[] bytes;
    private static Map<String,PluginClassLoader> map = new ConcurrentHashMap<>();

    public static PluginClassLoader get(final String path){
        PluginClassLoader pluginClassLoader = map.get(path);
        if(pluginClassLoader == null) {
            pluginClassLoader = AccessController.doPrivileged(new PrivilegedAction<PluginClassLoader>() {
                @Override
                public PluginClassLoader run() {
                    return new PluginClassLoader(path);
                }
            });
            map.put(path,pluginClassLoader);
        }
        return pluginClassLoader;
    }

    public static PluginClassLoader getFile(String file){
        PluginClassLoader pluginClassLoader = map.get(file);
        if(pluginClassLoader == null){
            pluginClassLoader = AccessController.doPrivileged(new PrivilegedAction<PluginClassLoader>() {
                @Override
                public PluginClassLoader run() {
                    return new PluginClassLoader();
                }
            });
            try {
                byte[] bytes = FileUtils.readFileToByteArray(new File(file));
                ClassReader classReader = new ClassReader(bytes);
                pluginClassLoader.bytes = bytes;
                pluginClassLoader.className = classReader.getClassName();
            } catch (IOException e) {
                throw new RuntimeException("cannot load class resource : "+file,e);
            }
        }
        return pluginClassLoader;
    }

    private PluginClassLoader(){

    }


    private PluginClassLoader(String path) {
        InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(path);
        if(inputStream == null){
            throw new RuntimeException("class resource not found : "+path);
        }
        try {
            byte[] bytes = IOUtils.toByteArray(inputStream);
            this.bytes = bytes;
            ClassReader classReader = new ClassReader(bytes);
            this.className = classReader.getClassName();
        } catch (IOException e) {
            throw new RuntimeException("cannot load class resource : "+path,e);
        }
    }

    @Override
    public Class<?> loadClass(String name) throws ClassNotFoundException {
        return super.loadClass(name == null ? className : name);
    }

    @Override
    protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
        synchronized (getClassLoadingLock(name)){
            name = name.replace("/",".");
             Class<?> c = findLoadedClass(name);
             if(c == null){
                 try {
                     c = getParent().loadClass(name);
                 }catch (ClassNotFoundException e){
                     c = findClass(name);
                 }
             }
             if(resolve){
                 resolveClass(c);
             }
             return c;
        }
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        return defineClass(name,bytes,0,bytes.length);
    }
}
