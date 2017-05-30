package com.klw.oa.dao;

import com.klw.oa.entity.QuestionnaireAnswer;

public interface QuestionnaireAnswerMapper {
    int deleteByPrimaryKey(Integer questionnaireAnswerid);

    int insert(QuestionnaireAnswer record);

    int insertSelective(QuestionnaireAnswer record);

    QuestionnaireAnswer selectByPrimaryKey(Integer questionnaireAnswerid);

    QuestionnaireAnswer selectByQuestionnaireId(Integer questionAnswerid);

    int updateByPrimaryKeySelective(QuestionnaireAnswer record);

    int updateByPrimaryKey(QuestionnaireAnswer record);
}