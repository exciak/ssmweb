package com.klw.oa.entity;

public class QuestionAnswerCount {
    private Integer questionAnswercountid;

    private Integer questionnaireId;

    private Integer questionId;

    private Long answerCount;

    public Integer getQuestionAnswercountid() {
        return questionAnswercountid;
    }

    public void setQuestionAnswercountid(Integer questionAnswercountid) {
        this.questionAnswercountid = questionAnswercountid;
    }

    public Integer getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(Integer questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public Long getAnswerCount() {
        return answerCount;
    }

    public void setAnswerCount(Long answerCount) {
        this.answerCount = answerCount;
    }
}