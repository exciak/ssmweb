package com.klw.oa.dao;

import java.util.List;
import java.util.Map;

import com.klw.oa.entity.Teacher;

public interface TeacherMapper {
    int deleteByPrimaryKey(Integer techid);

    int insert(Teacher record);

    int insertSelective(Teacher record);

    Teacher selectByPrimaryKey(Integer techid);

    int updateByPrimaryKeySelective(Teacher record);

    int updateByPrimaryKey(Teacher record);
    
    Teacher selectByName(String techName);
    
    List<Teacher> selectAllByPage(Map<String,Object> map);
    List<Teacher> selectAll();
    
    int countByCriteriaTech(Teacher criteriaTech);
}