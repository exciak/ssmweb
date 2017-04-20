package com.klw.oa.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.klw.oa.entity.Dept;
import com.klw.oa.service.DeptService;

@Controller
@RequestMapping("/dept")
public class DeptControl {

	@Autowired
	private DeptService deptSer;
	@RequestMapping("/listData")
	@ResponseBody
	public List<Map<Object,Object>> zTreeData(){
		List<Map<Object,Object>> listM = deptSer.getAllMap();
		
		return listM;
	}
	@RequestMapping("/zTree")
	public String toZtree(){

		return "jsp/hello";
	}
	@RequestMapping("/testData")
	@ResponseBody
	public Map<Object,Object> testData(@RequestBody Dept  dept){
		Map<Object,Object> map = new HashMap<Object, Object>();
		int result =0;
		if(dept.getDept_id()!=null){
			if(dept.getPid()==null){
				dept.setDept_url(0+","+dept.getDept_id());
			}
			//System.out.println("=============================="+dept.getDept_url());
			result= deptSer.editDept(dept);
			if(result >0){
				map.put("rs", 1);
			}else{
				map.put("rs", 0);
			}
		}else{
			//没有传id过来的就是新节点
			 deptSer.addDept(dept);
			dept.setDept_url(dept.getDept_url()+","+dept.getDept_id());
			 result= deptSer.editDept(dept);
			if(result >0){
				map.put("rs", 1);
			}else{
				map.put("rs", 0);
			}
			//System.out.println(dept.getDept_url());
		}
		return map;
	}
	@RequestMapping("/delDept")
	@ResponseBody
	public Map<Object,Object> delDept(@RequestBody Dept  dept){
		Map<Object,Object> map = new HashMap<Object, Object>();
		int result =0;
		
		result = deptSer.delDept(dept);
		if(result >0){
			map.put("rs", 1);
		}else{
			map.put("rs", 0);
		}
		return map;
	}
}
