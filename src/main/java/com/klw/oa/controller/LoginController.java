package com.klw.oa.controller;

import com.klw.oa.entity.User;
import com.klw.oa.service.UserService;
import com.klw.oa.utils.JsonUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/5/17.
 */
@Controller
@RequestMapping("/login")
public class LoginController {

    @Resource(name = "UserServiceImpl")
    private UserService userServiceImpl;

    /**
     * 登录
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(value = "/doLogin", method= RequestMethod.POST)
    @ResponseBody
    public String doLogin(HttpServletRequest request, HttpServletResponse response,
                          @ModelAttribute User entity,
                          @RequestParam(value = "username", required = false) String username,
                          @RequestParam(value = "password", required = false) String password)
             {

        /*String username = request.getParameter("username");
        String password = request.getParameter("password");*/
        User user = new User();

        user.setUserName(username);
        user.setPassword(password);


        if(userServiceImpl.loginCheck(entity)){
            user = userServiceImpl.getUserByName(username);
            HttpSession session = request.getSession();
            session.setAttribute("user", user);
            //response.sendRedirect(request.getContextPath()+"/admin/loginSuccess.jsp");
            return "success";
        }else{
            return "fail";
        }

    }

    /**
     * z注册
     * @param request
     * @param response
     * @param userName
     * @param address
     * @param tel
     * @param email
     * @param password
     * @param sex
     * @param head
     * @return
     */
    @RequestMapping(value = "/register", method= RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> register(HttpServletRequest request, HttpServletResponse response,
                            @RequestParam(value = "userName") String userName,
                           @RequestParam(value = "address", required = false) String address,
                           @RequestParam(value = "tel", required = false) String tel,
                           @RequestParam(value = "email", required = false) String email,
                           @RequestParam(value = "password", required = false) String password,
                           @RequestParam(value = "sex", required = false) String sex,
                           @RequestParam(value = "head", required = false) String head,
                           @ModelAttribute User entity)
    {
        Map<String, Object> map = new HashMap<String, Object>();

        User user = new User();
        user.setUserName(userName);
        user.setPassword(password);
        user.setAddress(address);
        user.setTel(tel);
        user.setEmail(email);
        user.setSex(sex);
        user.setHead(head);
        try {
            Integer ret = userServiceImpl.addUser(entity);
            if(ret == 1){
                map.put("result", "success");
                map.put("user",entity);
            }else if(ret == -1){
                map.put("result", "当前用户名已经被使用");
            }else{
                map.put("result", "创建失败");
            }


        } catch (Exception e) {
            //dxpLog.error("Failed in create org process " + name, e);
            map.put("result", "创建失败，请稍后重试");
        }

      return  map;
    }

}
