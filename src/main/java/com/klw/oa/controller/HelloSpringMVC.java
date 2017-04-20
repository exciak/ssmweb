package com.klw.oa.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HelloSpringMVC {
	@RequestMapping("/hello")
	public String hello(HttpServletRequest request){
		request.setAttribute("result", "^-^hello spring mvc");
		
		return "hello";
	}

}
