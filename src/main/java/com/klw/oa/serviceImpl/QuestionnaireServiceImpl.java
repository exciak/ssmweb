package com.klw.oa.serviceImpl;


import com.klw.oa.dao.QuestionnaireMapper;
import com.klw.oa.entity.Questionnaire;
import com.klw.oa.service.QuestionnaireService;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
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
}
