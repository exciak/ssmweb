package com.klw.oa.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.klw.oa.entity.Classes;
import com.klw.oa.entity.Page;
import com.klw.oa.entity.Profession;
import com.klw.oa.service.ClassesService;
import com.klw.oa.service.ProfessionService;

@Controller
@RequestMapping("/cls")
public class ClassesControl {
	@Resource(name = "clsService")
	ClassesService service;

	@Resource(name="proService")
	ProfessionService proService;
	// 跳转到管理页面
	@RequestMapping("/listCls")
	public String listProfession() {

		return "cls/classes-list";
	}

	// 准备要显示的数据
	@RequestMapping("/listData")
	@ResponseBody
	public Map<Object, Object> listProData(Page page, Classes criteriaClasses) {
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
		List<Classes> list = service.getAllClsByPage(criteriaClasses,
				(pageIndex - 1) * pageSize, pageSize);

		int count = service.countClsByName(criteriaClasses);
		Map<Object, Object> map = new HashMap<Object, Object>();

		map.put("total", count);
		map.put("rows", list);

		return map;
	}

	// 打开添加页面
	@RequestMapping("/addClsData")
	public String addClassData(HttpServletRequest request) {

		/*List<Profession> professions = proService.getAllPros();
		
		request.setAttribute("professions", professions);*/
		return "cls/add-class";
	}
	
	//执行添加操作
	@ResponseBody
	@RequestMapping("/addCls")
	public Map<Object,Object> addClasses(Classes classes){
		
		
		int result = service.addClass(classes);
		
		
		Map<Object,Object> map = new HashMap<Object,Object>();
		
		map.put("tag",result );
		if(result>0){
			map.put("msg","添加成功！" );
		}else if(result==-1){
			map.put("msg","该班级已经存在！" );
		}else{
			map.put("msg","添加失败！");
		}
		
		return map;
	}
	//删除classes
	@ResponseBody
	@RequestMapping("/delClass")
	public Map<Object,Object> delClasses(int id){
		
		int result = service.delClass(id);
		Map<Object,Object> map = new HashMap<Object,Object>();
	
		map.put("tag",result );
		if(result>0){
			map.put("msg","删除成功！" );
		}else if(result==-1){
			
			map.put("msg","该班级有带班记录，不能删除！");
		}else {
			map.put("msg","删除失败！" );
		}
		
		return map;
	}
	//跳转到修改页面
	@RequestMapping("/editClsData")
	public String editProfessionData(HttpServletRequest request,int id){
		Classes classes = service.getById(id);
		List<Profession> professions = proService.getAllPros();
		
		request.setAttribute("professions", professions);
		request.setAttribute("classes", classes);
		return "cls/edit-class";
	}
	//进行修改操作
	@ResponseBody
	@RequestMapping("/editCls")
	public Map<Object,Object> editClasses(Classes classes){
		int result = service.editClass(classes);
		Map<Object,Object> map = new HashMap<Object,Object>();
	
		map.put("tag",result );
		if(result>0){
			map.put("msg","修改成功！" );
		}else if(result==-1){
			
			map.put("msg","该班级名已经存在!");
		}else{
			map.put("msg","修改失败！");
		}
		
		return map;
		
	}
}
