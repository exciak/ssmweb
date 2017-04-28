package com.klw.oa.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Entity;
import java.util.Date;
import java.util.List;

@Entity(name = "questionnaire")
public class Questionnaire {
    private Integer questionnaireId;

    private String questionnaireName;

    @JsonFormat(pattern="yyyy-MM-dd",timezone="GMT+8")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    private Date createTime;

    @JsonFormat(pattern="yyyy-MM-dd",timezone="GMT+8")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    private Date updateTime;

    private String questionnaireType;

    private String questionnaireCatalog;

    private Integer createId;

    private List<Question> questions;


    public Questionnaire (){

    }



    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public Integer getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(Integer questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public String getQuestionnaireName() {
        return questionnaireName;
    }

    public void setQuestionnaireName(String questionnaireName) {
        this.questionnaireName = questionnaireName == null ? null : questionnaireName.trim();
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getQuestionnaireType() {
        return questionnaireType;
    }

    public void setQuestionnaireType(String questionnaireType) {
        this.questionnaireType = questionnaireType == null ? null : questionnaireType.trim();
    }

    public String getQuestionnaireCatalog() {
        return questionnaireCatalog;
    }

    public void setQuestionnaireCatalog(String questionnaireCatalog) {
        this.questionnaireCatalog = questionnaireCatalog == null ? null : questionnaireCatalog.trim();
    }

    public Integer getCreateId() {
        return createId;
    }

    public void setCreateId(Integer createId) {
        this.createId = createId;
    }

    @Override
    public String toString() {
        return "Questionnaire{" +
                "questionnaireId=" + questionnaireId +
                ", questionnaireName='" + questionnaireName + '\'' +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                ", questionnaireType='" + questionnaireType + '\'' +
                ", questionnaireCatalog='" + questionnaireCatalog + '\'' +
                ", createId=" + createId +
                ", questions=" + questions +
                '}';
    }
}