package com.klw.oa.dao;

import com.klw.oa.entity.QuestionAnswer;

import java.util.List;
import java.util.Map;

public interface QuestionAnswerMapper {
    int deleteByPrimaryKey(Integer questionAnswerid);

    int insert(QuestionAnswer record);

    int insertSelective(QuestionAnswer record);

    QuestionAnswer selectByPrimaryKey(Integer questionAnswerid);


    int updateByPrimaryKeySelective(QuestionAnswer record);

    int updateByPrimaryKey(QuestionAnswer record);

    List<Map<String,Object>> selectCountAnswer(Integer questionnaireId);

    List<Integer> selectQuestionsById(Integer questionnaireId);
}