package com.klw.oa.serviceImpl;

import com.klw.oa.dao.QuestionAnswerCountMapper;
import com.klw.oa.dao.QuestionAnswerMapper;
import com.klw.oa.dao.QuestionMapper;
import com.klw.oa.dao.QuestionnaireAnswerMapper;
import com.klw.oa.entity.*;
import com.klw.oa.model.QuestionAnswerCountModel;
import com.klw.oa.service.AnswerService;
import com.klw.oa.service.QuestionService;
import net.sf.ezmorph.bean.MorphDynaBean;
import net.sf.json.JSONArray;
import org.apache.commons.collections.map.HashedMap;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/5/30.
 */
@Service("AnswerServiceImpl")
public class AnswerServiceImpl implements AnswerService{
    @Autowired
    SqlSessionFactory factory;

    @Autowired
    QuestionAnswerMapper questionAnswerMapper;

    @Autowired
    QuestionAnswerCountMapper answerCountMapper;

    @Autowired
    QuestionnaireAnswerMapper questionnaireAnswerMapper;

    @Autowired
    QuestionMapper questionMapper;



    /**
     * 将传过来的数据规范化,成问卷和问题的形式
     * @param answerData
     * @param questionnaire
     * @param questionAnswers
     */
    @Override
    public void transferAnswerData(Map<String, Object> answerData, Questionnaire questionnaire, List<QuestionAnswer> questionAnswers) {

        QuestionAnswer questionAnswer = null;

        List<Map<String,Object>> morphDynaBeans = null;

        if(null != answerData && answerData.size() > 0 ){

            //设置填的是那张问卷
            questionnaire.setQuestionnaireId(Integer.parseInt(answerData.get("questionnaireId").toString()));
            questionnaire.setQuestionnaireType(Integer.parseInt(answerData.get("questionnaireType").toString()));

            //回答的问题进行设置
            morphDynaBeans = (List<Map<String,Object>>) JSONArray.fromObject(answerData.get("questions"));

            if(null != morphDynaBeans && morphDynaBeans.size() > 0){
                for (Map<String,Object> morph:morphDynaBeans
                     ) {
                    questionAnswer = new QuestionAnswer();
                    questionAnswer.setQuestionnaireId(questionnaire.getQuestionnaireId());
                    questionAnswer.setQuestionId(Integer.parseInt(morph.get("questionId").toString()));
                    questionAnswer.setQuestionType(morph.get("questionType").toString());
                    questionAnswer.setAnswer(morph.get("questionSelection").toString());
                    questionAnswer.setGroupNumber(morph.get("selected").toString());
                    questionAnswers.add(questionAnswer);
                }
            }
        }
    }

