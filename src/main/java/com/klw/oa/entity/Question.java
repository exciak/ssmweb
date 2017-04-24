package com.klw.oa.entity;

import javax.persistence.Entity;

@Entity(name = "question")
public class Question {
    private Integer questionId;

    private Integer questionnaireId;

    private String questionName;

    private String questionType;

    private String questionSelection;

    public Question() {
    }

    public Question(Integer questionId, Integer questionnaireId, String questionName, String questionType, String questionSelection) {
        this.questionId = questionId;
        this.questionnaireId = questionnaireId;
        this.questionName = questionName;
        this.questionType = questionType;
        this.questionSelection = questionSelection;
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

    public String getQuestionName() {
        return questionName;
    }

    public void setQuestionName(String questionName) {
        this.questionName = questionName == null ? null : questionName.trim();
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType == null ? null : questionType.trim();
    }

    public String getQuestionSelection() {
        return questionSelection;
    }

    public void setQuestionSelection(String questionSelection) {
        this.questionSelection = questionSelection == null ? null : questionSelection.trim();
    }

    @Override
    public String toString() {
        return "Question{" +
                "questionId=" + questionId +
                ", questionnaireId=" + questionnaireId +
                ", questionName='" + questionName + '\'' +
                ", questionType='" + questionType + '\'' +
                ", questionSelection='" + questionSelection + '\'' +
                '}';
    }
}