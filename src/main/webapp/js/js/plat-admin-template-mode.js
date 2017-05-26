$(document).ready(function(){
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var proName = arr[1];
    var rootPath = "http://" + window.location.host + "/" + proName;
    var modeLineCount = 1;
    var modeLineId = 1;
    var uniqTag = false;
    $("input").focus(function(){
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
    });
    //修改模版
    if($("#tmpSize").val() != undefined){
        modeLineCount = $("#tmpSize").val();
        modeLineId = $("#tmpSize").val();
    }
    //设置表格可拖动
    $(function () {
        $("#moreTempWrap").sortable(
            {
                axis: 'y', // 仅纵向拖动目的列
                cursor:'move'
            }
        );
    });
    //添加行
    $("#moreTempWrap").delegate(".addModeLine", "click", function () {
            modeLineCount++;
            modeLineId++;
            $("#moreTempWrap").append('<tr><td width="25%">' +
            '          <input type="text" maxlength="32" name="tempFieldName" class="form-control" value="" data-tmpid="0"/>' +
            '           <small class="text-danger"></small></td>' +
            '          <td width="20%"><select class="form-control" name="tempFieldType"><option value="text">text</option><option value="textarea">textarea</option></select>' +
            '          </td>' +
            '          <td width="25%"><input type="text" maxlength="4" name="tempFieldLength" class="form-control"/>' +
            '          <small class="text-danger"></small></td>' +
            '           <td width="10%"><input type="checkbox" name="tempFieldNeed" /></td>' +
            '        <td width="20%">' +
            '          <a href="#" class="addModeLine" style="font-size: 20px" title="添加行"><em class="fa fa-plus-circle"></em></a>' +
            '           <a href="#" class="removeModeLine" style="font-size: 20px" title="删除行"><em class="fa fa-times-circle"></em></a></td>' +
            '        </tr> ');
            return false;
    });
    //添加字段验证
    $("#moreTempWrap").delegate("input[name = 'tempFieldName']", "focus", function () {
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
        $(this).blur(function () {
            checkNotBlank($(this),$(this).siblings("small"),"*请输入字段名");
           checkNameUniq($(this));
        });
    });
    $("#moreTempWrap").delegate("input[name = 'tempFieldLength']", "focus", function () {
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
        $(this).blur(function () {
            checkNumOnly($(this),$(this).siblings("small"),"*字段长度必须为整数");
        });
    });
    //删除行
    $("body").on("click", ".removeModeLine", function () {
        if (modeLineCount > 1) {
            $(this).parent().parent().remove();
            modeLineCount--;
        }
        return false;
    });
    //预览模板
    $("#tempPreview").click(function(){
        var extraData = getPreTempDate();
        var extraDataArray = eval("("+extraData+")");
        if(extraDataArray.length < 1){
            return false;
        }
        $("#tempAllDiv").hide();
        $("#previewDiv").show();
        $("#editBtnGroup").hide();
        $("#previewBtnGroup").show();
        $("#extraDiv").empty();
        console.log(extraDataArray);
        for (var i=0;i<extraDataArray.length;i++){
            if(extraDataArray[i].type == "text"){
                if(extraDataArray[i].required == 1){
                    $("#extraDiv").append('<div class="form-group">' +
                    '<label class="col-sm-3 control-label"><span class="required">*</span>'+extraDataArray[i].name+'：</label>' +
                    '<div class="col-sm-6 controls"> <input type="text" class="form-control"/> </div> </div>');
                }else{
                    $("#extraDiv").append('<div class="form-group">' +
                    '<label class="col-sm-3 control-label">'+extraDataArray[i].name+'：</label>' +
                    '<div class="col-sm-6 controls"> <input type="text" class="form-control"/> </div> </div>');
                }
            } else{
                if(extraDataArray[i].required == 1){
                    $("#extraDiv").append('<div class="form-group">' +
                    '<label class="col-sm-3 control-label"><span class="required">*</span>'+extraDataArray[i].name+'：</label>' +
                    '<div class="col-sm-6 controls"> <textarea class="form-control" rows="4"></textarea> </div> </div>');
                }else{
                    $("#extraDiv").append('<div class="form-group">' +
                    '<label class="col-sm-3 control-label">'+extraDataArray[i].name+'：</label>' +
                    '<div class="col-sm-6 controls"> <textarea class="form-control" rows="4"></textarea> </div> </div>');
                }
            }
        }
    });
    $("#tempBack").click(function(){
        $("#tempAllDiv").show();
        $("#previewDiv").hide();
        $("#editBtnGroup").show();
        $("#previewBtnGroup").hide();
    });
    //保存模板
    $("#tempCreate").click(function(){
        var id = $("#tmpId").val();
        if(!checkNotBlank($("#description"),$(".errorDescription"),"*请填写描述说明")){
            var $selectName = $("#moreTempWrap").find("input[name = 'tempFieldName']");
            var sizeName = $selectName.size();
            for(var i=0;i<sizeName;i++){
                if(checkNotBlank($selectName.eq(i),$selectName.eq(i).siblings("small"),"*请输入字段名")){
                    return false;
                }
            }
            var $selectLength = $("#moreTempWrap").find("input[name = 'tempFieldLength']");
            var sizeLength = $selectLength.size();
            for(var i=0;i<sizeLength;i++){
                if(checkNumOnly($selectLength.eq(i),$selectLength.eq(i).siblings("small"),"*字段长度必须为整数")){
                    return false;
                }
            }
            var jsonCfg = getMoreTempDate();
            if(uniqTag){
                return false;
            }
            if(id != ""){
                saveTmp(id,jsonCfg);
            }else{
                createTmp(jsonCfg);
            }
        } else{
            return false;
        }
    });

    //折叠样式
    $(".panel-heading a").click(function () {
        var el = $(this).children("i");
        if ($(el).hasClass("fa-plus")) {
            $(el).removeClass("fa-plus").addClass("fa-minus");
        } else {
            $(el).removeClass("fa-minus").addClass("fa-plus");
        }
    });
    //取消按钮
    $("#tempCancel").click(function(){
        location.href = rootPath+"/plat_admin/catalogTemplate";
    });
    //获取预览模板数据
    function getPreTempDate() {
        var jsonCfgArray = [];
        $("#moreTempWrap tr").each(function(){
            var json = new Object();
            json.name = $.trim($(this).children("td").eq(0).find("input").val());
            json.type = $.trim($(this).children("td").eq(1).children("select").children("option:selected").val());
            jsonCfgArray.push(json);
        });
        var jsonCfg = JSON.stringify(jsonCfgArray);
        return jsonCfg;
    };
    //获取扩展信息
    function getMoreTempDate() {
        var jsonCfgArray = [];
        var j = 1;
        var tmpIdArray = [];
        for (var i = 1; i <= modeLineCount; i++) {
            var tmpId = $("#moreTempWrap tr:nth-child("+i+")").children("td:nth-child(1)").children("input").data("tmpid");
            if(tmpId != 0){
                tmpId = tmpId.substring(17,tmpId.length);
                tmpIdArray.push(tmpId);
            }
        }
        if(tmpIdArray.length > 0) {
            var max = tmpIdArray[0];
            for(var i=1;i<tmpIdArray.length;i++){
                if(max<tmpIdArray[i]){
                    max=tmpIdArray[i];
                }
            }
            max++;
            j = max;
        }
        uniqTag = false;
        for (var i = 1; i <= modeLineCount; i++) {
            var jsonCfg = new Object();
            var name = $("#moreTempWrap tr:nth-child("+i+")").children("td:nth-child(1)").children("input").val();
            var id = $("#moreTempWrap tr:nth-child("+i+")").children("td:nth-child(1)").children("input").data("tmpid");
            var type = $("#moreTempWrap tr:nth-child("+i+")").children("td:nth-child(2)").children("select").children("option:selected").val();
            var length = $("#moreTempWrap tr:nth-child("+i+")").children("td:nth-child(3)").children("input").val();
            jsonCfg.name = $.trim(name);
            jsonCfg.type = $.trim(type);
            jsonCfg.length = $.trim(length);
            if($("#moreTempWrap tr:nth-child("+i+")").children("td:nth-child(4)").children("input").is(":checked")){
                jsonCfg.required = 1;
            } else{
                jsonCfg.required = 0;
            }
            if (jsonCfg.name != "" && jsonCfg.length != "") {
                if(id != 0){
                    jsonCfg.id = id;
                }else{
                    jsonCfg.id = "extent_parameter_" + j;
                    j++;
                }
                var $selector = $("#moreTempWrap tr:nth-child("+i+")").children("td:nth-child(1)").children("input");
                if(jsonCfgArray.length > 0){
                    if(checkRepeat($selector,jsonCfgArray)){
                        uniqTag = true;
                        return false;
                    }else{
                        jsonCfgArray.push(jsonCfg);
                    }
                }else{
                    jsonCfgArray.push(jsonCfg);
                }
            }
        }
        var jsonCfg = JSON.stringify(jsonCfgArray);
        return jsonCfg;
    };

    //创建模板
    function createTmp(jsonCfg){
        $.post(rootPath+"/template/create",
            {
                jsonCfg: jsonCfg,
                useFlag: "false",
                description: $("#description").val()
            },
            function(data,status){
                if(status == "success" && (data.result == "success")){
                    location.href = rootPath+"/plat_admin/catalogTemplate";
                }else{
                    dmallError(data.result);
                }
            },"json");
    }
    //保存模板
    function saveTmp(id,jsonCfg){
        $.post(rootPath+"/template/edit",
            {
                id: id,
                jsonCfg: jsonCfg,
                useFlag:  $("#useFlag").val(),
                description: $("#description").val()
            },
            function(data,status){
                if(status == "success" && (data.result == "success")){
                    location.href = rootPath+"/plat_admin/catalogTemplate";
                }else{
                    dmallError(data.result);
                }
            },"json");
    }
    //表单验证
    $("#description").focus(function(){
        $("#description").removeClass("errorC");
        $(".errorDescription").hide();
    });
    $("#description").blur(function(){
        checkNotBlank($("#description"),$(".errorDescription"),"*请填写模板描述");
    });
    //非空验证
    function checkNotBlank($select,$errorClass,errorMsg){
        var str = $.trim($select.val());
        if (str == "") {
            $select.addClass("errorC");
            $errorClass.html(errorMsg);
            $errorClass.css("display", "block");
            return true;
        } else {
            $select.removeClass("errorC");
            $errorClass.hide();
            return false;
        }
    }
    //纯数字验证
    function checkNumOnly($select,$errorClass,errorMsg){
        var str = $.trim($select.val());
        var ret = inputCheckNum(str);
        if (!ret) {
            $select.addClass("errorC");
            $errorClass.html(errorMsg);
            $errorClass.css("display", "block");
            return true;
        } else {
            $select.removeClass("errorC");
            $errorClass.hide();
            return false;
        }
    }
    //重名验证
    function checkNameUniq($selector){
        var str = $.trim($selector.val());
        var nameStr = getMoreTempDate();
        var count = 0;
        var nameArr = [];
        if(nameStr == "[]"){
            return false;
        }else{
            nameArr = eval("(" + nameStr + ")");
        }
        if(str != ""){
            for(var i=0;i<nameArr.length;i++){
                if(str == nameArr[i].name){
                    count ++;
                }
            }
        }
        if(count <= 1){
            return false;
        }else{
            $selector.addClass("errorC");
            $selector.siblings("small").show().html("*字段名不允许重复");
            return true;
        }
    }
    function checkRepeat($selector,nameArr){
        var str = $.trim($selector.val());
        var tag = false;
        if(str != ""){
            for(var i=0;i<nameArr.length;i++){
                if(str == nameArr[i].name){
                    $selector.addClass("errorC");
                    $selector.siblings("small").show().html("*字段名不允许重复");
                    tag = true;
                }
            }
        }
        return tag;
    }
});
