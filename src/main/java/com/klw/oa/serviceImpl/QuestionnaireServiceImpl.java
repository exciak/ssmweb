package com.klw.oa.serviceImpl;


import com.klw.oa.dao.QuestionMapper;
import com.klw.oa.dao.QuestionnaireMapper;
import com.klw.oa.entity.Question;
import com.klw.oa.entity.Questionnaire;
import com.klw.oa.entity.model.QuestionRecModel;
import com.klw.oa.entity.model.QuestionnaireRecModel;
import com.klw.oa.service.QuestionService;
import com.klw.oa.service.QuestionnaireService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.persistence.criteria.CriteriaBuilder;
import java.util.*;

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

    /**
     * 问卷model转为问卷entity
     * @param questionnaireRecModel
     * @return
     */
    @Override
    public Questionnaire fromQnrmToQuestionnaire(QuestionnaireRecModel questionnaireRecModel) {
        Questionnaire questionnaire = null;

        if(null != questionnaireRecModel){
            questionnaire = new Questionnaire();
            //如果有id则为更新的实体，否则为创建
            if(questionnaireRecModel.getQuestionnaireId() == null || 0 == questionnaireRecModel.getQuestionnaireId()){
                questionnaire.setQuestionnaireId(questionnaireRecModel.getQuestionnaireId());
                questionnaire.setCreateTime(new Date());
                questionnaire.setUpdateTime(new Date());
            }else{
                questionnaire.setUpdateTime(new Date());
            }
            questionnaire.setQuestionnaireName(questionnaireRecModel.getQuestionnaireTitle());
            //设置状态为未发布
            questionnaire.setQuesState(0);
            questionnaire.setQuestionnairePrompt(questionnaireRecModel.getQuestionnairePrompt());
        }

        return questionnaire;
    }

    @Override
    public List<Question> fromQrmToQuestions( List<HashMap<String,Object>> questionRecModelList) {

        List<Question> questions = new ArrayList<Question>();

        Question question = null;

        if(null != questionRecModelList && questionRecModelList.size() > 0 ){
            for (HashMap<String,Object> questionRecModel:questionRecModelList
                 ) {
                question = new Question();

                question.setQuestionName(questionRecModel.get("questionTitle").toString());
                question.setQuestionType(questionRecModel.get("questionGenre").toString());
                if("false".equals(questionRecModel.get("isEdit").toString())){
                    question.setIsEdit(0);
                }else{
                    question.setIsEdit(1);
                }
                if("false".equals(questionRecModel.get("isNecessary").toString())){
                    question.setIsNecessary(0);
                }else{
                    question.setIsNecessary(1);
                }
                question.setQuestionSelection(JSONArray.fromObject(questionRecModel.get("questionChoice")).toString());

                questions.add(question);
            }

        }
        return questions;
    }

    @Override
    public Integer selectCountByName(Questionnaire questionnaire) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("questionnaireCriteria", questionnaire);

        return questionnaireMapper.selectCountByName(map);
    }

    @Override
    public Questionnaire getSimpleById(Integer questionnaireId) {
        return questionnaireMapper.selectByPrimaryKey(questionnaireId);
    }

    @Override
    public Integer editPulishState(Questionnaire questionnaire) {
        if(null != questionnaire){
            //将发布状态改为1
            questionnaire.setQuesState(1);
        }
        Integer result = questionnaireMapper.updateByPrimaryKeySelective(questionnaire);

        return result;
    }

    @Override
    public Integer delQuestionnaireById(Integer questionnaireId) {
        //先删除问题
        Integer result = null;

        result= questionMapper.deleteByQuestionnaireId(questionnaireId);

        //在删除问卷
        result = questionnaireMapper.deleteByPrimaryKey(questionnaireId);

        return result;
    }
}
