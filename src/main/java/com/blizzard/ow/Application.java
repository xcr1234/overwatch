package com.blizzard.ow;





import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClients;

import javax.swing.*;
import java.awt.EventQueue;


/**
 * 程序运行的入口
 */
public class Application implements Constants{


    private static HttpClient client;

    public static HttpClient getClient() {
        return client;
    }

    public static void main(String[] args)  {





        client = HttpClients.custom().build();


        try {
            UIManager.setLookAndFeel(LOOK_AND_FEEL);
        }catch (Exception e){
            e.printStackTrace();
        }

        EventQueue.invokeLater(()->{
            new MainFrame().setVisible(true);
        });


    }
}
