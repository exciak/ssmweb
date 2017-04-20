package com.klw.oa.service;

import java.util.List;

import com.klw.oa.entity.Classes;

public interface ClassesService {
	List<Classes> getAllClsByPage(Classes classes,int pageIndex,int pageSize);
	List<Classes> getClassesByCls(Classes classes,int pageIndex,int pageSize);
		
	int countClsByName(Classes criteriaClasses);
	
	Classes getByName(String clsname);
	
	int addClass(Classes classes);
	
	int delClass(Integer classid);
	
	Classes getById(Integer id);
	
	int editClass(Classes classes);
}
