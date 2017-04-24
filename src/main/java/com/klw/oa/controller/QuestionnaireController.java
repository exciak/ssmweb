package com.klw.oa.controller;

import com.klw.oa.entity.Question;
import com.klw.oa.entity.Questionnaire;
import com.klw.oa.service.QuestionnaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by admins on 2017/4/22.
 */
@Controller
@RequestMapping("/questionnaire")
public class QuestionnaireController {

    @Autowired
    QuestionnaireService questionnaireService;

    @ResponseBody
    @RequestMapping("/getAll")
    public List<Questionnaire> getQuestionnaires(Questionnaire questionnaire){
        List<Questionnaire> questionnaires = questionnaireService.getAllByPage(questionnaire,0,3);

        return questionnaires;
    }

    @ResponseBody
    @RequestMapping("/getById")
    public Questionnaire getComplexQuestionnaire(@RequestParam(value = "questionnaireId") Integer questionnaireId){
        Questionnaire questionnaire = questionnaireService.getComplexById(questionnaireId);

        return questionnaire;
    }
}
