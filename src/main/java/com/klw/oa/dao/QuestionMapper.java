package com.klw.oa.dao;

import com.klw.oa.entity.Question;

import java.util.List;

public interface QuestionMapper {
    int deleteByPrimaryKey(Integer questionId);

    int deleteByQuestionnaireId(Integer questionnaireId);

    int insert(Question record);

    int insertSelective(Question record);

    Question selectByPrimaryKey(Integer questionId);

    int updateByPrimaryKeySelective(Question record);

    int updateByPrimaryKeyWithBLOBs(Question record);

    int updateByPrimaryKey(Question record);

    int batchUpdateQuestions(List<Question> questions);

    int countQuestions(Integer questionnaireId);
}