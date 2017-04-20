package com.klw.oa.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.klw.oa.entity.Page;
import com.klw.oa.entity.Teacher;
import com.klw.oa.service.TeacherService;

@Controller
@RequestMapping("/tech")
public class TeacherControl {
	@Autowired
	TeacherService techService;
	
	// 跳转到管理页面
	@RequestMapping("/listTech")
	public String listProfession() {

		return "teacher/teacher-list";
	}
	
	// 准备要显示的数据
	@RequestMapping("/listData")
	@ResponseBody
	public Map<Object, Object> listTechData(Page page, Teacher criteriaTech) {
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
		List<Teacher> list = techService.getAllTechByPage(criteriaTech,
				(pageIndex - 1) * pageSize, pageSize);

		int count = techService.countTechByCriteria(criteriaTech);
		Map<Object, Object> map = new HashMap<Object, Object>();

		map.put("total", count);
		map.put("rows", list);

		return map;
	}
	
	// 打开添加页面
	@RequestMapping("/addTechPage")
	public String addTechPage() {

		
		return "teacher/add-teacher";
	}
	//执行添加
	@ResponseBody
	@RequestMapping("/addTech")
	public Map<Object,Object> addTeacher(Teacher teacher){
		int result = techService.addTech(teacher);
		
		Map<Object,Object> map = new HashMap<Object,Object>();
		
		map.put("tag",result );
		if(result>0){
			map.put("msg","添加成功！" );
		}else if(result==-1){
			map.put("msg","该教师已经存在！" );
		}else{
			map.put("msg","添加失败！");
		}
		
		return map;
	}
	
	//删除teacher
	@ResponseBody
	@RequestMapping("/delTech")
	public Map<Object,Object> delProfession(int id){
		
		int result = techService.delTech(id);
		Map<Object,Object> map = new HashMap<Object,Object>();
	
		map.put("tag",result );
		if(result>0){
			map.put("msg","删除成功！" );
		}else if(result==-1){
			
			map.put("msg","该专业下有班级存在，不能删除!");
		}else{
			map.put("msg","添加失败！");
		}
		
		return map;
	}
	//跳转到修改页面
	@RequestMapping("/editTechData")
	public String editTeacherData(HttpServletRequest request,int id){
		Teacher tech = techService.getById(id);
		request.setAttribute("tech", tech);
		return "teacher/edit-teacher";
	}
	
	//进行修改操作
	@ResponseBody
	@RequestMapping("/editTech")
	public Map<Object,Object> editTeacher(Teacher teacher){
		int result = techService.editTech(teacher);
		Map<Object,Object> map = new HashMap<Object,Object>();
	
		map.put("tag",result );
		if(result>0){
			map.put("msg","修改成功！" );
		}else if(result==-1){
			
			map.put("msg","该教师名已经存在!");
		}else{
			map.put("msg","修改失败！");
		}
		
		return map;
		
	}
}
