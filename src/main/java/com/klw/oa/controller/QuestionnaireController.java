package com.klw.oa.controller;

import com.klw.oa.entity.Question;
import com.klw.oa.entity.Questionnaire;
import com.klw.oa.entity.model.QuestionRecModel;
import com.klw.oa.entity.model.QuestionnaireRecModel;
import com.klw.oa.service.QuestionService;
import com.klw.oa.service.QuestionnaireService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.aspectj.weaver.patterns.TypePatternQuestions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by admins on 2017/4/22.
 */
@Controller
@RequestMapping("/questionnaire")
public class QuestionnaireController {

    @Resource(name="QuestionnaireServiceImpl")
    QuestionnaireService questionnaireService;

    @Resource(name = "QuestionServiceImpl")
    QuestionService questionService;

    @ResponseBody
    @RequestMapping("/getAll")
    public List<Questionnaire> getQuestionnaires(Questionnaire questionnaire){
        List<Questionnaire> questionnaires = questionnaireService.getAllByPage(questionnaire,0,3);

        return questionnaires;
    }

    @ResponseBody
    @RequestMapping("/getById")
    public Questionnaire getComplexQuestionnaire(@RequestParam(value = "questionnaireId", required = false) Integer questionnaireId){
        Questionnaire questionnaire = questionnaireService.getComplexById(questionnaireId);

        return questionnaire;
    }


    @RequestMapping(value = "/create", method= RequestMethod.POST)
    @ResponseBody
    public String create(@RequestParam(value = "questionnaireEntity", required = false) String entity,
                         @RequestParam(value = "questionList", required = false) String list){
        QuestionnaireRecModel qnrm = null;

        List<HashMap<String,Object>> qrms = null;

        Questionnaire questionnaire = null;
        List<Question> questions = null;

        try {
            qnrm = (QuestionnaireRecModel) JSONObject.toBean(JSONObject.fromObject(entity),QuestionnaireRecModel.class);

            if(null != list) {
                JSONArray json = JSONArray.fromObject(list);

               /* qrms = (List<QuestionRecModel>)json.toCollection(json,QuestionRecModel.class);*/
                qrms = ( List<HashMap<String,Object>>)json.toCollection(json,HashMap.class);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
        questionnaire = questionnaireService.fromQnrmToQuestionnaire(qnrm);

        questions = questionnaireService.fromQrmToQuestions(qrms);

        questionnaire.setQuestions(questions);

        String result = questionnaireService.addQuestionnaireWithQuestion(questionnaire);

        return result;
    }
}
