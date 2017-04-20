<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>


	
	<script type="text/javascript">
		$(document).ready(function() {
		
			$('#editForm').form({
		    url:"${pageContext.request.contextPath }/tech/editTech",
		    onSubmit: function(){
		    //alert($("#pName").val());
		    	if($.trim($("#pName").val())==""){
		    		$.messager.alert('警告','专业名不能为空！');
		    		return false;
		    	}
		    	return true;
		    },
		    success:function(data){
		    	var result = $.parseJSON(data);
		    	//alert(result.tag);
		    	if(result.tag>0){
		    		$('#dg').datagrid('reload');
		    		$("#editDialog").dialog("destroy");
		    	}else{
		    		$.messager.alert('警告',result.msg);
		    	}
		    }
		});
		});
		
	
	</script>

  
  

  	<form id="editForm"  method="post">
  	<table cellpadding="5">
		 <tr>
		 	<td>教师名称:</td> 
		 	
		 	<td><input type="hidden"  name="techid" value="${requestScope.tech.techid }"/><input type="text" id="pName" name="techname" value="${requestScope.tech.techname }"/></td>
		 </tr> 	
		 
		 <tr>
		 	<td>性别:</td>
		 	<td><input type="text" id="pSex" name="gender" value="${requestScope.tech.gender }"/></td>
		 </tr>
		 <tr>
		 	<td>年龄：</td>
		 	<td><input type="text" id="pAge" name="age" value="${requestScope.tech.age }"/></td>
		 </tr> 	
  	</table>
  	</form>
  

