package com.klw.oa.controller;

import com.klw.oa.entity.Myfile;
import com.klw.oa.entity.User;
import com.klw.oa.service.MyfileService;
import com.klw.oa.utils.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by exciak on 2017/5/4.
 */
@Controller
@RequestMapping("/file")
public class FileController {
    @Autowired
    private MyfileService mfs;

    @RequestMapping("/toUpload")
    public String toUpload(){

        return "file/uploadFile";
    }

    @ResponseBody
    @RequestMapping("/downloadFile")
    public Map<Object,Object> downFile(HttpServletRequest request, HttpServletResponse response
                        ,@RequestParam(value = "fileId") Integer fileId)
            throws ServletException, IOException {

        Myfile downFile = mfs.getFileById(fileId);

        String realName = downFile.getRealName();
        String fileName =null;

        String path = request.getServletContext().getRealPath("/upload/"+realName);
        File file = new File(path);
        if(file.exists()){

            fileName =downFile.getFileName()+realName.substring(realName.lastIndexOf("."));
            String agent = (String)request.getHeader("USER-AGENT");
            if(agent != null && agent.toLowerCase().indexOf("firefox") > -1)
            {
                fileName = "=?UTF-8?B?" + (new String(Base64.encode(fileName.getBytes("UTF-8")))) + "?=";
            }
            else
            {
                fileName = URLEncoder.encode(fileName,"UTF-8");
            }
            response.reset();
            response.setHeader("content-disposition", "attachment;filename="+fileName);

            FileInputStream inputStream = new FileInputStream(path);
            int contentLength = inputStream.available();
            response.setContentLength(contentLength);

            OutputStream os = response.getOutputStream();

            byte [] b = new byte[1024];
            int len;
            while((len = inputStream.read(b))!=-1){
                os.write(b, 0, len);
            }
            os.close();
            inputStream.close();
        }else{
            response.getWriter().print("<script>alert('该文件不存在！');history.go(-1)</script>");
        }
        return null;
    }

    @ResponseBody
    @RequestMapping("/uploadFile")
    public Map<String,String> uplaodFile(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        DiskFileItemFactory factory = new DiskFileItemFactory();

        ServletFileUpload upload = new ServletFileUpload(factory);

        Map<String,String> map = new HashMap<String,String>();
        Map<String,String> res = new HashMap<String,String>();

        User user =(User) request.getSession().getAttribute("user");

        String fieldName = null;
        String field =null;
        String realName = null;

        if(ServletFileUpload.isMultipartContent(request)){

            try {
                @SuppressWarnings("unchecked")
                List<FileItem> fileItems = upload.parseRequest(request);
                for(FileItem fileItem:fileItems){
                    if(fileItem.isFormField()){
                        fieldName = fileItem.getFieldName();
                        field=new String (fileItem.getString().getBytes("ISO-8859-1"),"UTF-8");
                        map.put(fieldName, field);
                        System.out.println(fieldName+": "+field);
                    }else{
                        InputStream in = fileItem.getInputStream();
                        if(in==null||in.available()<=0){
                            continue;
                        }
                        String name = fileItem.getName();
                        name= FileUtils.getFileName(name.substring(name.lastIndexOf(".")));
                        realName = name;
                        /*String path = request.getServletContext().getRealPath("/upload/"+name);*/
                        String path = "C:\\Users\\admins\\Desktop\\angular2\\sourse\\surveyStar\\src\\assets\\img\\upload\\"+realName;

                        System.out.println(path);
                        File file = new File(path);
                        if(!file.getParentFile().exists()) {
                            //如果目标文件所在的目录不存在，则创建父目录
                            System.out.println("目标文件所在目录不存在，准备创建它！");
                            if(!file.getParentFile().mkdirs()) {
                                System.out.println("创建目标文件所在目录失败！");
                            }
                        }
                        file.createNewFile();
                        FileOutputStream fos = new FileOutputStream(file);
                        byte [] b = new byte[1024];
                        int len=0;
                        while((len=in.read(b))!=-1){
                            fos.write(b, 0, len);
                        }

                        in.close();
                        fos.close();
                    }
                }
                Myfile myfile = new Myfile();
                myfile.setUser(null);
                myfile.setFileName(map.get("myfileName"));
                myfile.setFileDesc(map.get("myfileDesc"));
                myfile.setRealName(realName);
                int result = mfs.insertFileSer(myfile);
                if(result > 0){
                    res.put("result","success");
                   // response.sendRedirect(request.getContextPath()+"/file/dofile?method=filelist");
                }else{
                    res.put("result","fail");
                   // response.getWriter().print("<script>alert('添加失败');history.go(-1);</script>");
                }

            } catch (FileUploadException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();

                return res;
            }

        }

        res.put("fileName",realName);
        return res;
    }
}
