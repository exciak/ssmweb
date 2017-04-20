package com.klw.oa.service;

import java.util.List;

import com.klw.oa.entity.TechCls;

public interface TechClsService {
	List<TechCls> getAllTechCls();
	String getAllTechClsByClsId(Integer clsid);
	List<TechCls> getAllByClsId(Integer clsid);
	int addTechCls(TechCls tcls);
	int delTechCls(Integer techclsid);
	TechCls getById(Integer techClsId);
	int editTechCls(TechCls tcls);
}
