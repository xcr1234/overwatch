package com.blizzard.ow.util;


import org.apache.commons.io.FileUtils;

import javax.swing.*;
import java.io.File;
import java.io.IOException;

public class MyFileChooser extends JFileChooser {
    private static final long serialVersionUID = 445664721786338282L;

    private static final String appId = "da591022-cc07-4e61-8874-4343bdd39033";

    private String ext;

    private void init(){

    }


    private static final File file;

    static {
        file = new File(System.getProperty("java.io.tmpdir"),appId);
    }

    public static MyFileChooser create(){
        if(file.exists()){
            try {
                String lastPath = FileUtils.readFileToString(file,"UTF-8");
                return new MyFileChooser(lastPath);
            } catch (IOException e) {
                return new MyFileChooser();
            }
        }
        return new MyFileChooser();
    }



    private MyFileChooser() {
        init();
    }

    private MyFileChooser(String currentDirectoryPath) {
        super(currentDirectoryPath);
        init();
    }

    @Override
    public void cancelSelection() {
        super.cancelSelection();
        release();
    }


    private void release(){

    }

    @Override
    public void approveSelection() {
        try{
            File savedFile = getSelectedFile();
            if(getDialogType() == SAVE_DIALOG && savedFile.exists()){
                if(JOptionPane.showConfirmDialog(this,"文件已经存在，是否覆盖？","询问",JOptionPane.YES_NO_OPTION) != JOptionPane.YES_OPTION){
                    return;
                }
            }



            super.approveSelection();
            String saveFolder = getSelectedFile().getPath();
            File file = new File(System.getProperty("java.io.tmpdir"),appId);
            try {
                FileUtils.writeStringToFile(file,saveFolder,"UTF-8");
            } catch (IOException e) {}
        }finally {
            release();
        }
    }
}
