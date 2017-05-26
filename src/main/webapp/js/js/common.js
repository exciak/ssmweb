
function exchangeState2CN(english){
	var cn = "";

	switch (english) {
		case "APPLYING": {
			cn = "待获取申请";
			break;
		}
		case "OBTAINAUTHORIZING": {
			cn = "待获取权签";
			break;
		}
		case "OBTAINPREPARING": {
			cn = "待获取准备";
			break;
		}
		case "SUPPLYAUOTHRIZING": {
			cn = "待供应权签";
			break;
		}
		case "EXCHANGING": {
			cn = "数据传输";
			break;
		}
		case "END": {
			cn = "交换成功";
			break;
		}
		case "TERMINATED": {
			cn = "获取已终止";
			break;
		}
	}

	return cn;
}

//使用bootstrap-notify实现：http://goodybag.github.io/bootstrap-notify，需要包含jquery.js、bootstrap-notify.js
//提示type: "success", "info", "warning", "bangTidy", "blackgloss"

//成功消息通知，2s关闭
function dmallNotify(message) {
	$('.bottom-right').notify({
		type: "info",
		closable: true,
		fadeOut: {enabled: true, delay: 2000},
		message: {text: message}
	}).show();
}
//成功消息通知，500ms后关闭并跳转页面
function dmallNotifyAndLocation(message, url) {
	function locationNewUrl() {
		location.href = url;
	};

	$('.bottom-right').notify({
		type: "info",
		closable: true,
		fadeOut: {enabled: true, delay: 500},
		message: {text: message},
		onClosed: locationNewUrl
	}).show();
}
//错误消息通知，不自动消失
function dmallError(message) {
	$('.bottom-right').notify({
		type: "danger",
		closable: true,
		fadeOut: {enabled: false},
		message: {text: message}
	}).show();
}

//错误消息通知，不自动消失
function dmallAjaxError() {
    $('.bottom-right').notify({
        type: "danger",
        closable: true,
        fadeOut: {enabled: false},
        message: {text: "请求错误或者用户登录已过期，请重试。"}
    }).show();
}

/* 中文、数字、字母、下划线,不能由下划线开头，长度1-64字符：/^(?!_)[a-zA-Z0-9_\u4e00-\u9fa5]{1,64}$/; */
/* 中文、数字、字母、下划线,不能由下划线开头，长度不限：/^(?!_)[a-zA-Z0-9_\u4e00-\u9fa5]+$/；     */
/* 中文、数字、字母、下划线,长度不限：/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/；     */
/* 由数字、26个英文字母或者下划线组成的字符串:^\w+$;  */
/* 电话： /^((\+?86)|(\(\+86\)))?\d{3,4}-\d{7,8}(-\d{3,4})?$/; */
/* 手机： /^((\+?86)|(\(\+86\)))?1\d{10}$/; */
function inputCheckName(string){
	var regex =  /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,64}$/;
	return regex.test(string);

}
//检查数据项名称（数字、字母、下划线）不能有中文
function inputCheckItemName(string){
    var regex =  /^[a-zA-Z0-9_]{1,120}$/;
    return regex.test(string);

}

/*输入数字、字母、中文*/
function inputCheckNameLax1(string){
	var regex =  /^[\w\u4e00-\u9fa5]{1,64}$/;
	return regex.test(string);

}

/* 输入中文、英文字母、数字、标点符号 */
function inputCheckNameLax2(string) {
	var regex =  /^\S{1,64}$/;
	return regex.test(string);
}

/*    数字、字母、下划线 */
function inputCheck(string){
	var regex =  /^[a-zA-Z0-9_]+$/;
	return regex.test(string);
}

function inputTelephone(string){
	var ret = false;
	var isPhone = /^((\+?86)|(\(\+86\)))?1\d{10}$/;
	var isMob = /^((\+?86)|(\(\+86\)))?\d{3,4}-\d{7,8}(-\d{3,4})?$/;
	if((isMob.test(string)) || (isPhone.test(string))){
		ret = true;
	}

	return ret;
}

