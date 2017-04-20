package com.klw.oa.dao;

import java.util.List;
import java.util.Map;

import com.klw.oa.entity.Classes;

public interface ClassesMapper {
    int deleteByPrimaryKey(Integer classid);

    int insert(Classes record);

    int insertSelective(Classes record);

    Classes selectByPrimaryKey(Integer classid);

    int updateByPrimaryKeySelective(Classes record);

    int updateByPrimaryKey(Classes record);
    
    int selectByProsId(Integer prosid);
    
    List<Classes> selectAllByPage(Map<String,Object> map);
    List<Classes> selectAllByCls(Map<String,Object> map);
    
    int countByClasses(Map<String,Object> map);
    
    Classes selectByName(String clsname);
}