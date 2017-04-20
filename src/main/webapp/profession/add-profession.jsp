<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>


	
	<script type="text/javascript">
		$(document).ready(function() {
		
			$('#addForm').form({
		    url:"${pageContext.request.contextPath }/profession/doprofession?method=addprofession",
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
		    		$("#addDialog").dialog("destroy");
		    	}else{
		    	
		    		$.messager.alert('警告','添加失败！');
		    	}
		    }
		});
		});
		
	
	</script>

  
  

  	<form id="addForm"  method="post">
  	<table cellpadding="5">
		 <tr>
		 	<td>专业名称:</td> 
		 	<td><input type="text" id="pName" name="prosname"/></td>
		 </tr> 	
		 
		 <tr>
		 	<td>创建日期:</td>
		 	<td><input type="text" name="createdate" readonly="readonly" onClick="WdatePicker()"/></td>
		 </tr>
		 <tr>
		 	<td>详情介绍：</td>
		 	<td><textarea name="prosdesc" rows="10" cols="20"></textarea></td>
		 </tr> 	
  	</table>
  	</form>
  

