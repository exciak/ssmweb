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
import com.klw.oa.entity.Profession;
import com.klw.oa.service.ProfessionService;

@Controller
@RequestMapping("/pro")
public class ProfessionControl {
	@Autowired
	ProfessionService service;
	//执行添加
	@ResponseBody
	@RequestMapping("/addPro")
	public Map<Object,Object> addProfession(Profession profession){
		int result = service.addProfession(profession);
		
		/*ResultJson rjson = new ResultJson();
		rjson.setTag(result);
		if(result>0){
			rjson.setMsg("添加成功！");
		}else if(result==-1){
			
			rjson.setMsg("该专业已经存在！");
		}else{
			rjson.setMsg("添加失败！");
		}
		JSONObject json = JSONObject.fromObject(rjson);
		out.print(json);
		return null;*/
		Map<Object,Object> map = new HashMap<Object,Object>();
		
		map.put("tag",result );
		if(result>0){
			map.put("msg","添加成功！" );
		}else if(result==-1){
			map.put("msg","该专业已经存在！" );
		}else{
			map.put("msg","添加失败！");
		}
		
		return map;
	}
	@ResponseBody
	@RequestMapping("/getPro")
	public List<Profession> getProfession(Profession profession){
		List<Profession> professions = service.getAllPros();
		
		return professions;
	}
	//打开添加页面
	@RequestMapping("/toadd")
	public String toAddPage(){
		
		return "profession/add-profession";
	}
	//准备要显示的数据
	@RequestMapping("/listData")
	@ResponseBody
	public Map<Object,Object> listProData(Page page,Profession criteriaProfession){
		int pageIndex,pageSize;
		
		if(page.getPage()==0){
			pageIndex = 1;
		}else{
			pageIndex =page.getPage();
		}
		if(page.getRows()==0){
			pageSize = 2;
		}else{
			pageSize = page.getRows();
		}
		List<Profession> professions = service.getAllProsByPage(criteriaProfession, (pageIndex-1)*pageSize, pageSize);
		
		int count = service.countProsByName(criteriaProfession);
		Map<Object,Object> map = new HashMap<Object,Object>();
		
		map.put("total",count );
		map.put("rows", professions);
		/*Datagrid dg = new Datagrid();
		dg.setTotal(count);
		dg.setRows(professions);
		
		JsonConfig jsonConfig = new JsonConfig();   //JsonConfig是net.sf.json.JsonConfig中的这个，为固定写法  
		jsonConfig.registerJsonValueProcessor(Date.class , new JsonDateValueProcessor()); 
		JSONObject json = JSONObject.fromObject(dg,jsonConfig);
		
		out.print(json);*/
		return map;
	}
	
	//跳转到管理页面
	@RequestMapping("/listPro")
	public String listProfession(){
		
		return "profession/profession-list";
	}
	//删除profession
	@ResponseBody
	@RequestMapping("/delPro")
	public Map<Object,Object> delProfession(int id){
		
		int result = service.delProfession(id);
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
	@RequestMapping("/editProData")
	public String editProfessionData(HttpServletRequest request,int id){
		Profession profession = service.getById(id);
		request.setAttribute("pros", profession);
		return "profession/edit-profession";
	}
	//进行修改操作
	@ResponseBody
	@RequestMapping("/editPro")
	public Map<Object,Object> editProfession(Profession profession){
		int result = service.editProfession(profession);
		Map<Object,Object> map = new HashMap<Object,Object>();
	
		map.put("tag",result );
		if(result>0){
			map.put("msg","修改成功！" );
		}else if(result==-1){
			
			map.put("msg","该专业名已经存在!");
		}else{
			map.put("msg","修改失败！");
		}
		
		return map;
		
	}
}
