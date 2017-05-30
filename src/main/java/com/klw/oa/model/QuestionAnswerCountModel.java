package com.klw.oa.model;

import com.klw.oa.entity.Question;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/5/30.
 */
public class QuestionAnswerCountModel {
    private Integer questionnaireId;
    private Question question;
    private List<SelectModel> answers;

    public void setQuestionnaireId(Integer questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public Integer getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public void setAnswers(List<SelectModel> answers) {
        this.answers = answers;
    }

    public Question getQuestion() {
        return question;
    }

    public List<SelectModel> getAnswers() {
        return answers;
    }
}
