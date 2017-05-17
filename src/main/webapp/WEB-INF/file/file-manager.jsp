<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>

    <title>My JSP 'manager.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<script type="text/javascript"></script>

  </head>
 
  <body>
  <h3>文件管理</h3>
  <table cellpadding="10">
	<tr>
		<td>序号</td>
		<td>文件名</td>
		<td>描述</td>
		<td>操作</td>
	</tr> 
	<c:forEach items="${requestScope.files }" var="file" varStatus="status">
	
		<tr>
			<td>${status.index + 1 }</td>
			<td>${file.fileName }</td>
			<td>${file.fileDesc }</td>
			<td>
			<a href="${pageContext.request.contextPath }/file/dofile?method=downFile&fileId=${file.fileId}">下载</a>
			<a href="${pageContext.request.contextPath }/file/dofile?method=deleteFile&fileId=${file.fileId}" 
			 onclick = "confirm('确定要删除吗？')">删除</a></td>
		</tr> 
	</c:forEach>
	
  </table>
  </body>
</html>
