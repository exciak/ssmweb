package com.klw.oa.service;

import com.klw.oa.entity.Question;

import java.util.List;

/**
 * Created by exciak on 2017/4/24.
 */
public interface QuestionService {
    Question getById(Integer questionId);

    int editQuestions(List<Question> questionList);
}
