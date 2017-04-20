package com.klw.oa.service;

import java.util.List;
import java.util.Map;

import com.klw.oa.entity.Dept;

public interface DeptService {

	List<Map<Object,Object>> getAllMap();
	
	int addDept(Dept dept);
	
	int editDept(Dept dept);
	
	int delDept(Dept dept);
}
