package com.klw.oa.entity.model;

/**
 * Created by Administrator on 2017/5/21.
 */
public class QuestionnaireRecModel {

    private Integer questionnaireId;

    private String questionnaireTitle;

    private String questionnairePrompt;

    private String questionnaireType;

    private String questionnaireCatalog;

    private Integer createId;

    private String qState;

    public Integer getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(Integer questionnaireId) {

        this.questionnaireId = questionnaireId;
    }

    public String getQuestionnaireTitle() {
        return questionnaireTitle;
    }

    public String getQuestionnairePrompt() {
        return questionnairePrompt;
    }

    public String getQuestionnaireType() {
        return questionnaireType;
    }

    public String getQuestionnaireCatalog() {
        return questionnaireCatalog;
    }

    public Integer getCreateId() {
        return createId;
    }

    public String getqState() {
        return qState;
    }

    public void setQuestionnaireTitle(String questionnaireTitle) {
        this.questionnaireTitle = questionnaireTitle;
    }

    public void setQuestionnairePrompt(String questionnairePrompt) {
        this.questionnairePrompt = questionnairePrompt;
    }

    public void setQuestionnaireType(String questionnaireType) {
        this.questionnaireType = questionnaireType;
    }

    public void setQuestionnaireCatalog(String questionnaireCatalog) {
        this.questionnaireCatalog = questionnaireCatalog;
    }

    public void setCreateId(Integer createId) {
        this.createId = createId;
    }

    public void setqState(String qState) {
        this.qState = qState;
    }
}
