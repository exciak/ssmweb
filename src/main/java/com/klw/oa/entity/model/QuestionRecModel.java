package com.klw.oa.entity.model;

/**
 * Created by Administrator on 2017/5/21.
 */
public class QuestionRecModel {
    private String questionTitle;

    private Integer isNecessary;

    private Integer isEdit;

    private String questionChoice;

    private String questionGenre;

    public String getQuestionTitle() {
        return questionTitle;
    }

    public Integer getIsNecessary() {
        return isNecessary;
    }

    public Integer getIsEdit() {
        return isEdit;
    }

    public String getQuestionChoice() {
        return questionChoice;
    }

    public String getQuestionGenre() {
        return questionGenre;
    }

    public void setQuestionTitle(String questionTitle) {
        this.questionTitle = questionTitle;
    }

    public void setIsNecessary(Integer isNecessary) {
        this.isNecessary = isNecessary;
    }

    public void setIsEdit(Integer isEdit) {
        this.isEdit = isEdit;
    }

    public void setQuestionChoice(String questionChoice) {
        this.questionChoice = questionChoice;
    }

    public void setQuestionGenre(String questionGenre) {
        this.questionGenre = questionGenre;
    }
}
