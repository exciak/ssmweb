<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'uploadFile.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->

  </head>
  
  <body>
  <form method="post" action="${pageContext.request.contextPath}/file/uploadFile" name="upForm" enctype="multipart/form-data">
  	文件名：<input type="text" name="myfileName"/><br/>
  	文件名：<textarea rows="8" cols="20"  name="myfileDesc"/></textarea><br/>
  	选择文件：<input type="file" name="uploadFile"/><br/>
  	<input type="submit" value="上 传" />
  	<input type="reset" name="reset" value="重 置"/>
  </form>
  </body>
</html>
