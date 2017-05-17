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
          if(top.location!=self.location){
              self.location = "${pageContext.request.contextPath}/login.jsp";
          }

          $(document).ready(function (){
              $("#sub").click(function (){
                  return check();
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
              if(myReg.test($.trim($("#vip").val()))){
                  return true;
              }else{
                  alert("会员名必须为中文！");
                  return false;
              }
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

	  <form action="${pageContext.request.contextPath }/dologin?method=doLogin" method="post">
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
			  </tr>
		  </table>




	  </form>
  </div>
  </body>
</html>
