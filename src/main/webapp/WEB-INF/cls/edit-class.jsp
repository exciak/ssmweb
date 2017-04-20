<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>



<script type="text/javascript">
	$(document).ready(function() {

		$('#editForm').form({
			url : "${pageContext.request.contextPath }/cls/editCls",
			onSubmit : function() {
				//alert($("#pName").val());
				if ($.trim($("#cName").val()) == "") {
					$.messager.alert('警告', '班级名不能为空！');
					return false;
				}
				return true;
			},
			success : function(data) {
				var result = $.parseJSON(data);
				//alert(result.tag);
				if (result.tag > 0) {
					$('#dg').datagrid('reload');
					$("#editDialog").dialog("destroy");
				} else {
					$.messager.alert('警告', result.msg);
				}
			}
		});
	});
</script>




<form id="editForm" method="post">
	<table cellpadding="5">
		<tr>
			<td>班级名称:</td>
			<td><input type="hidden"  name="classid" value="${requestScope.classes.classid }"/><input type="text" id="cName" name="classname" value="${requestScope.classes.classname }"/></td>
		</tr>
		<tr>
			<td>专业名称：</td>
			<td><select name="pros.prosid">
					<option value="0">请选择</option>
					<c:forEach items="${requestScope.professions }" var="pros">
						<option value="${pros.prosid }"
							<c:if test="${pros.prosid == requestScope.classes.pros.prosid }">
					 		selected="selected"
					 		</c:if>>${pros.prosname }</option>
					</c:forEach>
			</select></td>
		</tr>
		<tr>
			<td>创建日期:</td>
			<td><input type="text" name="createDate" readonly="readonly"
				value="<fmt:formatDate value="${requestScope.classes.createDate}" pattern="yyyy-MM-dd"/>"
				onClick="WdatePicker()" /></td>
		</tr>
		<tr>
			<td>结束日期:</td>
			<td><input type="text" name="enddate" readonly="readonly"
				value="<fmt:formatDate value="${requestScope.classes.enddate}" pattern="yyyy-MM-dd"/>"
				onClick="WdatePicker()" /></td>
		</tr>
		<tr>
			<td>班级介绍:</td>
			<td><textarea name="classdesc" rows="10" cols="20">${requestScope.classes.classdesc }</textarea></td>
		</tr>
	</table>
</form>