function inputCheckNum(string){
	var regex = /^[0-9]*[1-9][0-9]*$/;
	return regex.test(string);
}

/* 1-16位 数字 */
function inputCheckCodeNum(string) {
	var regex = /^[0-9]{1,16}$/
	return regex.test(string);
}

/* 1-16位 数字、字母 */
function inputCheckCode(string){
	var regex = /^[A-Za-z0-9]{1,16}$/;
	return regex.test(string);
}

function inputEmail(string){
	var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(string);
}

/*长度检查，中文检查，空格检查 */
function checkTableName(string) {
	if(string.length > 64) {
		return false;
	}
	var regex = /^[^\u4e00-\u9fa5 ]{0,64}$/;
	return regex.test(string);
}

function inputTable(string){
	var sqlKeyWord = ["ADD","AFTER","ALL","ALTER","ANALYZE","AND","ARCHIVE","ARRAY","AS","ASC",
		"BEFORE","BETWEEN","BIGINT","BINARY","BLOB","BOOLEAN","BOTH","BUCKET","BUCKETS","BY","CASCADE",
		"CASE","CAST","CFILE","CHANGE","CLUSTER","CLUSTERED","CLUSTERSTATUS","COLLECTION","COLUMN","COLUMNS",
		"COMMENT","COMPUTE","CONCATENATE","CONTINUE","CREATE","CROSS","CURRENT","CURSOR","DATA","DATABASE",
		"DATABASES","DATE","DATETIME","DBPROPERTIES","DEFERRED","DELETE","DELIMITED","DESC","DESCRIBE",
		"DIRECTORY","DISABLE","DISTINCT","DISTRIBUTE","DOUBLE","DROP","ELSE","ENABLE","END","ESCAPED",
		"EXCLUSIVE","EXISTS","EXPLAIN","EXPORT","EXTENDED","EXTERNAL","FALSE","FETCH","FIELDS","FILEFORMAT",
		"FIRST","FLOAT","FOLLOWING","FORMAT","FORMATTED","FROM","FULL","FUNCTION","FUNCTIONS","GRANT",
		"GROUP","HAVING","HOLD_DDLTIME","IDXPROPERTIES","IF","IMPORT","IN","INDEX","INDEXES","INPATH",
		"INPUTDRIVER","INPUTFORMAT","INSERT","INT","INTERSECT","INTO","IS","ITEMS","JOIN","KEYS","LATERAL",
		"LEFT","LIFECYCLE","LIKE","LIMIT","LINES","LOAD","LOCAL","LOCATION","LOCK","LOCKS","LONG","MAP",
		"MAPJOIN","MATERIALIZED","MINUS","MSCK","NOT","NO_DROP","NULL","OF","OFFLINE","ON","OPTION","OR",
		"ORDER","OUT","OUTER","OUTPUTDRIVER","OUTPUTFORMAT","OVER","OVERWRITE","PARTITION","PARTITIONED",
		"PARTITIONPROPERTIES","PARTITIONS","PERCENT","PLUS","PRECEDING","PRESERVE","PROCEDURE","PURGE",
		"RANGE","RCFILE","READ","READONLY","READS","REBUILD","RECORDREADER","RECORDWRITER","REDUCE",
		"REGEXP","RENAME","REPAIR","REPLACE","RESTRICT","REVOKE","RIGHT","RLIKE","ROW","ROWS","SCHEMA",
		"SCHEMAS","SELECT","SEMI","SEQUENCEFILE","SERDE","SERDEPROPERTIES","SET","SHARED","SHOW",
		"SHOW_DATABASE","SMALLINT","SORT","SORTED","SSL","STATISTICS","STORED","STREAMTABLE",
		"STRING","STRUCT","TABLE","TABLES","TABLESAMPLE","TBLPROPERTIES","TEMPORARY","TERMINATED",
		"TEXTFILE","THEN","TIMESTAMP","TINYINT","TO","TOUCH","TRANSFORM","TRIGGER","TRUE","UNARCHIVE",
		"UNBOUNDED","UNDO","UNION","UNIONTYPE","UNIQUEJOIN","UNLOCK","UNSIGNED","UPDATE","USE","USING",
		"UTC","UTC_TMESTAMP","VIEW","WHEN","WHERE","WHILE",
	];

	for (var i=0; i < sqlKeyWord.length; i++) {
		if (string.toUpperCase() == sqlKeyWord[i]) {
			return false;
		}
	}

	var regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
	return regex.test(string);
}

