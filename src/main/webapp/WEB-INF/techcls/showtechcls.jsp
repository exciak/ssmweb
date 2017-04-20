<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<center>
  <h2>${requestScope.cls.classname }带班情况</h2>
  <br/>
  <div style="color:skyblue;font-size:15px">
  开班日期： <fmt:formatDate value="${requestScope.cls.createDate }" pattern="yyyy-MM-dd"/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
   结班日期：<fmt:formatDate value="${requestScope.cls.enddate }" pattern="yyyy-MM-dd"/>
  </div>
  <br/>
    <table cellpadding="8" cellspacing="0" border=1>
	<tr>
		<td>阶段</td>
		<td>开始时间</td>
		<td>结束时间</td>
		<td>带课老师</td>
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
		</tr> 
	</c:forEach>
	</table>
</center> 
