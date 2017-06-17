/*
 * Created by JFormDesigner on Sat Jun 10 13:17:41 CST 2017
 */

package com.blizzard.ow;
import com.blizzard.ow.action.Action;
import com.alibaba.fastjson.JSONObject;
import com.blizzard.ow.action.LoginAction;
import com.blizzard.ow.action.LoginPageAction;
import com.blizzard.ow.action.NoRedirectAction;
import com.blizzard.ow.action.SrpCsrfTokenAction;
import com.blizzard.ow.util.Login;
import com.blizzard.ow.util.MyFileChooser;

import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.awt.*;
import java.awt.event.*;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;

/**
 * @author abc
 */
public class MainFrame extends JFrame implements Constants{
    public MainFrame() {
        initComponents();

    }

    private static Log log = LogFactory.getLog(MainFrame.class);

    private void btnLoginAction(ActionEvent e) {

        if(txtUser.getText().isEmpty() || txtPass.getPassword().length == 0){
            JOptionPane.showMessageDialog(this,"请正确输入！");
            return;
        }

        try {
            doSpider(txtUser.getText(),new String(txtPass.getPassword()));
        } catch (IOException ex) {
            log.error(ex);
        }
    }


    private void doSpider(String user,String pass) throws IOException{

        //1-登录页面
        LoginPageAction action1 = new LoginPageAction();
        String sessionTimeout = action1.doAction();
        log.info("sessionTimeout:" + sessionTimeout);

        //2-请求srp-csrf Token
        JSONObject jsonObject = new SrpCsrfTokenAction(user).doAction();
        log.info("srp-csrf token:" + jsonObject);


        //3-登录 ：
        // TODO 自动跳转有问题，目前只能手动跳转
        Action action = new LoginAction(user,pass,jsonObject,sessionTimeout);
        HttpResponse response = action.action();



       while (response.getStatusLine().getStatusCode() == 302){
            String location = findHeader(response,"Location");
            log.info("location:" + location);
            action = new NoRedirectAction(location,"GET");
            response = action.action();
        }

        String html = EntityUtils.toString(response.getEntity());
        log.info(html);

        Document document = Jsoup.parse(html);

        if(document.getElementById("display-errors") != null){  //如果用户名密码错误则提示
            JOptionPane.showMessageDialog(this,document.getElementById("display-errors").text());
            return;
        }

        Elements elements = document.getElementsByTag("link"); //把里面的css换成暴雪爸爸的
        for(Element element : elements){
            String href = element.attr("href");
            if(href.endsWith(".features.min.css")){
                element.attr("href" , "http://ow.blizzard.cn" + href);
            }
        }


        JFileChooser fileChooser = MyFileChooser.create();
        fileChooser.setDialogTitle("已爬取数据，保存");
        fileChooser.setFileFilter(new FileNameExtensionFilter("html网页","html"));
        if(fileChooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION){
            File file = fileChooser.getSelectedFile();
            String fname = fileChooser.getName(file);
            if (!fname.contains(".html")) {
                file = new File(fileChooser.getCurrentDirectory(), fname = fname + ".html");
            }
            try {
                FileUtils.writeStringToFile(file,document.toString(),"UTF-8");
                JOptionPane.showMessageDialog(this,"已保存到:" + fname);
            }catch (IOException ex){
                log.error(ex);
                JOptionPane.showMessageDialog(this,"保存失败");
            }
        }



    }

    private String findHeader(HttpResponse response,String key){
        Header[] headers = response.getAllHeaders();
        for(Header header : headers){
            if(header.getName().equals(key)){
                return header.getValue();
            }
        }
        return null;
    }


    private void initComponents() {
        // JFormDesigner - Component initialization - DO NOT MODIFY  //GEN-BEGIN:initComponents
        label1 = new JLabel();
        txtUser = new JTextField();
        txtPass = new JPasswordField();
        button1 = new JButton();

        //======== this ========
        setResizable(false);
        setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
        setTitle("\u5b88\u671b\u5148\u950b\u6218\u7ee9\u67e5\u8be2");
        Container contentPane = getContentPane();
        contentPane.setLayout(null);

        //---- label1 ----
        label1.setIcon(new ImageIcon(getClass().getResource("/blizzard-default.1C4OH.png")));
        contentPane.add(label1);
        label1.setBounds(75, 0, 200, 105);
        contentPane.add(txtUser);
        txtUser.setBounds(60, 115, 245, 40);
        contentPane.add(txtPass);
        txtPass.setBounds(60, 160, 245, 35);

        //---- button1 ----
        button1.setText("\u767b\u5f55");
        button1.addActionListener(e -> btnLoginAction(e));
        contentPane.add(button1);
        button1.setBounds(135, 205, 75, button1.getPreferredSize().height);

        contentPane.setPreferredSize(new Dimension(330, 240));
        pack();
        setLocationRelativeTo(null);
        // JFormDesigner - End of component initialization  //GEN-END:initComponents
    }

    // JFormDesigner - Variables declaration - DO NOT MODIFY  //GEN-BEGIN:variables
    private JLabel label1;
    private JTextField txtUser;
    private JPasswordField txtPass;
    private JButton button1;
    // JFormDesigner - End of variables declaration  //GEN-END:variables
}
