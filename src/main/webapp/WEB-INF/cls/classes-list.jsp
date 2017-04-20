<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'profession-list.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/js/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/js/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="h${pageContext.request.contextPath}/js/themes/color.css">
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.min.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.easyui.min.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/locale/easyui-lang-zh_CN.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/extJquery.js"></script>
	<script language="javascript" type="text/javascript" src="${pageContext.request.contextPath}/js/My97DatePicker/WdatePicker.js"></script>
	<script type="text/javascript">
	
		$(document).ready(function(){
			
			$('#dg').datagrid({
			    url:'${pageContext.request.contextPath}/cls/listData',
			    method:'get',
			    pagination:'true',
			    rownumbers:true,
			    pageSize:2,
			    pageList:[2,4,6,8],
			    columns:[[
			        {field:'classname',title:'班级名',align:'center',width:100},
			        {field:'classdesc',title:'班级介绍',align:'center',width:100},
			        {field:'pros',title:'供应商',width:100,align:'center',formatter:function(value,row,index){
			        	if(value.prosname){
			        		return value.prosname;
			        	}else{
			        		return "";
			        	}
			        }},
			        {field:'createDate',title:'创建日期',align:'center',width:100},
			        {field:'icon',title:'操作',align:'center',width:100,formatter:function(value,row,index){
			        	var str1 = $.formatString("<img src={0} onclick='editFun({1})'/>","${pageContext.request.contextPath}/js/themes/icons/pencil.png",row.classid);
			        	var str2 = $.formatString("<img src={0} onclick='delFun({1})'/>","${pageContext.request.contextPath}/js/themes/icons/cancel.png",row.classid);
			        	/* var str3 = $.formatString("<img src={0} onclick='showFun({1})'/>","${pageContext.request.contextPath}/js/themes/icons/more.png",row.productId); */
			        	return str1+"&nbsp;"+str2;
			        }}, 
			    ]]
			});
		
		});
		function addCls(){
			$('<div></div>').dialog({
				id:"addDialog",
	    		title: '添加班级',
	   			 width: 500,
	   			 height: 400,
	    		 href: '${pageContext.request.contextPath}/cls/addClsData',
	    		 modal: true,
	    		 minimizable:true,
	    		 maximizable:true,
	    		 resizable:true,
	    		 buttons:[{
						text:'添加',
						handler:function(){
							$('#addForm').submit();
						}
					},{
						text:'取消',
						handler:function(){
						 $("#addDialog").dialog("destroy");
						}
					}]
			});
		}
		function editFun(classid){
			$('<div></div>').dialog({
				 id:"editDialog",
	    		 title: '修改班级信息',
	   			 width: 500,
	   			 height: 400,
	    		 href: '${pageContext.request.contextPath}/cls/editClsData?id='+classid,
	    		 modal: true,
	    		 minimizable:true,
	    		 maximizable:true,
	    		 resizable:true,
	    		 buttons:[{
						text:'修改',
						handler:function(){
							$('#editForm').submit();
						}
					},{
						text:'取消',
						handler:function(){
						 $("#editDialog").dialog("destroy");
						}
					}]
			});
		}
		function delFun(classid){
			$.messager.confirm('提示','确定要删除该班级信息吗？',function(r){
			    if (r){
			        $.ajax({
						type:"GET",
						url:"${pageContext.request.contextPath}/cls/delClass",
						data:"id="+classid,
						dataType: "json",
						success:function(data){
							if(data.tag>0){
								$('#dg').datagrid('reload');
							}else{
								$.messager.alert('警告',data.msg);
							}
							
						}
					});
			    }
			});
			
		}
	</script>
	<style type="text/css">
		a{
			color:blue;
			font-family: sans-serif;
			font-size: 20px;
			 text-decoration:none;
		}
		
	</style>
  </head>
  
  <body>
  <center>
  <h1 style="color:skyblue;">班级管理</h1>
  	<button  style="border:1px solid lightgrey;" value="提交" class="easyui-linkbutton" iconCls="icon-add" plain="true" onclick="addCls()">添加班级</button>
  	<br/>
  	<br/>
  	<table id="dg">
  	
  	</table>
  	<br/>
  	<br/>
  	<a href="${pageContext.request.contextPath}/index.jsp">返回主界面</a>
  	</center>
  </body>
</html>
