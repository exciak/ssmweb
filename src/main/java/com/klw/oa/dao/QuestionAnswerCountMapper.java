package com.klw.oa.dao;

import com.klw.oa.entity.QuestionAnswerCount;

public interface QuestionAnswerCountMapper {
    int deleteByPrimaryKey(Integer questionAnswercountid);

    int insert(QuestionAnswerCount record);

    int insertSelective(QuestionAnswerCount record);

    QuestionAnswerCount selectByPrimaryKey(Integer questionAnswercountid);

    int updateByPrimaryKeySelective(QuestionAnswerCount record);

    int updateByPrimaryKey(QuestionAnswerCount record);
}