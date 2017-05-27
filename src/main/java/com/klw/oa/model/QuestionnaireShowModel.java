package com.klw.oa.model;

import com.klw.oa.entity.Questionnaire;
import com.klw.oa.entity.User;

/**
 * Created by Administrator on 2017/5/26.
 */
public class QuestionnaireShowModel extends Questionnaire{
    private User user;

    private Integer questionCount;

    public Integer getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(Integer questionCount) {
        this.questionCount = questionCount;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
