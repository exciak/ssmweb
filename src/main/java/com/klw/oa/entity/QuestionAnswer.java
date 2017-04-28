package com.klw.oa.entity;

public class QuestionAnswer {
    private Integer questionAnswerid;

    private Integer questionId;

    private String description;

    private Integer questionnaireId;

    private Long groupNumber;

    private String questionType;

    public Integer getQuestionAnswerid() {
        return questionAnswerid;
    }

    public void setQuestionAnswerid(Integer questionAnswerid) {
        this.questionAnswerid = questionAnswerid;
    }

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public Integer getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(Integer questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public Long getGroupNumber() {
        return groupNumber;
    }

    public void setGroupNumber(Long groupNumber) {
        this.groupNumber = groupNumber;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType == null ? null : questionType.trim();
    }
}