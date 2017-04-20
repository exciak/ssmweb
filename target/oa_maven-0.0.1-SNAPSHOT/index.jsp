<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'index.jsp' starting page</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<style type="text/css">
		a{
			border:1px solid lightgrey;
			display:block;
			text-align:center;
			height:35px;
			width:200px;
			padding-top:6px;
			font-family: sans-serif;
			font-size: 20px;
			 text-decoration:none;
			 border-radius:10px;
		}
		a:HOVER {
			background-color:#7CFC00; 
		}
	</style>
  </head>
  
  <body bgcolor="#FFFAFA">
  
  <center>  
  <br/>
  <br/>
  <h1 style="color:skyblue">教务管理系统</h1>
  <br/>
  	<br/>
  	<a href="${pageContext.request.contextPath}/techcls/listTechCls">老师带班管理</a>
  	<br/>
  	<br/>
  	<a href="${pageContext.request.contextPath}/pro/listPro">专业管理</a>
  	<br/>
  	<br/>
  	<a href="${pageContext.request.contextPath}/cls/listCls">班级管理</a>
  	<br/>
  	<br/>
  	<a href="${pageContext.request.contextPath}/tech/listTech">教师管理</a>
  </center>
  </body>
</html>
