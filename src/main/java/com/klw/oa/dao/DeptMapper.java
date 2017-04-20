package com.klw.oa.dao;

import java.util.List;
import java.util.Map;

import com.klw.oa.entity.Dept;

public interface DeptMapper {
    int deleteByPrimaryKey(Integer dept_id);

    int insert(Dept record);

    int insertSelective(Dept record);

    Dept selectByPrimaryKey(Integer dept_id);
    List<Dept> selectByPid(Integer pid);
    
    List<Map<Object,Object>> selectAllMap();

    int updateByPrimaryKeySelective(Dept record);

    int updateByPrimaryKey(Dept record);
    
    Dept selectByName(String deptName);
    
    int deleteByUrl(String dept_url);
}