function inputTrim(){
	//arguments.length表示传入参数的个数
	for(i = 0; i < arguments.length; i++){
		var value = document.getElementById(arguments[i]).value;
		value = value.replace(/(^\s*)|(\s*$)/g, "");
		document.getElementById(arguments[i]).value = value;
	}

	return;
}

/**
 *@param {string} url 完整的URL地址
 *@returns {object} 自定义的对象
 *@description 用法示例：var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top');
 myURL.file='index.html'
 myURL.hash= 'top'
 myURL.host= 'abc.com'
 myURL.query= '?id=255&m=hello'
 myURL.params= Object = { id: 255, m: hello }
 myURL.path= '/dir/index.html'
 myURL.segments= Array = ['dir', 'index.html']
 myURL.port= '8080'
 myURL.protocol= 'http'
 myURL.source= 'http://abc.com:8080/dir/index.html?id=255&m=hello#top'
 */
function parseURL(url) {
	var a =  document.createElement('a');
	a.href = url;
	return {
		source: url,
		protocol: a.protocol.replace(':',''),
		host: a.hostname,
		port: a.port,
		query: a.search,
		params: (function(){
			var ret = {},
				seg = a.search.replace(/^\?/,'').split('&'),
				len = seg.length, i = 0, s;
			for (;i<len;i++) {
				if (!seg[i]) { continue; }
				s = seg[i].split('=');
				ret[s[0]] = s[1];
			}
			return ret;
		})(),
		file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
		hash: a.hash.replace('#',''),
		path: a.pathname.replace(/^([^\/])/,'/$1'),
		relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
		segments: a.pathname.replace(/^\//,'').split('/')
	};
}
function formatString(str,length){
	var newStr = str.substr(0,length);
	newStr = newStr + "...";
	if(str.length <= length){
		return str;
	} else{
		return newStr;
	}
}

/*
	清空弹出窗口
	input输入框内容
	border-red的边框变红
	text-danger的报错提示
	checkbox/radio/textarea
 */
function emptyModal(modal) {
	$("#"+modal+" input[type=text]").each(function () {
		$(this).val("");
		$(this).removeClass("border-red");
		$(this).removeClass("errorC");
	});
	$("#"+modal+" input[type=password]").each(function () {
		$(this).val("");
		$(this).removeClass("border-red");
		$(this).removeClass("errorC");
	});
	$("#"+modal+" select").each(function () {
		$(this).val("");
		$(this).removeClass("border-red");
		$(this).removeClass("errorC");
	});
	$("#"+modal+" textarea").each(function () {
		$(this).val("");
		$(this).removeClass("border-red");
		$(this).removeClass("errorC");
	});
	$("#" + modal + " .text-danger").hide();
	$("#" + modal + " checkbox").prop("checked", false);
	$("#" + modal + " radio").eq(0).prop("checked", "checked");
	$("#" + modal + " textarea").val("");
}

/*
	将字符串中的正则表达式不能辨识的字符转为转义字符
 */
function toEscStr(string) {
	//var tranChars = /^[\Q*.?\+$^[](){}|\/\E] $/;
	//var regExp = new RegExp(tranChars, "g")
	//var tranStr = string.replace(regExp, "");
	//while(string.indexOf('*'))
	var escStr = string.replace(/\\/g, "\\\\");
	escStr = escStr.replace(/\*/g, "\\*");
	escStr = escStr.replace(/\./g, "\\.");
	escStr = escStr.replace(/\?/g, "\\?");
	escStr = escStr.replace(/\+/g, "\\+");
	escStr = escStr.replace(/\$/g, "\\$");
	escStr = escStr.replace(/\^/g, "\\^");
	escStr = escStr.replace(/\[/g, "\\[");
	//escStr = escStr.replace(/\]/g, "\\]");
	escStr = escStr.replace(/\(/g, "\\(");
	escStr = escStr.replace(/\)/g, "\\)");
	escStr = escStr.replace(/\{/g, "\\{");
	//escStr = escStr.replace(/\}/g, "\\}");
	escStr = escStr.replace(/\|/g, "\\|");
	escStr = escStr.replace(/\//g, "\\/");
	return escStr;
}


/*
	TCP/IP端口检验
 */
function checkTcpIpPort(port) {
	var RegPort = /^([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
	return RegPort.test(port);
}
/*
 输入框内删除按钮
 */
function doClear(obj){
	$(obj).siblings("input").val("");
	$(obj).siblings("input").removeClass("errorC");
	$(obj).addClass("hidden");
}

//去除URL{}[]
function delBracket(string){
	var escStr = string.replace("{", "");
	escStr = escStr.replace("}", "");
	escStr = escStr.replace("[", "");
	escStr = escStr.replace("]", "");
	return escStr;
}

//构建表格树
function drawTabelTree(name,data){
	var $list = $("#"+name + "TableList");
	var $input = $("#"+name + "Table");
	var $wrap = $("#"+name + "TableListWrap");
	$list.empty();
	if (data.length == 0) {
		$input.addClass("errorC");
		$input.siblings("small").html("*请选择正确的表");
		$input.siblings("small").css("display", "block");
		$wrap.hide();
	} else {
		$input.removeClass("errorC");
		$input.siblings("small").hide();
		for (var i = 0; i < data.length; i++) {
			var table = data[i];
			var trHTML = '<li class="longText" style="height: 20px" title=' + table + '><a href="javascript:void(0)">' + table+'</a></li>';
			$list.append(trHTML);
		}
		$wrap.show();
        $list.show();
	}
}

//搜索表格树
function searchTableTree(string,array,type){
	var newArr = [];
	for(var i = 0; i < array.length; i++){
		var Str = array[i];
		if(type == "exact"){
			if(Str == string){
				newArr.push(Str);
			}
		}else{
			if(Str.indexOf(string) >= 0){
				newArr.push(Str);
			}
		}
	}
	return newArr;
}
function normalUrlRegExp(url) {
	if (url == '')
		return -1;
	var urlType = /^((http|https):\/\/)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?(\/\S+)*(\?(\S)(\&\S)*)?$/;
	var regExpURL = new RegExp(urlType);
	return regExpURL.test(url);
}
//URL格式验证
function UrlRegExp(url) {
	if (url == '')
		return -1;
	var urlType = /^((http|https):\/\/)(([a-zA-Z0-9\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:([1-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?(\/[a-zA-Z0-9\._\-\#]+)*((\/\[((?!\/)\S)+\])|(\/\{((?!\/)\S)+\}))*\/?$/;
	var regExpURL = new RegExp(urlType);
	return regExpURL.test(url);
}

//纯数字验证
function IntRegExp(integer) {
	var intType = /^[0-9]*$/;
	if (integer == '')
		return -1;
	var regExpInt = new RegExp(intType);
	return regExpInt.test(integer);
}

function UrlLegal(url) {
	if (url.indexOf('?') != '-1')
		return -1;
	else
		return UrlRegExp(url);
}

function htmlEncode(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    var str = div.innerHTML;
    str=str.replace(/\'/g,"&apos;");
    str=str.replace(/\"/g,"&quot;");
    return str;
}
function htmlDecode(str) {
    var div = document.createElement("div");
    div.innerHTML = str;
    return div.innerText;
}