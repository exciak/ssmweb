package com.klw.oa.controller;

import com.klw.oa.entity.QuestionAnswer;
import com.klw.oa.entity.Questionnaire;
import com.klw.oa.model.QuestionAnswerCountModel;
import com.klw.oa.service.AnswerService;
import com.klw.oa.service.QuestionnaireService;
import net.sf.json.JSONObject;
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
 * Created by Administrator on 2017/5/29.
 */
@Controller
@RequestMapping("/answer")
public class AnswerController {
    @Resource(name="AnswerServiceImpl")
    AnswerService answerService;


    @RequestMapping(value = "/anserData", method= RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> anserData(@RequestParam(value = "answerData", required = false) String answerData){
        Map<String,Object> map = new HashMap<String,Object>();

        Map<String,Object> answerMap = null;

        Questionnaire questionnaire = new Questionnaire();

        List<QuestionAnswer> questionAnswerList = new ArrayList<QuestionAnswer>();

        try{
            answerMap = (Map<String,Object>) JSONObject.toBean(JSONObject.fromObject(answerData),HashMap.class);
        }catch (Exception e){
            e.printStackTrace();
        }
        //规范化数据
        answerService.transferAnswerData(answerMap,questionnaire,questionAnswerList);

        String ret = answerService.createAnswer(questionnaire,questionAnswerList);
        map.put("result","success");

        return map;
    }

    @ResponseBody
    @RequestMapping("/getCountById")
    public Map<String,Object> getCountById(@RequestParam(value = "questionnaireId", required = false) Integer questionnaireId){
        Map<String,Object> m = new HashMap<String,Object>();

        //通过id获取对应问卷问题统计
        List<Map<String,Object>> map = answerService.getQuestionsCount(questionnaireId);
        //获取要统计的问题Id
        List<Integer> list = answerService.getQuestionIdsfromId(questionnaireId);

        List<QuestionAnswerCountModel> questionAnswerCountModels = answerService.getModels(map,list);

        m.put("result",questionAnswerCountModels);

        return m;
    }
}
