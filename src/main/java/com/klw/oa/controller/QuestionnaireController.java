package com.klw.oa.controller;

import com.klw.oa.entity.Page;
import com.klw.oa.entity.Question;
import com.klw.oa.entity.Questionnaire;
import com.klw.oa.entity.model.QuestionRecModel;
import com.klw.oa.entity.model.QuestionnaireRecModel;
import com.klw.oa.service.QuestionService;
import com.klw.oa.service.QuestionnaireService;
import freemarker.ext.beans.HashAdapter;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.aspectj.weaver.patterns.TypePatternQuestions;
import org.springframework.beans.factory.ObjectFactory;
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
import java.util.Map;

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
    public Map<String,Object> getQuestionnaires(@RequestParam(value = "questionnaireEntity", required = false)String questionnaireEntity,
                                                @RequestParam(value = "pageEntity", required = false) String pageEntity
                                                 ){
        Map<String,Object> map = new HashMap<String,Object>();

        Questionnaire questionnaire = null;

        Page p = null;
        try{
            questionnaire = (Questionnaire) JSONObject.toBean(JSONObject.fromObject(questionnaireEntity),Questionnaire.class);

            p = (Page)JSONObject.toBean(JSONObject.fromObject(pageEntity),Page.class);
        }catch(Exception e){
            e.printStackTrace();
            map.put("result","fail");
            return map;
        }
        Integer pageIndex = null;
        Integer pageNum = null;

        if(null != p && p.getPage() != null && p.getPage() > 0 && p.getRows() != null){
            pageIndex = (p.getPage() - 1)*p.getRows();
            pageNum = p.getRows();
        }else{
            pageIndex = 0;
            pageNum = 3;
        }

        //根据名称获取所有的问卷，同时有分页
        List<Questionnaire> questionnaires = questionnaireService.getAllByPage(questionnaire,pageIndex,pageNum);

        Integer total = questionnaireService.selectCountByName(questionnaire);

        p.setTotal(total);
        p.setTotalPage(((total+p.getRows())-1)/p.getRows());

        map.put("result","success");

        map.put("page",p);

        map.put("questionnaires",questionnaires);

        return map;
    }


    @ResponseBody
    @RequestMapping("/getById")
    public Questionnaire getComplexQuestionnaire(@RequestParam(value = "questionnaireId", required = false) Integer questionnaireId){
        Questionnaire questionnaire = questionnaireService.getComplexById(questionnaireId);

        return questionnaire;
    }

    @ResponseBody
    @RequestMapping("/publish")
    public Map<String,String> publishQuestionnaire(@RequestParam(value = "questionnaireId", required = false) Integer questionnaireId){
        Questionnaire questionnaire ;

        Map<String,String> map = new HashMap<String, String>();

        //通过Id获取对象
        questionnaire = questionnaireService.getSimpleById(questionnaireId);

        Integer result = questionnaireService.editPulishState(questionnaire);

        if(result > 0){
            map.put("result","success");
        }else{
            map.put("result","fail");
        }

        return map;
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
