package com.klw.oa.service;

import com.klw.oa.entity.Question;
import com.klw.oa.entity.QuestionAnswer;
import com.klw.oa.entity.Questionnaire;
import com.klw.oa.entity.QuestionnaireAnswer;
import com.klw.oa.model.QuestionAnswerCountModel;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/5/30.
 */
public interface AnswerService {

    void transferAnswerData(Map<String,Object> answerData, Questionnaire questionnaire, List<QuestionAnswer> questionAnswers);

    String createAnswer(Questionnaire questionnaire, List<QuestionAnswer> questionAnswers);

    List<Map<String,Object>> getQuestionsCount(Integer questionnairId);

    List<Integer> getQuestionIdsfromId(Integer questionnaireId);

    List<QuestionAnswerCountModel> getModels(List<Map<String,Object>> map,List<Integer> list);
}
