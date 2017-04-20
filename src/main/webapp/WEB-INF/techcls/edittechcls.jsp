<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">

<title>My JSP 'addTechCls.jsp' starting page</title>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
<script language="javascript" type="text/javascript"
	src="${pageContext.request.contextPath}/js/My97DatePicker/WdatePicker.js"></script>
	<script language="javascript" type="text/javascript" src="${pageContext.request.contextPath}/js/jquery-1.11.1.min.js"></script>
	<script type="text/javascript">
		function chk(){
			var begin=new Date($("#sdate").val().replace(/-/g,"/"));
		    var end=new Date($("#edate").val().replace(/-/g,"/"));
		    var cend=new Date($("#cedate").val().replace(/-/g,"/"));
		    var csdate=new Date($("#csdate").val().replace(/-/g,"/"));
		      //js判断日期
		    if(csdate-begin>0)
		    {
		    	alert("开始日期要在开班日期之后!");  
		        return false;
		    }else if(begin-end>0){
		        alert("开始日期要在结束日期之前!");  
		        return false;
		    }else if(end-cend>0){
		    	alert("结束日期要在结班日期之前!");  
		        return false;
		    } else{
				return true;
		    }
		}
	</script>
<style type="text/css">
hr {
	height: 5px;
	border: none;
	border-top: 3px double skyblue;
}
table{border:1px solid #add9c0; }
</style>
</head>

<body bgcolor="#FFFACD">
	<center>
		<h2 style="color:#FFBBFF">${requestScope.cls.classname }带班老师修改</h2>
		<br />
		<div style="color:skyblue;font-size:15px">
			开班日期：
			<fmt:formatDate value="${requestScope.cls.createDate }"
				pattern="yyyy-MM-dd" />
			<input type="hidden" id="csdate" value="${requestScope.cls.createDate }"  />
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 结班日期：
			<fmt:formatDate value="${requestScope.cls.enddate }"
				pattern="yyyy-MM-dd" />
			<input type="hidden" id="cedate" value="${requestScope.cls.enddate }"  />
		</div>
		<br />
		<hr>
		<form
			action="${pageContext.request.contextPath}/techcls/updateTechcls"
			method="post">
			<table cellpadding="10">
				<tr>
					<td>阶段:</td>
					<td><select name="phase">
							<option value="1"
								<c:if test="${requestScope.techCls.phase ==1 }">
					 		selected="selected"
					 		</c:if>>第一阶段</option>
							<option value="2"
								<c:if test="${requestScope.techCls.phase ==2 }">
					 		selected="selected"
					 		</c:if>>第二阶段</option>
							<option value="3"
								<c:if test="${requestScope.techCls.phase ==3 }">
					 		selected="selected"
					 		</c:if>>第三阶段</option>
							<option value="4"
								<c:if test="${requestScope.techCls.phase ==4 }">
					 		selected="selected"
					 		</c:if>>第四阶段</option>
					</select></td>
				</tr>
				<tr>
					<td>开始日期:</td>
					<td><input type="text" id="sdate" name="startdate"
						value="<fmt:formatDate value="${requestScope.techCls.startdate }" pattern="yyyy-MM-dd"/>"
						readonly="readonly" onClick="WdatePicker()" /></td>
				</tr>
				<tr>
					<td>终止日期:</td>
					<td><input type="text" id="edate" name="enddate"
						value="<fmt:formatDate value="${requestScope.techCls.enddate }" pattern="yyyy-MM-dd"/>"
						readonly="readonly" onClick="WdatePicker()" /></td>
				</tr>
				<tr>
					<td>老师:</td>
					<td><select name="teacher.techid">

							<c:forEach items="${requestScope.ts }" var="t" varStatus="status">
								<option value="${t.techid }"
									<c:if test="${requestScope.techCls.teacher.techid == t.techid }">
					 		selected="selected"
					 		</c:if>>${t.techname }</option>
							</c:forEach>
					</select> <input type="hidden" value="${requestScope.cls.classid }"
						name="classes.classid" />
						 <input type="hidden" value="${requestScope.techCls.techclsid }"
						name="techclsid" /></td>
				</tr>
				<tr>
					<td><input type="submit" onclick="return chk()" value="提  交" /></td>
					<td><input type="reset" value="重  置" /></td>
				</tr>

			</table>
		</form>
	</center>
</body>
</html>
