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
			    url:'${pageContext.request.contextPath}/profession/doprofession?method=listProfession',
			    method:'get',
			    pagination:'true',
			    rownumbers:true,
			    pageSize:2,
			    pageList:[2,4,6,8],
			    columns:[[
			        {field:'prosname',title:'专业名',align:'center',width:100},
			        {field:'prosdesc',title:'专业详情',align:'center',width:100},
			        
			       
			        {field:'createDate',title:'创建日期',align:'center',width:100},
			       /*  {field:'icon',title:'操作',align:'center',width:100,formatter:function(value,row,index){
			        	var str1 = $.formatString("<img src={0} onclick='editFun({1})'/>","${pageContext.request.contextPath}/js/themes/icons/pencil.png",row.productId);
			        	var str2 = $.formatString("<img src={0} onclick='delFun({1})'/>","${pageContext.request.contextPath}/js/themes/icons/cancel.png",row.productId);
			        	var str3 = $.formatString("<img src={0} onclick='showFun({1})'/>","${pageContext.request.contextPath}/js/themes/icons/more.png",row.productId);
			        	return str1+"&nbsp;"+str2+"&nbsp;"+str3;
			        }}, */
			    ]]
			});
		
		});
		function addProfession(){
			$('<div></div>').dialog({
				id:"addDialog",
	    		title: '添加专业',
	   			 width: 500,
	   			 height: 400,
	    		 href: '${pageContext.request.contextPath}/profession/add-profession.jsp',
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
	</script>

  </head>
  
  <body>
  	<center><h3>专业管理</h3></center>
  	<button  style="border:1px solid lightgrey;" value="提交" class="easyui-linkbutton" iconCls="icon-add" plain="true" onclick="addProfession()">添加专业</button>
  	<br/>
  	<br/>
  	<table id="dg">
  	
  	</table>
  </body>
</html>
