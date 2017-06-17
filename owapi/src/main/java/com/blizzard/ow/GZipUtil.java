package com.blizzard.ow;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.output.ByteArrayOutputStream;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

/**
 * JAVA字符串的GZIP压缩解压缩
 */
public class GZipUtil {
    /**
     * GZIP 字符串压缩
     * @param str 被压缩的字符串
     * @return 压缩后的结果，base64编码
     */
    public static String compress(String str){
        if(str == null){
            return null;
        }
        try {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();//commons-io ByteArrayOutputStream比java原生的性能高
            GZIPOutputStream gzipOutputStream = new GZIPOutputStream(byteArrayOutputStream);
            byte[] b = str.getBytes("UTF-8");
            gzipOutputStream.write(b,0,b.length);
            gzipOutputStream.finish();
            byte[] bytes = byteArrayOutputStream.toByteArray();
            return Base64.encodeBase64String(bytes);
        }catch (IOException e){
            throw new Error(e);
        }
    }

    /**
     * GZIP 字符串解压缩
     * @param str 被压缩的字符串，base64编码
     * @return 解压缩后的结果
     */
    public static String uncompress(String str){
        if(str == null){
          return null;
        }
        byte[] bytes = Base64.decodeBase64(str);
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
            GZIPInputStream gzipInputStream = new GZIPInputStream(byteArrayInputStream);
            int n = 0;
            byte [] b = new byte[1024];
            while ((n = gzipInputStream.read(b)) > 0){
                out.write(b,0,n);
            }
            return new String(out.toByteArray(),"UTF-8");
        }catch (IOException e){
            throw new Error(e);
        }
    }
}
