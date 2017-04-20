<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'testZTree.jsp' starting page</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/js/zTree/css/demo.css">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/js/zTree/css/zTreeStyle.css">
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/zTree/js/jquery-1.4.4.min.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/zTree/js/jquery.ztree.core.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/zTree/js/jquery.ztree.excheck.js"></script>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/zTree/js/jquery.ztree.exedit.js"></script>
<SCRIPT type="text/javascript">
		
		var setting = {
			view: {
				addHoverDom: addHoverDom,
				removeHoverDom: removeHoverDom,
				selectedMulti: false
			},
			check: {
				enable: true
			},
			edit: {
				enable: true,
				editNameSelectAll: true
				
			},
			data: {
				key : {
					name : 'dept_name'
			},
				simpleData: {
					enable: true,
					idKey: "dept_id",
					pIdKey: "pid",
				}
			},
			callback: {
				beforeDrag: beforeDrag,
				beforeEditName: beforeEditName,
				beforeRemove: beforeRemove,
				beforeRename: beforeRename,
				onRemove: onRemove,
				onRename: onRename
			}
		};
		//定义的用来缓存的节点
		var addNodeMap={};
		var newNode ;
		var zNodes ;
		var log, className = "dark";
		var formData = {};
		function beforeDrag(treeId, treeNodes) {
			return false;
		}
		function beforeEditName(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.dept_name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			zTree.selectNode(treeNode);
			setTimeout(function() {
				if (confirm("进入节点 -- " + treeNode.dept_name + " 的编辑状态吗？")) {
					setTimeout(function() {
						zTree.editName(treeNode);
					}, 0);
				}
			}, 0);
			return false;
		}
		function beforeRemove(treeId, treeNode) {
			className = (className === "dark" ? "":"dark");
			showLog("[ "+getTime()+" beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.dept_name);
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			zTree.selectNode(treeNode);
			return confirm("确认删除 节点 -- " + treeNode.dept_name + " 吗？");
		}
		function onRemove(e, treeId, treeNode) {
			alert(treeNode.dept_id);
			formData.dept_id =treeNode.dept_id;
			$.ajax({
			    url : "${pageContext.request.contextPath}/dept/delDept",
			    type : "POST", 
			    dataType:"json",
			    contentType:'application/json;charset=UTF-8',
			    data:JSON.stringify(formData),
			    success : function(data) {
			       alert(data.rs);
			        reloadTree();
			    },
				error:function(e){
			    	alert("err");   
			    }   });
			//showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.dept_name);
		}
		
		function beforeRename(treeId, treeNode, newName, isCancel) {
		
			className = (className === "dark" ? "":"dark");
			showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.dept_name + (isCancel ? "</span>":""));
			if (newName.length == 0) {
				setTimeout(function() {
					var zTree = $.fn.zTree.getZTreeObj("treeDemo");
					zTree.cancelEditName();
					alert("节点名称不能为空.");
				}, 0);
				return false;
			}
			//alert(1);
			formData.dept_name =newName;
			formData.pid =treeNode.pid;
			formData.dept_url =treeNode.dept_url;
			var isNewNode = false;
			//这个地方要注意是添加还是修改
			if(addNodeMap["ad"+treeNode.dept_id]){
				isNewNode = true;
			}else{
			
				formData.dept_id =treeNode.dept_id;
			}
			$.ajax({
			    url : "${pageContext.request.contextPath}/dept/testData",
			    type : "POST", 
			    dataType:"json",
			    contentType:'application/json;charset=UTF-8',
			    data:JSON.stringify(formData),
			    success : function(data) {
			        if(isNewNode){
			        	 if(data.rs==1){
			        	 	alert("添加成功");
			        	 }else{
			        	 	alert("添加失败");
			        	 }
			        }else{
			        	if(data.rs==1){
			        	 	alert("修改成功");
			        	 }else{
			        	 	alert("修改失败");
			        	 }
			        }
			        if(data.rs==1){
			        	if(isNewNode){
			        		 delete addNodeMap["ad"+treeNode.dept_id];
			        	}
			        	isNewNode = false;
			        }
			        reloadTree();
			    },
				error:function(e){
			    	alert("err");   
			    }   });
			return true;
		}
		function onRename(e, treeId, treeNode, isCancel) {
			showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
		}
		
		function showLog(str) {
			if (!log) log = $("#log");
			log.append("<li class='"+className+"'>"+str+"</li>");
			if(log.children("li").length > 8) {
				log.get(0).removeChild(log.children("li")[0]);
			}
		}
		function getTime() {
			var now= new Date(),
			h=now.getHours(),
			m=now.getMinutes(),
			s=now.getSeconds(),
			ms=now.getMilliseconds();
			return (h+":"+m+":"+s+ " " +ms);
		}

		var newCount = 100;
		
		function addHoverDom(treeId, treeNode) {
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='add node' onfocus='this.blur();'></span>";
			sObj.after(addStr);
			var btn = $("#addBtn_"+treeNode.tId);
			
			if (btn) btn.bind("click", function(){
				var zTree = $.fn.zTree.getZTreeObj("treeDemo");
				
				newNode = {"dept_id":newCount, "pid":treeNode.dept_id, "dept_name":"new node" + newCount,"dept_url":treeNode.dept_url};
				newNode =zTree.addNodes(treeNode, newNode);
				//缓存新建节点
				addNodeMap["ad" + newCount]= newCount;
				newCount++;
				zTree.editName(newNode[0]);
				
				console.log(newNode[0]);
				
				return false;
			});
		};
		function removeHoverDom(treeId, treeNode) {
			$("#addBtn_"+treeNode.tId).unbind().remove();
		};
		
		
		$(document).ready(function(){
			reloadTree();
		});
		function selectAll() {
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
		}
		function reloadTree(){
			$.ajax({
				type:"GET",
				url:"${pageContext.request.contextPath}/dept/listData",
				dataType: "json",
				success:function(data){
					zNodes=data;
					$.fn.zTree.init($("#treeDemo"), setting, zNodes);
					
				}
			});
		}
	</SCRIPT>
	<style type="text/css">
.ztree li span.button.add {margin-left:2px; margin-right: -1px; background-position:-144px 0; vertical-align:top; *vertical-align:middle}
	</style>
  </head>
  
  <body>
  <center>
	  <div class="content_wrap">
		<div class="zTreeDemoBackground left">
			<ul id="treeDemo" class="ztree"></ul>
		</div>
		
	</div>	
	</center>
  </body>
</html>
