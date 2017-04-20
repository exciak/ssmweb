<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>


	
	<script type="text/javascript">
		$(document).ready(function() {
		
			$('#addForm').form({
		    url:"${pageContext.request.contextPath }/tech/addTech",
		    onSubmit: function(){
		    //alert($("#pName").val());
		    	if($.trim($("#pName").val())==""){
		    		$.messager.alert('警告','教师名不能为空！');
		    		return false;
		    	}
		    	return true;
		    },
		    success:function(data){
		    	var result = $.parseJSON(data);
		    	//alert(result.tag);
		    	if(result.tag>0){
		    		$('#dg').datagrid('reload');
		    		$("#addDialog").dialog("destroy");
		    	}else{
		    		$.messager.alert('警告',result.msg);
		    	}
		    }
		});
		});
		
	
	</script>

  
  

  	<form id="addForm"  method="post">
  	<table cellpadding="5">
		 <tr>
		 	<td>教师名称:</td> 
		 	<td><input type="text" id="pName" name="techname"/></td>
		 </tr> 	
		 
		 <tr>
		 	<td>性别:</td>
		 	<td><input type="text"  name="gender"/></td>
		 </tr>
		 <tr>
		 	<td>年龄：</td>
		 	<td><input type="text"  name="age"/></td>
		 </tr> 	
  	</table>
  	</form>
  

