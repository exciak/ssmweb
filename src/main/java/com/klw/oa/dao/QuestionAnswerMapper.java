package com.klw.oa.dao;

import com.klw.oa.entity.QuestionAnswer;

public interface QuestionAnswerMapper {
    int deleteByPrimaryKey(Integer questionAnswerid);

    int insert(QuestionAnswer record);

    int insertSelective(QuestionAnswer record);

    QuestionAnswer selectByPrimaryKey(Integer questionAnswerid);

    int updateByPrimaryKeySelective(QuestionAnswer record);

    int updateByPrimaryKey(QuestionAnswer record);
}