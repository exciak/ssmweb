<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'manage-techcls.jsp' starting page</title>
    
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
			color:blue;
			font-family: sans-serif;
			font-size: 20px;
			 text-decoration:none;
		}
		table{border:1px solid #add9c0; }
	</style>
  </head>
  
  <body bgcolor="#FFFFE0">
   <center>
  <h2 style="color:#FFBBFF">${requestScope.cls.classname }带班情况</h2>
  <br/>
  <a href="${pageContext.request.contextPath}/techcls/addTechCls?id=${requestScope.cls.classid }">分配老师</a>
  <br/>
  <br/>
  <div style="color:skyblue;font-size:15px">
	  开班日期： <fmt:formatDate value="${requestScope.cls.createDate }" pattern="yyyy-MM-dd"/>
	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	   结班日期：<fmt:formatDate value="${requestScope.cls.enddate }" pattern="yyyy-MM-dd"/>
	  </div>
  <br/>
    <table cellpadding="10" cellspacing="0"  border=1 bordercolor="#000000">
	<tr>
		<td>阶段</td>
		<td>开始时间</td>
		<td>结束时间</td>
		<td>带课老师</td>
		<td>操作</td>
	</tr> 
	<c:forEach items="${requestScope.tcs }" var="tc" varStatus="status">
		<tr>
			<td>
			<c:choose>
				<c:when test="${tc.phase == 1 }">
				第一阶段
				</c:when>
				<c:when test="${tc.phase == 2 }">
				第二阶段
				</c:when>
				<c:when test="${tc.phase == 3 }">
				第三阶段
				</c:when>
				<c:otherwise>
				第四阶段
				</c:otherwise>
			</c:choose>
			</td>
			<td><fmt:formatDate value="${tc.startdate }" pattern="yyyy-MM-dd"/></td>
			<td><fmt:formatDate value="${tc.enddate }" pattern="yyyy-MM-dd"/></td>
			<td>${tc.teacher.techname }</td>
			<td>
				<a href="${pageContext.request.contextPath}/techcls/updateTechClsData?id=${tc.techclsid }&classid=${requestScope.cls.classid }">修改</a>
				<a href="${pageContext.request.contextPath}/techcls/delTechCls?id=${tc.techclsid }&classid=${requestScope.cls.classid }">删除</a>
			</td>
		</tr> 
	</c:forEach>
	</table>
	<br/><br/>
<a href="${pageContext.request.contextPath}/techcls/listTechCls">返回带班管理</a> 
</center>
  </body>
</html>
