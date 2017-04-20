package com.klw.oa.dao;

import java.util.List;
import java.util.Map;

import com.klw.oa.entity.Profession;

public interface ProfessionMapper {
    int deleteByPrimaryKey(Integer prosid);

    int insert(Profession record);

    int insertSelective(Profession record);

    Profession selectByPrimaryKey(Integer prosid);
    
    Profession selectByName(String  prosname);
    
    List<Profession> selectAll();
    
    List<Profession> selectAllByPage(Map<String,Object> map);

    int updateByPrimaryKeySelective(Profession record);

    int updateByPrimaryKey(Profession record);
    
    int countByProfess(Profession record);
    
    Profession selectProById(Integer id);
}