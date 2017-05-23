package com.klw.oa.dao;

import com.klw.oa.entity.Questionnaire;

import java.util.List;
import java.util.Map;

public interface QuestionnaireMapper {
    int deleteByPrimaryKey(Integer questionnaireId);

    int insert(Questionnaire record);

    int insertSelective(Questionnaire record);

    Questionnaire selectByPrimaryKey(Integer questionnaireId);

    int updateByPrimaryKeySelective(Questionnaire record);

    int updateByPrimaryKey(Questionnaire record);

    List<Questionnaire> selectAllByPage(Map<String,Object> map);

    List<Questionnaire> selectComplexByPage(Map<String,Object> map);

    Questionnaire selectComplexById(Integer questionnaireId);

    Integer selectCountByName(Map<String,Object> map);
}