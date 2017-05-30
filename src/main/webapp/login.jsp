<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'login.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<script type="text/javascript" src = "js/jquery-1.11.1.min.js"></script>
	  <script type="text/javascript">
          var preventDefaultFlag = false;
          var typeCodes = $('#typeCodes').val();
          var pathname = window.location.pathname;
          var arr = pathname.split("/");
          var proName = arr[1];
          var rootPath = "http://" + window.location.host + "/" + proName;
          if(top.location!=self.location){
              self.location = "${pageContext.request.contextPath}/login.jsp";
          }
/*
          $(document).ready(function (){
              $("#sub").click(function (){
                  return check();
              });

          });*/
          var user1 = {
			"userName":"admisns1",
			  "password":"admin",
			  "isAdmin":1,
			  "address":"addr",
			  "tel":"15757115291",
			  "sex":"man",
			  "head":"head",
			  "email":"em"
          }
          $(document).ready(function () {
              $("#test").click(function () {
                  $.ajax({
                      type: "post",
                      url: rootPath+"/login/doLogin",
                      data: user1,
                      dataType: "json",
                      //contentType: 'application/json;charset=utf-8',
                      success: function (data) {
                          if (data.result == "success") {
                             // location.href = rootPath+"/appsystems";
                          } else {
                              dmallError(data.result);
                          }
                      },
                      error: function () {
                          dmallAjaxError();
                          $("#btn_commitCreateInfo").attr('disabled', false);
                      }
                  })
              });

              $("#register").click(function () {
                  $.ajax({
                      type: "post",
                      url: rootPath+"/login/register",
                      data: user1,
                      dataType: "json",
                      //contentType: 'application/json;charset=utf-8',
                      success: function (data) {
                          if (data.result == "success") {
                              //location.href = rootPath+"/appsystems";
                          } else {
                              dmallError(data.result);
                          }
                      },
                      error: function () {
                          dmallAjaxError();
                          $("#btn_commitCreateInfo").attr('disabled', false);
                      }
                  })
              });

              /*var questionnaireEntity = {
                  "questionnaireName":"qname",
				  "questionnaireType":"type",
				  "questionnaireCatalog":"qCatalog",
				  "createId":1
			  };
			  var questionList = [
				  {"questionName":"qestName1","questionType":"qType","questionSelection":"qSel1"},
				  {"questionName":"qestName2","questionType":"qType","questionSelection":"qSel2"},
				  {"questionName":"qestName3","questionType":"qType","questionSelection":"qSel3"},
			  ];*/
              var questionnaireEntitya = {
                  "questionnaireTitle":"qname",
                  "questionnaireType":"1",
                  "questionnairePrompt":"prompt",
                  "createId":1
              };

              var questionList = [
				  {"questionGenre": 2,
                      "questionTitle": "单选题",
                      "isNecessary": true,
                      "isEdit": false,
                      "questionChoice": [
                      {
                          "text": "选项内容1",
                          "isSelected": false
                      },
                      {
                          "text": "选项内容2",
                          "isSelected": false
                      },
                      {
                          "text": "选项内容3",
                          "isSelected": false
                      }
                  ]
              },
			  {"questionGenre": 1,
				  "questionTitle": "单选题",
				  "isNecessary": true,
				  "isEdit": false,
				  "questionChoice": [
					  {
						  "text": "选项内容1",
						  "isSelected": false
					  },
					  {
						  "text": "选项内容2",
						  "isSelected": false
					  },
					  {
						  "text": "选项内容3",
						  "isSelected": false
					  }
				  ]
			  }
              ];
              //问卷添加测试
              $("#saveQuestionnarie").click(function () {
                  $.ajax({
                      type: "post",
                      url: rootPath+"/questionnaire/create",
                      data: {"questionnaireEntity":JSON.stringify(questionnaireEntitya), "questionList":JSON.stringify(questionList)},
                      dataType: "json",
                      //contentType: 'application/json;charset=utf-8',
                      success: function (data) {
                          if (data.result == "success") {
                              //location.href = rootPath+"/appsystems";
                          } else {
                              //dmallError(data.result);
                          }
                      },
                      error: function () {
                          //dmallAjaxError();
                          $("#btn_commitCreateInfo").attr('disabled', false);
                      }
                  })
              });

              var pageEntity={
                  "page":1,
				  "rows":3,
			  };
              var questionnaireEntity = {
                 "quesState":1
			  };

              //分页测试
              $("#testPage").click(function () {
                  $.ajax({
                      type: "post",
                      url: rootPath+"/questionnaire/getAll",
                      data: {"questionnaireEntity":JSON.stringify(questionnaireEntity), "pageEntity":JSON.stringify(pageEntity)},
                      dataType: "json",
                      //contentType: 'application/json;charset=utf-8',
                      success: function (data) {
                          console.log(data);
                          if (data.result == "success") {
                              //location.href = rootPath+"/appsystems";
                          } else {
                              //dmallError(data.result);
                          }
                      },
                      error: function () {
                          //dmallAjaxError();
                          $("#btn_commitCreateInfo").attr('disabled', false);
                      }
                  })
              });

              //问卷提交测试
			  var answerData ={
                  "questionnaireId":41,
                  "questionnaireName":"问卷名",
                  "createTime":"2017-05-30",
                  "updateTime":"2017-05-30",
                  "questionnaireType":2,
                  "questionnaireCatalog":null,
                  "createId":null,
                  "questions":[
                      {
                          "questionId":147,
                          "questionnaireId":null,
                          "questionName":"单选题",
                          "questionType":"0",
                          "questionSelection":[
                              {
                                  "isSelected":false,
                                  "text":"选项内容1"
                              },
                              {
                                  "isSelected":true,
                                  "text":"选项内容2"
                              },
                              {
                                  "isSelected":false,
                                  "text":"选项内容3"
                              }
                          ],
                          "isEdit":0,
                          "isNecessary":1,
                          "selected":[
                              1
                          ]
                      },
                      {
                          "questionId":148,
                          "questionnaireId":null,
                          "questionName":"下拉选择题",
                          "questionType":"1",
                          "questionSelection":[
                              {
                                  "isSelected":false,
                                  "text":"选项内容1"
                              },
                              {
                                  "isSelected":false,
                                  "text":"选项内容2"
                              },
                              {
                                  "isSelected":false,
                                  "text":"选项内容3"
                              }
                          ],
                          "isEdit":0,
                          "isNecessary":1,
                          "selected":"2"
                      },
                      {
                          "questionId":149,
                          "questionnaireId":null,
                          "questionName":"多选题",
                          "questionType":"2",
                          "questionSelection":[
                              {
                                  "isSelected":false,
                                  "text":"选项内容1"
                              },
                              {
                                  "isSelected":true,
                                  "text":"选项内容2"
                              },
                              {
                                  "isSelected":true,
                                  "text":"选项内容3"
                              }
                          ],
                          "isEdit":0,
                          "isNecessary":1,
                          "selected":[
                              1,
                              2
                          ]
                      },
                      {
                          "questionId":150,
                          "questionnaireId":null,
                          "questionName":"单行填空题",
                          "questionType":"3",
                          "questionSelection":[
                              {
                                  "isSelected":false,
                                  "text":"1111111"
                              }
                          ],
                          "isEdit":0,
                          "isNecessary":1,
                          "selected":[

                          ]
                      },
                      {
                          "questionId":151,
                          "questionnaireId":null,
                          "questionName":"多行填空题",
                          "questionType":"4",
                          "questionSelection":[
                              {
                                  "isSelected":false,
                                  "text":"122131 213 12 3 123 123"
                              }
                          ],
                          "isEdit":0,
                          "isNecessary":1,
                          "selected":[

                          ]
                      },
                      {
                          "questionId":152,
                          "questionnaireId":null,
                          "questionName":"矩阵单选题",
                          "questionType":"5",
                          "questionSelection":[
                              {
                                  "choice":[
                                      {
                                          "isSelected":false,
                                          "text":"选项内容1"
                                      },
                                      {
                                          "isSelected":false,
                                          "text":"选项内容2"
                                      },
                                      {
                                          "isSelected":false,
                                          "text":"选项内容3"
                                      }
                                  ],
                                  "line":[
                                      {
                                          "isSelected":[

                                          ],
                                          "text":""
                                      },
                                      {
                                          "isSelected":[
                                              0
                                          ],
                                          "text":"矩阵行1"
                                      },
                                      {
                                          "isSelected":[
                                              1
                                          ],
                                          "text":"矩阵行2"
                                      },
                                      {
                                          "isSelected":[
                                              2
                                          ],
                                          "text":"矩阵行3"
                                      },
                                      {
                                          "isSelected":[
                                              1
                                          ],
                                          "text":"矩阵行4"
                                      }
                                  ]
                              }
                          ],
                          "isEdit":0,
                          "isNecessary":1,
                          "selected":[
                              10
                          ]
                      },
                      {
                          "questionId":153,
                          "questionnaireId":null,
                          "questionName":"矩阵多选题",
                          "questionType":"6",
                          "questionSelection":[
                              {
                                  "choice":[
                                      {
                                          "isSelected":false,
                                          "text":"选项内容1"
                                      },
                                      {
                                          "isSelected":false,
                                          "text":"选项内容2"
                                      },
                                      {
                                          "isSelected":false,
                                          "text":"选项内容3"
                                      }
                                  ],
                                  "line":[
                                      {
                                          "isSelected":[

                                          ],
                                          "text":""
                                      },
                                      {
                                          "isSelected":[

                                          ],
                                          "text":"矩阵行1"
                                      },
                                      {
                                          "isSelected":[

                                          ],
                                          "text":"矩阵行2"
                                      },
                                      {
                                          "isSelected":[

                                          ],
                                          "text":"矩阵行3"
                                      },
                                      {
                                          "isSelected":[

                                          ],
                                          "text":"矩阵行4"
                                      }
                                  ]
                              }
                          ],
                          "isEdit":0,
                          "isNecessary":1,
                          "selected":[
                              -3,
                              -2,
                              -1,
                              0,
                              1,
                              2,
                              3,
                              4,
                              5,
                              6,
                              7,
                              8,
                              9,
                              10,
                              11
                          ]
                      },
                      {
                          "questionId":154,
                          "questionnaireId":null,
                          "questionName":"图片单选",
                          "questionType":"7",
                          "questionSelection":[
                              {
                                  "imgUrl":"http://localhost:10080/oa/api/upload/201705301531581248.jpg",
                                  "isSelected":false,
                                  "text":"选项内容1"
                              },
                              {
                                  "imgUrl":"http://localhost:10080/oa/api/upload/201705301532073437.jpg",
                                  "isSelected":false,
                                  "text":"选项内容2"
                              },
                              {
                                  "imgUrl":"http://localhost:10080/oa/api/upload/201705301532136065.jpg",
                                  "isSelected":false,
                                  "text":"选项内容3"
                              },
                              {
                                  "imgUrl":"http://localhost:10080/oa/api/upload/201705301532200621.jpg",
                                  "isSelected":false,
                                  "text":"选项内容4"
                              }
                          ],
                          "isEdit":0,
                          "isNecessary":1,
                          "selected":[
                              null
                          ]
                      },
                      {
                          "questionId":155,
                          "questionnaireId":null,
                          "questionName":"图片多选",
                          "questionType":"8",
                          "questionSelection":[
                              {
                                  "imgUrl":"http://localhost:10080/oa/api/upload/201705301532016835.jpg",
                                  "isSelected":false,
                                  "text":"选项内容1"
                              },
                              {
                                  "imgUrl":"http://localhost:10080/oa/api/upload/201705301532100023.jpg",
                                  "isSelected":false,
                                  "text":"选项内容2"
                              },
                              {
                                  "imgUrl":"http://localhost:10080/oa/api/upload/201705301532167025.jpg",
                                  "isSelected":false,
                                  "text":"选项内容3"
                              },
                              {
                                  "imgUrl":"http://localhost:10080/oa/api/upload/201705301532225848.jpg",
                                  "isSelected":false,
                                  "text":"选项内容4"
                              }
                          ],
                          "isEdit":0,
                          "isNecessary":1,
                          "selected":[

                          ]
                      },
                      {
                          "questionId":156,
                          "questionnaireId":null,
                          "questionName":"描述说明",
                          "questionType":"9",
                          "questionSelection":[
                              {
                                  "isSelected":false,
                                  "text":"撒电视亲爱的"
                              }
                          ],
                          "isEdit":0,
                          "isNecessary":1,
                          "selected":[

                          ]
                      }
                  ],
                  "questionnairePrompt":"欢迎参加调查！答卷数据仅用于统计分析，请放心填写。题目选项无对错之分，按照实际情况选择即可。感谢您的帮助！",
                  "quesState":0,
                  "user":null,
                  "questionCount":10
              }

              $("#answer").click(function () {
                  $.ajax({
                      type: "post",
                      url: rootPath+"/answer/anserData",
                      data: {"answerData":JSON.stringify(answerData)},
                      dataType: "json",
                      //contentType: 'application/json;charset=utf-8',
                      success: function (data) {
                          console.log(data);
                          if (data.result == "success") {
                              //location.href = rootPath+"/appsystems";
                          } else {
                              //dmallError(data.result);
                          }
                      },
                      error: function () {
                          //dmallAjaxError();
                          $("#btn_commitCreateInfo").attr('disabled', false);
                      }
                  })
              });

          });

          function check(){
              if($.trim($("#username").val())==""){
                  alert("用户名不能为空！");
                  return false;
              }
              if($.trim($("#password").val())==""){
                  alert("密码不能为空！");
                  return false;
              }
              var myReg = /^[\u4e00-\u9fa5]+$/;
             /* if(myReg.test($.trim($("#vip").val()))){
                  return true;
              }else{
                  alert("会员名必须为中文！");
                  return false;
              }*/
              return true;
          }
	  </script>
	<style type="text/css">
		h1{
			margin-left:30px;
			color:blue;
		}
		#log{
			margin: 100px auto;
			width:400px;
			height:300px;
		}
		body{
			background-color:#FFF0F5; 
		}
		table{
		
			border:1px solid lightgrey;
		}
	</style>
	  </head>
  
  <body>
  <div id="log">
	  <h1>登陆页面</h1>

	  <img src="${pageContext.request.contextPath }/image/201705051325023732.jpg" alt="aa">

	  <form action="${pageContext.request.contextPath }/dologin/login" method="post">
		  <table cellpadding="4" >
			  ${pageContext.request.contextPath }
			  <tr>
				  <td>姓名:</td>
				  <td><input type="text" name="username" id="username"/></td>
			  </tr>
			  <tr>
				  <td>会员名:</td>
				  <td><input type="text" name="vip" id="vip"/></td>
			  </tr>
			  <tr>
				  <td>密码:</td>
				  <td><input type="password" name="password"  id="password"/><br/></td>
			  </tr>
			  <tr>
				  <td><input type="submit" value="登 陆" id="sub"/>&nbsp;&nbsp;</td>
				  <td><input type="reset" value="重 置" id="re"/>;</td>
				  <td><button value="teeesss" id="test">adfaa</button></td>
				  <td><button value="teeesss" id="register">register</button></td>
				  <td></td>
			  </tr>
		  </table>

	  </form>
	  <button value="as" id="saveQuestionnarie">添加问卷</button>

	  <button value="teeesss" id="updateQuestionnaire">修改问卷</button>
	  <button value="teeesss" id="testPage">Tpage</button>
	  <button value="teeesss" id=""></button>
	  <button value="teeesss" id="answer">answer</button>


  </div>
  </body>
</html>
