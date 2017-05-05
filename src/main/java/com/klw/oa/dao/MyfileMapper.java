package com.klw.oa.dao;

import com.klw.oa.entity.Myfile;

import java.util.List;

public interface MyfileMapper {
    int deleteByPrimaryKey(Integer fileId);

    int insert(Myfile record);

    int insertSelective(Myfile record);

    Myfile selectByPrimaryKey(Integer fileId);

    int updateByPrimaryKeySelective(Myfile record);

    int updateByPrimaryKey(Myfile record);

    List<Myfile> selectByUserId(Integer userId);
}