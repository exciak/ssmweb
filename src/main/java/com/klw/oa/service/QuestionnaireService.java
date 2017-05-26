package com.klw.oa.service;

import com.klw.oa.entity.Question;
import com.klw.oa.entity.Questionnaire;
import com.klw.oa.entity.model.QuestionRecModel;
import com.klw.oa.entity.model.QuestionnaireRecModel;
import com.klw.oa.model.QuestionnaireShowModel;

import java.util.HashMap;
import java.util.List;

/**
 * Created by admins on 2017/4/22.
 */
public interface QuestionnaireService {

    List<Questionnaire> getAllByPage(Questionnaire questionnaire, int pageIndex, int pageNum);

    List<Questionnaire> getAllComplexByPage(Questionnaire questionnaire, int pageIndex, int pageNum);

    Questionnaire getSimpleById(Integer questionnaireId);

    Questionnaire getComplexById(Integer questionnaireId);

    Integer addQuestionnaire(Questionnaire questionnaire);

    String addQuestionnaireWithQuestion(Questionnaire questionnaire);

    Questionnaire fromQnrmToQuestionnaire(QuestionnaireRecModel questionnaireRecModel);

    List<Question> fromQrmToQuestions( List<HashMap<String,Object>> questionRecModelList);

    Integer selectCountByName(Questionnaire questionnaire);

    Integer editPulishState(Questionnaire questionnaire);

    Integer delQuestionnaireById(Integer questionnaireId);

    QuestionnaireShowModel fromEntityToShowModel(Questionnaire questionnaire);

    List<QuestionnaireShowModel> fromListToShowModels(List<Questionnaire> questionnaireList);
}