    /**
     * 存储问卷回答操作
     * @param questionnaire
     * @param questionAnswers
     * @return
     */
    @Override
    public String createAnswer(Questionnaire questionnaire, List<QuestionAnswer> questionAnswers) {
        //答问卷的数量+1:共有2中情况
        if(null != questionnaire ){
            QuestionnaireAnswer questionnaireAnswer = questionnaireAnswerMapper.selectByQuestionnaireId(questionnaire.getQuestionnaireId());
            //如果已经有该问卷的记录着更新，否则新建一条
            if(null != questionnaireAnswer){
                questionnaireAnswer.setCountAnswer(questionnaireAnswer.getCountAnswer()+1);
                questionnaireAnswerMapper.updateByPrimaryKeySelective(questionnaireAnswer);
            }else{
                questionnaireAnswer = new QuestionnaireAnswer();
                questionnaireAnswer.setQuestionnaireId(questionnaire.getQuestionnaireId());
                questionnaireAnswer.setCountAnswer(1l);
                questionnaireAnswerMapper.insertSelective(questionnaireAnswer);
            }
            //对问题进行统计，首先是问题数量统计
            QuestionAnswerCount questionAnswerCount = null;
            Map<String,Object> twoId = null;
            for (QuestionAnswer qa:questionAnswers
                 ) {
                twoId = new HashMap<String,Object>();
                twoId.put("questionnaireId",questionnaire.getQuestionnaireId());
                twoId.put("questionId",qa.getQuestionId());
                questionAnswerCount = answerCountMapper.selectByTwoId(twoId);
               //同/样是2中情况
                if(null != questionAnswerCount){
                    questionAnswerCount.setAnswerCount(questionAnswerCount.getAnswerCount()+1);
                    answerCountMapper.updateByPrimaryKeySelective(questionAnswerCount);
                }else{
                    questionAnswerCount = new QuestionAnswerCount();
                    questionAnswerCount.setAnswerCount(1l);
                    questionAnswerCount.setQuestionId(qa.getQuestionId());
                    questionAnswerCount.setQuestionnaireId(questionnaire.getQuestionnaireId());
                    answerCountMapper.insertSelective(questionAnswerCount);
                }
            }

            List<QuestionAnswer> qas = new ArrayList<QuestionAnswer>();
            QuestionAnswer qa = null;
            String groupNumber = null;
            List<Integer> choices = null;
            //对多选题的处理
            for(QuestionAnswer q:questionAnswers){
                /**
                 * 当为选择题时，group_number属性要进行赋值
                 */
                if(q.getQuestionType().equals("0")
                        ||q.getQuestionType().equals("2")||q.getQuestionType().equals("7")
                        ||q.getQuestionType().equals("8")){
                    groupNumber = q.getGroupNumber();
                    try{
                        JSONArray json = JSONArray.fromObject(groupNumber);
                        choices = (List<Integer>)json.toCollection(json,Integer.class);
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                    if(null != choices && choices.size() > 0){
                        for(int i = 0 ; i < choices.size() ; i++){
                            qa = new QuestionAnswer();
                            qa.setQuestionnaireId(q.getQuestionnaireId());
                            qa.setQuestionId(q.getQuestionId());
                            qa.setQuestionType(q.getQuestionType());
                            qa.setAnswer(q.getAnswer());
                            qa.setGroupNumber(""+i);
                            qas.add(qa);
                        }
                    }
                } else{
                    qas.add(q);
                }
            }

            //存到问题回答表中
            if(null != qas && qas.size() > 0){
                for (QuestionAnswer q:qas
                     ) {
                    questionAnswerMapper.insertSelective(q);
                }
            }

        }
        return "success";
    }

    @Override
    public List<Map<String, Object>> getQuestionsCount(Integer questionnairId) {
        return questionAnswerMapper.selectCountAnswer(questionnairId);
    }

    @Override
    public List<Integer> getQuestionIdsfromId(Integer questionnaireId) {
        return questionAnswerMapper.selectQuestionsById(questionnaireId);
    }

    //通过问卷id获取将要展示的对象
    @Override
    public List<QuestionAnswerCountModel> getModels(List<Map<String, Object>> map, List<Integer> list) {
        List<QuestionAnswerCountModel> questionAnswerCountModels = new ArrayList<QuestionAnswerCountModel>();

        Map<String,String> answers = null;

        QuestionAnswerCountModel questionAnswerCountModel = null;

        Question question = null;
        if(null != list && list.size() > 0){
            for(int i = 0 ; i < list.size(); i++){
                questionAnswerCountModel = new QuestionAnswerCountModel();
                //用来存这个问题的选项
                answers = new HashMap<String,String>();
                for (Map<String,Object> m:map
                     ) {
                    if(list.get(i).toString().equals(m.get("question_id").toString())){
                        answers.put(m.get("group_number").toString(),m.get("num").toString());
                    }
                }
                question = questionMapper.selectByPrimaryKey(list.get(i));
                questionAnswerCountModel.setQuestion(question);
                questionAnswerCountModel.setAnswers(answers);
                questionAnswerCountModel.setQuestionnaireId(question.getQuestionnaireId());

                questionAnswerCountModels.add(questionAnswerCountModel);
            }
        }

        return questionAnswerCountModels;
    }

}
