package com.klw.oa.dao;

import java.util.List;

import com.klw.oa.entity.TechCls;

public interface TechClsMapper {
    int deleteByPrimaryKey(Integer techclsid);

    int insert(TechCls record);

    int insertSelective(TechCls record);

    TechCls selectByPrimaryKey(Integer techclsid);

    int updateByPrimaryKeySelective(TechCls record);

    int updateByPrimaryKey(TechCls record);
    
    List<TechCls> selectAll();
    List<TechCls> selectAllByClsId(Integer clsid);
    
    int selectByClsId(Integer classid);
}