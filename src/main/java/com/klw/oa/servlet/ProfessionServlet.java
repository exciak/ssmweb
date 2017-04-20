package com.klw.oa.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;


import com.klw.oa.dao.DateUtils;
import com.klw.oa.dao.JsonDateValueProcessor;
import com.klw.oa.entity.Datagrid;
import com.klw.oa.entity.Profession;
import com.klw.oa.entity.ResultJson;
import com.klw.oa.serviceImpl.ProfessionServiceImpl;

public class ProfessionServlet extends HttpServlet {

	
	/**
	 * 
	 */
	private static final long serialVersionUID = -3376062020257351416L;


	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		String methodName = request.getParameter("method");
		
		try {
			Method method = getClass().getDeclaredMethod(methodName, HttpServletRequest.class,HttpServletResponse.class);
			
			method.invoke(this,request, response);
	
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	

	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		doGet(request, response);
	}
	public void addprofession(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String prosname = request.getParameter("prosname");
		String prosdesc = request.getParameter("prosdesc");
		Date createdate = DateUtils.getDateByStr(request.getParameter("createdate"), "yyyy-MM-dd");
		ProfessionServiceImpl pfsi = new ProfessionServiceImpl();
		Profession profession = new Profession();
		profession.setCreateDate(createdate);
		profession.setProsname(prosname);
		profession.setProsdesc(prosdesc);
		
		int i = pfsi.addProfession(profession);
		PrintWriter out = response.getWriter();
		ResultJson rjson = new ResultJson();
		rjson.setTag(i);
		if(i>0){
			
			rjson.setMsg("添加成功！");
		}else if(i==0){
			
			rjson.setMsg("添加失败！");
		}else{
			rjson.setMsg("该专业已经存在！");
		}
		JSONObject json = JSONObject.fromObject(rjson);
		out.print(json);
	}
	public void listProfession(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		int pageSize = 2;
		int pageIndex = 1;
		if(request.getParameter("page")!=null){
			pageIndex = Integer.valueOf(request.getParameter("page"));
		}
		if(request.getParameter("rows")!=null){
			pageSize = Integer.valueOf(request.getParameter("rows"));
		}
		
		Profession professionCriteria = new Profession();
		String prosName = request.getParameter("prosName");
		if(prosName!=null&&!"".equals(prosName)){
			professionCriteria.setProsname(prosName);
		}
		ProfessionServiceImpl pfsi = new ProfessionServiceImpl();
		List<Profession> professions = pfsi.getAllProsByPage(professionCriteria, (pageIndex-1)*pageSize, pageSize);
		
		int count = pfsi.countProsByName(professionCriteria);
		Datagrid dg = new Datagrid();
		dg.setTotal(count);
		dg.setRows(professions);
		
		JsonConfig jsonConfig = new JsonConfig();   //JsonConfig是net.sf.json.JsonConfig中的这个，为固定写法  
		jsonConfig.registerJsonValueProcessor(Date.class , new JsonDateValueProcessor()); 
		JSONObject json = JSONObject.fromObject(dg,jsonConfig);
		
		response.getWriter().print(json);
	}

}
