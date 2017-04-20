package com.klw.oa.service;

import java.util.List;

import com.klw.oa.entity.Teacher;

public interface TeacherService {

	List<Teacher> getAllTechByPage(Teacher techCriteria, int pageIndex,
			int pageSize);
	List<Teacher> getAll();
	int countTechByCriteria(Teacher criteriaTech);
	
	int addTech(Teacher teacher);
	
	int delTech(Integer techid);
	
	Teacher getById(Integer techid);
	
	int editTech(Teacher tech);
}
