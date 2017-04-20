package com.klw.oa.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.klw.oa.entity.Classes;
import com.klw.oa.entity.Page;
import com.klw.oa.entity.Teacher;
import com.klw.oa.entity.TechCls;
import com.klw.oa.service.ClassesService;
import com.klw.oa.service.TeacherService;
import com.klw.oa.service.TechClsService;

@Controller
@RequestMapping("/techcls")
public class TechClsControl {

	@Resource(name = "clsService")
	ClassesService service;
	@Resource(name = "techService")
	TeacherService tService;
	
	@Resource(name = "techClsService")
	TechClsService techClsservice;
	
	//跳转到显示页面
	@RequestMapping("/showData")
	public String showTechclsData(HttpServletRequest request,int id){
		List<TechCls> tcs = techClsservice.getAllByClsId(id);
		Classes cls = service.getById(id);
		request.setAttribute("tcs", tcs);
		request.setAttribute("cls", cls);
		return "techcls/showtechcls";
	}
	//跳转到修改页面
	@RequestMapping("/editCls")
	public String techclsData(HttpServletRequest request,int id){
		List<TechCls> tcs = techClsservice.getAllByClsId(id);
		Classes cls = service.getById(id);
		request.setAttribute("tcs", tcs);
		request.setAttribute("cls", cls);
		return "techcls/manage-techcls";
	}
	//准备分配老师的数据
	@RequestMapping("/addTechCls")
	public String addTechclsData(HttpServletRequest request,int id){
		List<Teacher> ts = tService.getAll();
		Classes cls = service.getById(id);
		request.setAttribute("ts", ts);
		request.setAttribute("cls", cls);
		return "techcls/addTechCls";
	}
	//准备分配老师的数据
	@RequestMapping("/addTech")
	public String addTechcls(TechCls tcls,HttpServletResponse response){
		int result = techClsservice.addTechCls(tcls);
		if(result == 0){
			try {
				response.getWriter().print("<script>alert('添加失败');history.go(-1);</script");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return null;
		}else{
			return "redirect:/techcls/editCls?id="+tcls.getClasses().getClassid();
		}
	}
// 准备要显示的数据
	@RequestMapping("/listData")
	@ResponseBody
	public Map<Object, Object> listTechClsData(Page page, Classes criteriaClasses) {
		int pageIndex, pageSize;
		if (page.getPage() == 0) {
			pageIndex = 1;
		} else {
			pageIndex = page.getPage();
		}
		if (page.getRows() == 0) {
			pageSize = 2;
		} else {
			pageSize = page.getRows();
		}
		Map<String, Object> m = null;
		String techs = "";
		List<Map<String, Object>> listm = new ArrayList<Map<String, Object>>();
		List<Classes> list = service.getAllClsByPage(criteriaClasses,
				(pageIndex - 1) * pageSize, pageSize);
		for (Classes classes : list) {
			m = new HashMap<String, Object>();
			techs = techClsservice.getAllTechClsByClsId(classes.getClassid());
			m.put("techs", techs);
			m.put("cls", classes);
			listm.add(m);
		}

		int count = service.countClsByName(criteriaClasses);
		Map<Object, Object> map = new HashMap<Object, Object>();

		map.put("total", count);
		map.put("rows", listm);

		return map;
	}
	// 跳转到管理页面
	@RequestMapping("/listTechCls")
	public String listTechCls() {

		return "techcls/techcls-list";
	}
	@RequestMapping("/delTechCls")
	public String delTechCls(Integer id,Integer classid,HttpServletResponse response){
		
		int result = techClsservice.delTechCls(id);
		if(result == 0){
			try {
				response.getWriter().print("<script>alert('删除失败');history.go(-1);</script");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return null;
		}else{
			return "redirect:/techcls/editCls?id="+classid;
		}
	}
	@RequestMapping("/updateTechClsData")
	public String updateTechClsData(Integer id,Integer classid,HttpServletRequest request){
		TechCls techCls = techClsservice.getById(id);
		Classes cls = service.getById(classid);
		List<Teacher> ts = tService.getAll();
		request.setAttribute("techCls", techCls);
		request.setAttribute("cls", cls);
		request.setAttribute("ts", ts);
		return "techcls/edittechcls";
		
	}
	@RequestMapping("/updateTechcls")
	public String updateTechcls(TechCls tcls,HttpServletResponse response){
		int result = techClsservice.editTechCls(tcls);
		if(result == 0){
			try {
				response.getWriter().print("<script>alert('修改失败');history.go(-1);</script");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return null;
		}else{
			return "redirect:/techcls/editCls?id="+tcls.getClasses().getClassid();
		}
		
	}
}
