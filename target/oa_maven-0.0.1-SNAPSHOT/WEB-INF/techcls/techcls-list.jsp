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
			$.ajax({
				type:"GET",
				url:"${pageContext.request.contextPath}/pro/getPro",
				dataType: "json",
				success:function(data){
				//alert(1);
					for(var i= 0;i < data.length;i++){
					$("#professionId").append("<option value='"+data[i].prosid+"'>"+data[i].prosname+"</option>");
					//$("#providerId").append("<option value='0'>111</option>");
					//alert(data[i].providerName);
					}
				}
			});
			$('#dg').datagrid({
			    url:'${pageContext.request.contextPath}/techcls/listData',
			    method:'get',
			    pagination:'true',
			    rownumbers:true,
			    pageSize:2,
			    pageList:[2,4,6,8],
			    columns:[[
			        
			        {field:'cname',title:'班级',width:100,align:'center',formatter:function(value,row,index){
			        	if(row.cls){
			        		return row.cls.classname;
			        	}else{
			        		return "";
			        	}
			        }},
			        {field:'pname',title:'专业',width:100,align:'center',formatter:function(value,row,index){
			        	if(row.cls){
			        		return row.cls.pros.prosname;
			        	}else{
			        		return "";
			        	}
			        }},
			         {field:'techs',title:'教师',align:'center',width:200},
			         {field:'sdate',title:'开班日期',width:100,align:'center',formatter:function(value,row,index){
			        	if(row.cls){
			        		return row.cls.createDate;
			        	}else{
			        		return "";
			        	}
			        }},
			        {field:'edate',title:'结班日期',width:100,align:'center',formatter:function(value,row,index){
			        	if(row.cls){
			        		return row.cls.enddate;
			        	}else{
			        		return "";
			        	}
			        }},
			        
			        {field:'icon',title:'操作',align:'center',width:100,formatter:function(value,row,index){
			        	var str1 = $.formatString("<a href={0}><img src={1} /></a>","${pageContext.request.contextPath}/techcls/editCls?id="+row.cls.classid,"${pageContext.request.contextPath}/js/themes/icons/pencil.png");
			        	var str2 = $.formatString("<img src={0} onclick='showFun({1})'/>","${pageContext.request.contextPath}/js/themes/icons/more.png",row.cls.classid);
			        	/* var str3 = $.formatString("<img src={0} onclick='showFun({1})'/>","${pageContext.request.contextPath}/js/themes/icons/more.png",row.productId); */
			        	return str1+"&nbsp;"+str2;
			        }}, 
			    ]]
			});
			$("#sub").click(function(){
				$('#dg').datagrid('load', $.serializeObject($("#frMng")));
				//alert(1);
				return false;
			});
		
		});
		function showFun(orderId){
			$('<div></div>').dialog({
				 id:"showDialog",
	    		 title: '带班详情',
	   			 width: 500,
	   			 height: 400,
	    		 href: '${pageContext.request.contextPath}/techcls/showData?id='+orderId,
	    		 modal: true,
	    		 minimizable:true,
	    		 maximizable:true,
	    		 resizable:true,
	    		 buttons:[{
						text:'关闭',
						handler:function(){
						 $("#showDialog").dialog("destroy");
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
  <h1 style="color:skyblue;">老师带班管理</h1>
  	<form id="frMng" action="${pageContext.request.contextPath}/techcls/listTechCls" method="post">
		<table cellpadding="10">
			<tr>
				<td>专业名:&nbsp; <select id="professionId" name="pros.prosid">
						<option value="0">请选择</option>
				</select>
				</td>
				
		 		
		 	<td>开始日期:</td>
		 	<td><input type="text" name="createDate" readonly="readonly" onClick="WdatePicker()"/></td>
		 	<td>终止日期:</td>
		 	<td><input type="text" name="enddate" readonly="readonly" onClick="WdatePicker()"/></td>
		 
				<td><input type="submit" id="sub" name="submit" value="搜   索" /></td>
			</tr>
		</table>
	</form>
  	
  	<table id="dg">
  	
  	</table>
  	<br/>
  	<br/>
  	<a href="${pageContext.request.contextPath}/index.jsp">返回主界面</a>
  	</center>
  </body>
  
</html>
