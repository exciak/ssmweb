package com.klw.oa.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.klw.oa.entity.Classes;
import com.klw.oa.entity.Page;
import com.klw.oa.entity.Profession;
import com.klw.oa.service.ClassesService;
import com.klw.oa.service.ProfessionService;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/tes")
public class TestController {

    @RequestMapping("/index")
    public String editProfessionData(HttpServletRequest request){

        ModelAndView modelAndView = new ModelAndView("index.jsp");
        return "redirect:index";
    }
}
