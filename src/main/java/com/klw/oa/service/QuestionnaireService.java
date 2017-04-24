package com.klw.oa.service;

import com.klw.oa.entity.Questionnaire;

import java.util.List;

/**
 * Created by admins on 2017/4/22.
 */
public interface QuestionnaireService {

    List<Questionnaire> getAllByPage(Questionnaire questionnaire, int pageIndex, int pageNum);

    List<Questionnaire> getAllComplexByPage(Questionnaire questionnaire, int pageIndex, int pageNum);

    Questionnaire getComplexById(Integer questionnaireId);
}
