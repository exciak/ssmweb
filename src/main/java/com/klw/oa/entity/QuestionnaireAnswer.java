package com.klw.oa.entity;

public class QuestionnaireAnswer {
    private Integer questionnaireAnswerid;

    private Integer questionnaireId;

    private Long countAnswer;

    public Integer getQuestionnaireAnswerid() {
        return questionnaireAnswerid;
    }

    public void setQuestionnaireAnswerid(Integer questionnaireAnswerid) {
        this.questionnaireAnswerid = questionnaireAnswerid;
    }

    public Integer getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(Integer questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public Long getCountAnswer() {
        return countAnswer;
    }

    public void setCountAnswer(Long countAnswer) {
        this.countAnswer = countAnswer;
    }
}