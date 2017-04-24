package com.klw.oa.test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.klw.oa.entity.Question;
import com.klw.oa.entity.Questionnaire;
import com.klw.oa.service.QuestionService;
import com.klw.oa.service.QuestionnaireService;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.klw.oa.entity.Profession;
import com.klw.oa.service.DeptService;
import com.klw.oa.serviceImpl.ProfessionServiceImpl;

public class TestM {

    @Test
    public void test() {

        ApplicationContext context = new ClassPathXmlApplicationContext("classpath:spring/spring.xml");


        /*QuestionnaireService questionnaireService = context.getBean("QuestionnaireServiceImpl",QuestionnaireService.class);

        Questionnaire questionnaire = new Questionnaire();

        questionnaire.setQuestionnaireName(null);

       List<Questionnaire> questionnaires  = questionnaireService.getAllComplexByPage(questionnaire,0,3);

        for (Questionnaire q:questionnaires
             ) {
            System.out.println(q);

        }*/
       /* QuestionService questionService = context.getBean("QuestionServiceImpl",QuestionService.class);

        Question question = questionService.getById(1);

        System.out.println(question);*/
        List<Question> questionList = new ArrayList<Question>();
        Question question1 = new Question(1,2,"k","k","k");
        Question question2 = new Question(3,2,"k","l","f");

        questionList.add(question1);
        questionList.add(question2);

        QuestionService questionService = context.getBean("QuestionServiceImpl",QuestionService.class);

        int i = questionService.editQuestions(questionList);

        System.out.println(i);
    }

    @Test
    public void testMy() {
        ProfessionServiceImpl pfsi = new ProfessionServiceImpl();
        Profession prof = pfsi.getById(1);

        System.out.println(prof);
    }

    @Test
    public void testS() {

        String str = "   a a    ";
        char[] c = str.toCharArray();
        String str1 = "";
        for (int i = 0; i < c.length; i++) {
            if (c[i] != ' ') {

                str1 += c[i];
            }
        }
        System.out.println("---" + str1 + "---");
        boolean b = false;
        str1 = "";
        //去掉前面的空格
        for (int i = 0; i < c.length; i++) {
            if (c[i] != ' ') {
                b = true;
            }
            if (b) {
                str1 += c[i];
            }
        }
        char[] c1 = str1.toCharArray();
        //记录尾部开始不是空格的下标
        int index = 0;
        for (int i = c1.length - 1; i > 0; i--) {
            if (c1[i] != ' ') {
                index = i;
                break;
            }
        }
        System.out.println(index);
        System.out.println("---" + str1.substring(0, index + 1) + "---");
    }

    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("classpath:spring/spring.xml");


        /*DeptService ds = context.getBean("deptSer", DeptService.class);

        List<Map<Object, Object>> list = ds.getAllMap();
        for (Map<Object, Object> map : list) {
            System.out.println(map);
        }*/

		/*ClassesService cls = context.getBean("clsService",ClassesService.class);
		Classes clsses = new Classes();
		clsses.setCreateDate(DateUtils.getDateByStr("2016-12-25", "yyyy-MM-dd"));
		List<Classes> clses = cls.getAllClsByPage(clsses, 0, 8);
		for (Classes classes : clses) {
			System.out.println(classes);
		}*/
		List<Question> questionList = new ArrayList<Question>();
		Question question1 = new Question(1,2,"k","k","k");
		Question question2 = new Question(3,2,"k","l","f");

		questionList.add(question1);
		questionList.add(question2);

		QuestionService questionService = context.getBean("QuestionServiceImpl",QuestionService.class);

		int i = questionService.editQuestions(questionList);

        System.out.println(i);
    }

}
