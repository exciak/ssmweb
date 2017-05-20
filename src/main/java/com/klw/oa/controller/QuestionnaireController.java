package com.klw.oa.controller;

import com.klw.oa.entity.Question;
import com.klw.oa.entity.Questionnaire;
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
        Questionnaire questionnaire = new Questionnaire();
        List<Question> questions = new ArrayList<Question>();

        try {
            questionnaire = (Questionnaire) JSONObject.toBean(JSONObject.fromObject(entity),Questionnaire.class);

            if(null != list) {
                JSONArray json = JSONArray.fromObject(list);
                questions = (List<Question>)json.toCollection(json,Question.class);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }


        questionnaire.setQuestions(questions);

        String result = questionnaireService.addQuestionnaireWithQuestion(questionnaire);

        return result;
    }
}
