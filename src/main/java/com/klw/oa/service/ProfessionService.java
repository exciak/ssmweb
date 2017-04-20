package com.klw.oa.service;

import java.util.List;

import com.klw.oa.entity.Profession;

public interface ProfessionService {

	List<Profession> getAllPros();

	List<Profession> getAllProsByPage(Profession profession,int pageIndex,int pageNum);
	
	Profession getByName(String name);
	
	Profession getById(Integer id);
	
	int addProfession(Profession profession);
	
	int countProsByName(Profession profession);
	
	int delProfession(Integer prosid);
	
	int editProfession(Profession profession);
}
