package com.klw.oa.serviceImpl;


import com.klw.oa.dao.QuestionMapper;
import com.klw.oa.dao.QuestionnaireMapper;
import com.klw.oa.entity.Question;
import com.klw.oa.entity.Questionnaire;
import com.klw.oa.service.QuestionService;
import com.klw.oa.service.QuestionnaireService;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.persistence.criteria.CriteriaBuilder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by admins on 2017/4/22.
 */
@Service("QuestionnaireServiceImpl")
public class QuestionnaireServiceImpl implements QuestionnaireService{
    @Autowired

    SqlSessionFactory factory;
    @Autowired
    QuestionnaireMapper questionnaireMapper;

    @Autowired
    QuestionMapper questionMapper;

    @Override
    public List<Questionnaire> getAllByPage(Questionnaire questionnaire, int pageIndex, int pageNum) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("questionnaireCriteria", questionnaire);
        map.put("pageIndex", pageIndex);
        map.put("pageNum", pageNum);

        List<Questionnaire> questionnaires = null;

        questionnaires = questionnaireMapper.selectAllByPage(map);



        return questionnaires;
    }

    @Override
    public Questionnaire getComplexById(Integer questionnaireId) {
        return questionnaireMapper.selectComplexById(questionnaireId);
    }


    @Override
    public List<Questionnaire> getAllComplexByPage(Questionnaire questionnaire, int pageIndex, int pageNum) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("questionnaireCriteria", questionnaire);
        map.put("pageIndex", pageIndex);
        map.put("pageNum", pageNum);

        List<Questionnaire> questionnaires = null;

        questionnaires = questionnaireMapper.selectComplexByPage(map);



        return questionnaires;
    }

    @Override
    public Integer addQuestionnaire(Questionnaire questionnaire) {
        return questionnaireMapper.insertSelective(questionnaire);
    }


    /**
     * 添加问卷接口
     * @param questionnaire
     * @return
     */
    @Override
    public String addQuestionnaireWithQuestion(Questionnaire questionnaire) {
        List<Question> questions = questionnaire.getQuestions();

        questionnaire.setQuestions(null);

        addQuestionnaire(questionnaire);

        for (Question question:questions
             ) {
            question.setQuestionnaireId(questionnaire.getQuestionnaireId());
            questionMapper.insertSelective(question);
        }

        return "success";
    }
}
