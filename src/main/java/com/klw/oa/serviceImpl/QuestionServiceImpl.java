package com.klw.oa.serviceImpl;

import com.klw.oa.dao.QuestionMapper;
import com.klw.oa.entity.Question;
import com.klw.oa.entity.Questionnaire;
import com.klw.oa.service.QuestionService;
import com.klw.oa.service.QuestionnaireService;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.xml.ws.ServiceMode;
import java.util.List;

/**
 * Created by exciak on 2017/4/24.
 */
@Service("QuestionServiceImpl")
public class QuestionServiceImpl implements QuestionService {
    @Autowired
    SqlSessionFactory factory;

    @Autowired
    private QuestionMapper questionMapper;

    @Override
    public Question getById(Integer questionId) {
        return questionMapper.selectByPrimaryKey(questionId);
    }

    @Override
    public int editQuestions(List<Question> questionList) {

        int i = questionMapper.batchUpdateQuestions(questionList);
        return i;
    }
}
