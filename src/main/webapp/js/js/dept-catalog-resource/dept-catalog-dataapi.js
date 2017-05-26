/**
 *
 */
ExtraCatalog.regGetData(Module.DATAAPI, dataApiGetData);
ExtraCatalog.regInit(Module.DATAAPI, dataApiInit);
ExtraCatalog.regRender(Module.DATAAPI, dataApiRender);
ExtraCatalog.regCheck(Module.DATAAPI, dataApiCheck);

function dataApiGetData(){
    return getDataApiData();
}

function dataApiInit(bool) {
    if(bool)
        initDataApi();
    else{
        if(emptyDataApi()){
            return true;
        } else{
            return false;
        }
    }
}

function dataApiRender(catalog) {
    return renderDataApi(catalog);
}

function dataApiCheck() {
    return (checkDataApiUrl() || checkHttpHeaderValues() || checkHttpErrCodes() || checkHttpErrCodeDesces());
}

$(document).ready()
{

    var resourceTypeCode = "DATAAPI";

    var urlPathF,urlPathT;

    var httpHeaderParaCount = 1;
    var httpHeaderParaId = 1;
    var httpUrlParaCount = 1;
    var httpUrlParaId = 1;
    var httpPathParaCount = 1;
    var httpPathParaId = 1;
    var httpErrCodeCount = 1;
    var httpErrCodeId = 1;
    var httpReqBodyParaCount = 1;
    var httpReqBodyParaId = 1;
    var httpReqBodyExamCount = 1;
    var httpReqBodyExamId = 1;
    var httpRespParaCount = 1;
    var httpRespParaId = 1;
    var httpRespExamCount = 1;
    var httpRespExamId = 1;
    var httpReqBodyModCount = 1;
    var httpRespBodyModCount = 1;

    var oldApiUrl = "";

    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var proName = arr[1];
    var rootPath = "http://" + window.location.host + "/" + proName;

    $("#apiUrl").focus(function () {
        $("#apiUrl").removeClass("errorC");
        $(".errorApiUrl").hide();
    });

    /* 失去焦点*/
    $("#apiUrl").blur(function () {
        var flag = checkDataApiUrl();
        var apiurl = $("#apiUrl").val();
        if ((!flag) && (oldApiUrl != apiurl)){
            addUrlPathParam();
        }
    });

    $("#addMoreHttpHeader").click(function (e) {
        httpHeaderParaCount++;
        httpHeaderParaId++;
        $("#moreHttpHeaderWrapper").append('<tr><td>' +
            '          <input id="httpHeaderName' + httpHeaderParaId + '" type="text" maxlength="32" name="httpHeaderName" class="form-control" value="" />' +
            '        <td colspan="2">' +
            '          <input id="httpHeaderValue' + httpHeaderParaId + '" type="text" maxlength="32" name="httpHeaderValue" class="form-control"/>' +
            '          <small class="errorHttpHeaderValue' + httpHeaderParaId + ' text-danger"></small></td>' +
            '           <td><input type="checkbox"  id="httpHeaderNeed' + httpHeaderParaId + '" name="httpHeaderNeed" /></td>' +
            '        <td>' +
            '          <a href="#" class="removeHttpHeaderClass" style="font-size: 32px">×</a></td>' +
            '        </tr> ');
        return false;
    });
    $("body").on("click", ".removeHttpHeaderClass", function (e) {
        if (httpHeaderParaCount > 1) {
            $(this).parent().parent().remove();
            httpHeaderParaCount--;
        }
        return false;
    });

    $("#addMoreHttpUrlPara").click(function (e) {
        httpUrlParaCount++;
        httpUrlParaId++;
        $("#moreHttpUrlParaWrapper").append('<tr><td>' +
            '          <input id="httpUrlParaName' + httpUrlParaId + '" type="text" maxlength="32" class="form-control"/>' +
            '          </td>' +
            '        <td colspan="2">' +
            '          <input id="httpUrlParaDesc' + httpUrlParaId + '" type="text" maxlength="64" class="form-control"/>' +
            '         </td>' +
            '         <td><input type="checkbox"  id="httpUrlParaNeed' + httpUrlParaId + '" name="httpUrlParaNeed" /></td>' +
            '        <td>' +
            '          <a href="#" class="removeHttpUrlParaClass" style="font-size: 32px">×</a></td>' +
            '        </tr> ');

        return false;
    });

    $("body").on("click", ".removeHttpUrlParaClass", function (e) {
        if (httpUrlParaCount > 1) {
            $(this).parent().parent().remove();
            httpUrlParaCount--;
        }
        return false;
    });

  /*  $("#addMoreHttpErrCode").click(function (e) {
        httpErrCodeCount++;
        httpErrCodeId++;
        $("#moreHttpErrCodeWrapper").append('<tr><td>' +
            '          <input id="httpErrCode' + httpErrCodeId + '" type="text" name="httpErrCode" class="form-control"/>' +
            '          <small class="errorHttpErrCode' + httpErrCodeId + ' text-danger"></small></td>' +
            '        <td colspan="2">' +
            '          <input id="httpErrCodeDesc' + httpErrCodeId + '" name="httpErrCodeDesc" type="text" class="form-control"/>' +
            '          <small class="errorHttpErrCodeDesc' + httpErrCodeId + ' text-danger"></small></td>' +
            '         <td><input type="checkbox"  id="httpErrCodeNeed' + httpErrCodeId + '" name="httpErrCodeNeed" /></td>' +
            '        <td>' +
            '          <a href="#" class="removeHttpErrCodeClass" style="font-size: 32px">×</a></td>' +
            '        </tr> ');

        return false;
    });*/

    $("body").on("click", ".removeHttpErrCodeClass", function (e) {
        if (httpErrCodeCount > 1) {
            $(this).parent().parent().remove();
            httpErrCodeCount--;
        }
        return false;
    });

    //添加BODY模块

    $("body").on("click", ".addMoreHttpReqBodyMod", function () {
        $("#addModName").val("");
        $("#addBodyMod").show();
        $("#addRespMod").hide();
        $("#addModModal").modal({backdrop: 'static', keyboard: false});
    });

    $("#addBodyMod").click(function () {
        var modName = $("#addModName").val();
        if(checkmodName()) {
            return false;
        }
        httpReqBodyModCount++;
        var tf = "mod" + httpReqBodyModCount;
        $("#httpBodyArea").append(
            '<div class="col-sm-12" style=" margin-top: 15px;padding:0px" id="body' + tf + '">' +
            ' <div class="col-sm-2 page-padding"></div>' +
            '                             <div class="col-sm-8">' +
            '                                 <table class="table data-table" id="">' +
            '                                     <thead><tr><td colspan="4"><label id="labelHttpReqBodyModName' + tf + '"></label>' +
            '<input id="HttpReqBodyModName' + tf + '" name="bodyModName" type="text" class="form-control" style="display:none" maxlength="32"/>' +
            '<a class="editModName" title="修改模块名称" style="font-size: 20px"><em class="fa fa-edit" style="color:#1E90FF"></em></a></td>' +
            '                                     <td><a class="checkedName" hidden style="color:#32cd32;font-size: 20px"><em class="fa fa-check"></em></a></td></tr></thead>' +
            '                                     <thead>' +
            '                                     <tr class="data-table-content-head">' +
            '                                         <th class="text-center" width="25%">参数</th>' +
            '                                         <th class="text-center" width="25%">类型</th>' +
            '                                         <th class="text-center" width="30%">描述</th>' +
            '                                         <th class="text-center" width="10%">必选</th>' +
            '                                         <th width="10%"></th>' +
            '                                     </tr>' +
            '                                     </thead>' +
            '                                     <tbody class="text-center a-admin" id="moreHttpReqBodyParaWrapper' + tf + '">  <input value=1 type="hidden" id="httpReqBodyParaCount' + tf + '" />' +
            '                                     <tr>' +
            '                                         <td><input type="text" class="form-control" id="' + tf + 'httpReqBodyParaName1" maxlength="32"/> </td>' +
            '                                         <td><input type="text" class="form-control" id="' + tf + 'httpReqBodyParaType1" maxlength="32"/></td>' +
            '                                         <td><input type="text" class="form-control" id="' + tf + 'httpReqBodyParaDesc1" maxlength="64"/></td>' +
            '                                         <td><input type="checkbox"  id="' + tf + 'httpReqBodyParaNeed1"/></td>' +
            '                                         <td><a href="#" class="removeHttpReqBodyClass" style="font-size: 32px" name="' + tf + '">×</a></td>' +
            '                                     </tr>' +
            '                                     </tbody>' +
            '                                 </table>' +
            '                                 <div class="col-sm-4">' +
            '                                     <button id="addMoreHttpReqBodyPara" type="button" class="btn btn-default btn-block addMoreHttpReqBodyPara" value="' + tf + '">+添加行</button>' +
            '                                 </div>' +
            '                             </div>' +
            '                             <div class="col-sm-2">' +
            '                                 <button type="button" class="btn btn-default btn-block removeMoreHttpReqBodyMod" value="' + tf + '">×去除模块</button>' +
            '                             </div>' +
            '</div>'

        );
        $("#labelHttpReqBodyModName"+tf).text(modName);
        $("#HttpReqBodyModName"+tf).val(modName);
    });
    $("body").on("click", ".editModName", function () {
        $(this).siblings("label").hide();
        $(this).siblings("input").show();
        $(this).parent().next().children("a").show();
        $(this).hide();
    });
    $("body").on("click", ".checkedName", function () {
        $(this).parent().prev().children("label").text( $(this).parent().prev().children("input").val());
        $(this).parent().prev().children("label").show();
        $(this).parent().prev().children("input").hide();
        $(this).parent().prev().children("a").show();
        $(this).hide();
    });

    $("body").on("click", ".removeMoreHttpReqBodyMod", function (e) {
        httpReqBodyModCount--;
        var mod = e.currentTarget.value;
        $('#body' + mod).remove();
    })

    $("body").on("click", ".addMoreHttpReqBodyPara", function (e) {
    //    console.log(e)
        var mod = e.currentTarget.value;
        var modparaCount = $('#httpReqBodyParaCount' + mod).val();
        if (modparaCount == "" || modparaCount == 0) modparaCount = 1
        modparaCount++
        $('#httpReqBodyParaCount' + mod).val(modparaCount);
//        httpReqBodyParaCount++;
//        httpReqBodyParaId++;
        $("#moreHttpReqBodyParaWrapper" + mod).append('<tr><td>' +
            '          <input id="' + mod + 'httpReqBodyParaName' + modparaCount + '" type="text" class="form-control" maxlength="32"/>' +
            '          </td>' +
            '        <td>' +
            '          <input id="' + mod + 'httpReqBodyParaType' + modparaCount + '" type="text" class="form-control" maxlength="32"/>' +
            '         </td>' +
            '        <td>' +
            '          <input id="' + mod + 'httpReqBodyParaDesc' + modparaCount + '" type="text" class="form-control" maxlength="64"/>' +
            '         </td>' +
            '        <td>' +
            '          <input id="' + mod + 'httpReqBodyParaNeed' + modparaCount + '" type="checkbox" />' +
            '         </td>' +
            '        <td>' +
            '          <a href="#" class="removeHttpReqBodyClass" style="font-size: 32px" name="' + mod + '">×</a></td>' +
            '        </tr> ');

        return false;
    });
    $("body").on("click", ".removeHttpReqBodyClass", function (e) {
        var mod = $(this)[0].name;
        var modparaCount = $('#httpReqBodyParaCount' + mod).val();
        if (modparaCount > 1) {
            $(this).parent().parent().remove();
            modparaCount--;
            $('#httpReqBodyParaCount' + mod).val(modparaCount);
        }

//        if (httpReqBodyParaCount > 1) {
//            $(this).parent().parent().remove();
//            httpReqBodyParaCount--;
//        }
        return false;
    });

    $("#addMoreHttpReqBodyExam").click(function (e) {
        httpReqBodyExamCount++;
        httpReqBodyExamId++;
        $("#moreHttpReqBodyExamWrapper").append('<tr>' +
                /* '          <td><input id="httpReqBodyExamDesc'+ httpReqBodyExamId +'" type="text" class="form-control"/>' +
                 '          </td>' +*/
            '        <td colspan="1">' +
            '          <textarea rows="4" id="httpReqBodyExam' + httpReqBodyExamId + '" type="text" maxlength="1024" class="form-control"/></textarea>' +
            '         </td>' +
            '        <td>' +
            '          <a href="#" class="removeHttpReqBodyExamClass" style="font-size: 32px">×</a></td>' +
            '        </tr> ');

        return false;
    });
    $("body").on("click", ".removeHttpReqBodyExamClass", function (e) {
        if (httpReqBodyExamCount > 1) {
            $(this).parent().parent().remove();
            httpReqBodyExamCount--;
        }
        return false;
    });

    $("body").on("click", ".addMoreHttpRespMod", function (e) {
        $("#addModName").val("");
        $("#addBodyMod").hide();
        $("#addRespMod").show();
        $("#addModModal").modal({backdrop: 'static', keyboard: false});
    });
    $("#addRespMod").click(function(){
        var modName = $("#addModName").val();
        if(checkmodName()) {
            return false;
        }

        httpRespBodyModCount++;
        var tf = "mod" + httpRespBodyModCount;
        $("#responseArea").append(
            '<div class="col-sm-12" style=" margin-top: 15px;padding:0px" id="resbody' + tf + '">' +
            ' <div class="col-sm-2 page-padding"></div>' +
            '                             <div class="col-sm-8">' +
            '                                 <table class="table data-table" id="">' +
            '                                     <thead><tr><td colspan="4"><label id="labelHttpRespModName' + tf + '"></label>' +
            '                                <input id="HttpRespModName' + tf + '" type="text" style="display:none" class="form-control"  maxlength="32"/>' +
            '<a class="editModName" title="修改模块名称"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a></td>' +
            '<td><a class="checkedName" hidden style="color:#32cd32;font-size: 20px"><em class="fa fa-check"></em></a></td></tr></thead>' +
            '                                     <thead>' +
            '                                     <tr class="data-table-content-head">' +
            '                                         <th class="text-center" width="25%">参数</th>' +
            '                                         <th class="text-center" width="25%">类型</th>' +
            '                                         <th class="text-center" width="30%">描述</th>' +
            '                                         <th class="text-center" width="10%">必选</th>' +
            '                                         <th width="10%"></th>' +
            '                                     </tr>' +
            '                                     </thead>' +
            '                                     <tbody class="text-center a-admin" id="moreHttpRespParaWrapper' + tf + '"> <input value=1 type="hidden" id="httpRespParaCount' + tf + '" />' +
            '                                     <tr>' +
            '                                         <td><input type="text" class="form-control" id="' + tf + 'httpRespParaName1" maxlength="32"/> </td>' +
            '                                         <td><input type="text" class="form-control" id="' + tf + 'httpRespParaType1" maxlength="32"/></td>' +
            '                                         <td><input type="text" class="form-control" id="' + tf + 'httpRespParaDesc1" maxlength="64"/></td>' +
            '                                         <td><input type="checkbox"  id="' + tf + 'httpRespParaNeed1" /></td>' +
            '                                         <td><a href="#" class="removeHttpRespParaClass" style="font-size: 32px" name="' + tf + '">×</a></td>' +
            '                                     </tr>' +
            '                                     </tbody>' +
            '                                 </table>' +
            '                                 <div class="col-sm-4">' +
            '                                     <button id="addMoreHttpRespPara" type="button" class="btn btn-default btn-block addMoreHttpRespPara" value="' + tf + '">+添加行</button>' +
            '                                 </div>' +
            '                             </div>' +
            '                             <div class="col-sm-2">' +
            '                                 <button type="button" class="btn btn-default btn-block removeMoreHttpRespMod" value="' + tf + '">×去除模块</button>' +
            '                             </div>' +
            '</div>'
        );
        $("#labelHttpRespModName"+tf).text(modName);
        $("#HttpRespModName"+tf).val(modName);
    });

    $("body").on("click", ".removeMoreHttpRespMod", function (e) {
        httpReqBodyModCount--;
        var mod = e.currentTarget.value;
        $('#resbody' + mod).remove();
    })


    $("body").on("click", ".addMoreHttpRespPara", function (e) {
        var mod = e.currentTarget.value
        var modparaCount = $('#httpRespParaCount' + mod).val();
        if (modparaCount == "" || modparaCount == 0) modparaCount = 1
        modparaCount++
        $('#httpRespParaCount' + mod).val(modparaCount);
//        httpRespParaCount++;
//        httpRespParaId++;
        $("#moreHttpRespParaWrapper" + mod).append('<tr><td>' +
            '          <input id="' + mod + 'httpRespParaName' + modparaCount + '" type="text" class="form-control" maxlength="32"/>' +
            '          </td>' +
            '        <td>' +
            '          <input id="' + mod + 'httpRespParaType' + modparaCount + '" type="text" class="form-control" maxlength="32"/>' +
            '         </td>' +
            '        <td>' +
            '          <input id="' + mod + 'httpRespParaDesc' + modparaCount + '" type="text" class="form-control" maxlength="64"/>' +
            '         </td>' +
            '        <td>' +
            '          <input id="' + mod + 'httpRespParaNeed' + modparaCount + '" type="checkbox" />' +
            '         </td>' +
            '        <td>' +
            '          <a href="#" class="removeHttpRespParaClass" style="font-size: 32px" name="' + mod + '">×</a></td>' +
            '        </tr> ');
        return false;
    });
    $("body").on("click", ".removeHttpRespParaClass", function (e) {
        var mod = $(this)[0].name;
        var modparaCount = $('#httpRespParaCount' + mod).val();
        if (modparaCount > 1) {
            $(this).parent().parent().remove();
            modparaCount--;
            $('#httpRespParaCount' + mod).val(modparaCount);
        }

//        if (httpRespParaCount > 1) {
//            $(this).parent().parent().remove();
//            httpRespParaCount--;
//        }
        return false;
    });

    httpRespExamId = 1;
    $("#addMoreHttpRespExam").click(function (e) {
        httpRespExamCount++;
        httpRespExamId++;
        $("#moreHttpRespExamWrapper").append('<tr>' +
//        '          <td><input id="httpRespExamDesc'+ httpRespExamId +'" type="text" class="form-control"/>' +
//        '          </td>' +
            '        <td colspan="1">' +
            '          <textarea rows="4" id="httpRespExam' + httpRespExamId + '" type="text" maxlength="1024" class="form-control"/></textarea>' +
            '         </td>' +
            '        <td>' +
            '          <a href="#" class="removeHttpRespExamClass" style="font-size: 32px">×</a></td>' +
            '        </tr> ');

        return false;
    });
    $("body").on("click", ".removeHttpRespExamClass", function (e) {
        if (httpRespExamCount > 1) {
            $(this).parent().parent().remove();
            httpRespExamCount--;
        }
        return false;
    });

    $("#moreHttpHeaderWrapper").delegate("input[name = 'httpHeaderValue']", "focus", function () {
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
        $(this).blur(function () {
            checkHttpHeaderValues();
        });
    });

    $("#moreHttpErrCodeWrapper").delegate("input[name = 'httpErrCode']", "focus", function () {
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
        $(this).blur(function () {
            checkHttpErrCodes();
            //     $(this).addClass("errorC");
            //      $(this).siblings("small").show().html("*请输入http 返回码值");
        });
    });

    $("#moreHttpErrCodeWrapper").delegate("input[name = 'httpErrCodeDesc']", "focus", function () {
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
        $(this).blur(function () {
            checkHttpErrCodeDesces();
        });
    });

    function addUrlPathParam(){
        var apiurl = $("#apiUrl").val();
        var reg1 =new RegExp("\\[(.| )+?\\]","g");
        var reg2 =new RegExp("\\{(.| )+?\\}","g");
        //取出匹配正则表达式的内容
        urlPathF = apiurl.match(reg1);
        urlPathT = apiurl.match(reg2);
        if(urlPathF != null || urlPathT != null ){
            $("#moreHttpPathParaWrapper").empty();
            if( urlPathT != null){
                for (var i = 0; i < urlPathT.length; i++) {
                    var j = i + 1;
                    var urlPathTname = delBracket(urlPathT[i]);
                    var outString = '<tr><td>' +
                        '          <input id="httpPathParaName' + j + '" type="text" class="form-control" value="' + urlPathTname + '" readonly/>' +
                        '          </td>' +
                        '        <td colspan="2">' +
                        '          <input id="httpPathParaDesc' + j + '" type="text" class="form-control" maxlength="64"/>' +
                        '         </td>'+
                        '<td><input type="checkbox"  id="httpPathParaNeed' + j + '" name="httpPathParaNeed" checked disabled/></td></tr> ';

                    $("#moreHttpPathParaWrapper").append(outString);
                }
            }
            if(urlPathF != null){
                for (var i = 0; i < urlPathF.length; i++) {
                    if( urlPathT != null){
                        var j = i + 1 + urlPathT.length;}else{
                        var j = i + 1;
                    }
                    var urlPathFname = delBracket(urlPathF[i]);
                    var outString = '<tr><td>' +
                        '          <input id="httpPathParaName' + j + '" type="text" class="form-control" value="' + urlPathFname + '" readonly/>' +
                        '          </td>' +
                        '        <td colspan="2">' +
                        '          <input id="httpPathParaDesc' + j + '" type="text" class="form-control" maxlength="64"/>' +
                        '         </td>'+
                        '<td><input type="checkbox"  id="httpPathParaNeed' + j + '" name="httpPathParaNeed" disabled/></td></tr> ';

                    $("#moreHttpPathParaWrapper").append(outString);
                }
            }
            if (urlPathF == null) {
                httpPathParaCount = urlPathT.length;
            } else if (urlPathT == null) {
                httpPathParaCount = urlPathF.length;
            } else {
                httpPathParaCount = urlPathF.length + urlPathT.length;
            }
            $("#httpPathParam").show();
        } else{
            $("#httpPathParam").hide();
        }
    };

    function checkDataApiUrl() {
            var apiurl = $("#apiUrl").val();
            if (apiurl == "") {
                $("#apiUrl").addClass("errorC");
                $(".errorApiUrl").html("*请输入url");
                $(".errorApiUrl").css("display", "block");
                return true;
            } else if ( !UrlLegal(apiurl)) {
                $("#apiUrl").addClass("errorC");
                $(".errorApiUrl").html("*请输入正确格式的url,http(s)://域名(ip)(端口号)(路径)，端口号为1-65535的整数，不能带'?'号");
                $(".errorApiUrl").css("display", "block");
                return true;
            }
        return false;
    };

//httpheadervalue遍历验证
    function checkHttpHeaderValues() {
            //for (var i = 1; i <= httpHeaderParaCount; i++) {
            //    if ($("#httpHeaderValue" + i).val() == "") {
            //        $("#httpHeaderValue" + i).addClass("errorC");
            //        $(".errorHttpHeaderValue" + i).html("*请输入http header值");
            //        $(".errorHttpHeaderValue" + i).css("display", "block");
            //        return true;
            //    }
            //}
            return false;
    };

//httpErrCode遍历输入验证
    function checkHttpErrCodes() {
            //for (var i = 1; i <= httpErrCodeCount; i++) {
            //    if ($("#httpErrCode" + i).val() == "") {
            //        $("#httpErrCode" + i).addClass("errorC");
            //        $(".errorHttpErrCode" + i).html("*请输入http 返回码值");
            //        $(".errorHttpErrCode" + i).css("display", "block");
            //        preventDefaultFlag = true;
            //    } else if (!z.test($("#httpErrCode" + i).val())) {
            //        $("#httpErrCode" + i).addClass("errorC");
            //        $(".errorHttpErrCode" + i).html("*http 返回码必须为整数");
            //        $(".errorHttpErrCode" + i).css("display", "block");
            //        return true;
            //    }
            //}
        return false;
    };

//检查模块名称
    function checkmodName(){
        if ($("#addModName").val() == "") {
            $("#addModName").addClass("errorC");
            $(".erroraddModName").html("*请填写模块名称");
            $(".erroraddModName").css("display", "block");
            return true;
        } else {
            $("#addModName").removeClass("errorC");
            $(".erroraddModName").hide();
            return false;
        }
    }
    $("#addModName").focus(function(){
        $("#addModName").removeClass("errorC");
        $(".erroraddModName").hide();
    });

    /*打开api帮助说明*/
    $("#dataapihelp").click(function(){
        $("#dataapihelpModal").modal({backdrop: 'static', keyboard: false});
    });


//httpErrCodeDesc遍历输入验证
    function checkHttpErrCodeDesces() {
            //for (var i = 1; i <= httpErrCodeCount; i++) {
            //    if ($("#httpErrCodeDesc" + i).val() == "") {
            //        $("#httpErrCodeDesc" + i).addClass("errorC");
            //        $(".errorHttpErrCodeDesc" + i).html("*请输入http返回码描述");
            //        $(".errorHttpErrCodeDesc" + i).css("display", "block");
            //        return true;
            //    }
            //}
        return false;
    };


    function getDataApiData() {
        var resourceParamType;
        var httpHeaderArray = [];
        var flag1 = "null", flag2 = "null";
        $("#moreHttpHeaderWrapper tr").each(function(){
            var httpHeader = new Object();
            httpHeader.name = $.trim($(this).children("td").eq(0).find("input").val());
            httpHeader.value = $.trim($(this).children("td").eq(1).find("input").val());
            if ($(this).children(2).find(":checkbox").attr("checked")){
                httpHeader.need = 1;
            }else{
                httpHeader.need = 0;
            }
            if (flag1 == "null" || flag1 == "-1") {
                flag1 = httpHeader.value.toUpperCase().indexOf("JSON");
            }
            if (flag2 === "null" || flag2 == "-1") {
                flag2 = httpHeader.value.toUpperCase().indexOf("XML");
            }
            if (httpHeader.name != "" || httpHeader.value != "") {
                httpHeaderArray.push(httpHeader);
            }
        });
        if (flag1 != "-1" && flag2 != "-1") {
            //preventDefaultFlag = true;
            dmallError("http header 值不合法");
        }
        else {
            //preventDefaultFlag = false;
            if (flag1 != "-1") {
                resourceParamType = "JSON";
            } else if (flag2 != "-1") {
                resourceParamType = "XML";
            } else {
                resourceParamType = "OTHERS";
            }
        }

        var httpUrlParaArray = [];
        $("#moreHttpUrlParaWrapper tr").each(function(){
            var httpUrlPara = new Object();
            httpUrlPara.name = $.trim($(this).children("td").eq(0).find("input").val());
            httpUrlPara.description = $.trim($(this).children("td").eq(1).find("input").val());
            if ($(this).children(2).find(":checkbox").attr("checked")){
                httpUrlPara.need = 1;
            }else{
                httpUrlPara.need = 0;
            }
            if (httpUrlPara.name != "" || httpUrlPara.description != "") {
                httpUrlParaArray.push(httpUrlPara);
            }
        });

        var httpPathParaArray = [];
        $("#moreHttpPathParaWrapper tr").each(function(){
            var httpPathPara = new Object();
            httpPathPara.name = $.trim($(this).children("td").eq(0).find("input").val());
            httpPathPara.description = $.trim($(this).children("td").eq(1).find("input").val());
            if ($(this).children(2).find(":checkbox").attr("checked")){
                httpPathPara.need = 1;
            }else{
                httpPathPara.need = 0;
            }
            if (httpPathPara.name != "" || httpPathPara.description != "") {
                httpPathParaArray.push(httpPathPara);
            }
        });

        /*var httpErrCodeArray = [];
        for (var i = 1; i <= httpErrCodeCount; i++) {
            var httpErrCode = new Object();
            httpErrCode.code = parseInt($("#httpErrCode" + i + "").val()); // int
            if ($("#httpErrCodeNeed" + i + "").attr("checked"))
                httpErrCode.need = 1;
            else
                httpErrCode.need = 0;
            httpErrCode.description = $("#httpErrCodeDesc" + i + "").val();
            httpErrCodeArray.push(httpErrCode);
        }*/

        var httpReqBodyExamArray = [];
        $("#moreHttpReqBodyExamWrapper tr").each(function(){
            var httpReqBodyExam = new Object();
            httpReqBodyExam.example = $(this).children(0).find("textarea").val();
            if (httpReqBodyExam.example != "") {
                httpReqBodyExamArray.push(httpReqBodyExam);
            }
        });

        var httpReqBodyParaArray = [];
        var reqBodyTag = 1;
        $("#httpBodyArea table").each(function(){
            var mod = "mod" + reqBodyTag;
            var modparaCount = $('#httpReqBodyParaCount' + mod).val();
            var bodyMod = new Object();
            var paraAry = new Array();
            if (reqBodyTag == 1) {
                $(this).children("tbody").children("tr").each(function(){
                    var httpReqBodyParaOb = new Object();
                    httpReqBodyParaOb.name = $.trim($(this).children("td").eq(0).find("input").val());
                    httpReqBodyParaOb.type = $.trim($(this).children("td").eq(1).find("input").val());
                    httpReqBodyParaOb.description = $(this).children("td").eq(2).find("input").val();
                    if ($(this).children(3).find(":checkbox").attr("checked"))
                        httpReqBodyParaOb.need = 1;
                    else httpReqBodyParaOb.need = 0;
                    if (httpReqBodyParaOb.name != "" || httpReqBodyParaOb.type != "" || httpReqBodyParaOb.description != "") {
                        paraAry.push(httpReqBodyParaOb);
                    }
                });
                if (paraAry.length > 0) {
                    bodyMod.httpReqBodyPara = paraAry;
                }
            } else {
                var HttpReqBodyModName = $(this).find("label").text();
                bodyMod.HttpReqBodyModName = HttpReqBodyModName;
                $(this).children("tbody").children("tr").each(function(){
                    var httpReqBodyParaOb = new Object();
                    httpReqBodyParaOb.name = $.trim($(this).children("td").eq(0).find("input").val());
                    httpReqBodyParaOb.type = $.trim($(this).children("td").eq(1).find("input").val());
                    httpReqBodyParaOb.description = $(this).children("td").eq(2).find("input").val();
                    if ($(this).children(3).find(":checkbox").attr("checked"))
                        httpReqBodyParaOb.need = 1;
                    else httpReqBodyParaOb.need = 0;
                    if (httpReqBodyParaOb.name != "" || httpReqBodyParaOb.type != "" || httpReqBodyParaOb.description != "") {
                        paraAry.push(httpReqBodyParaOb);
                    }
                });
                if (paraAry.length > 0) {
                    bodyMod.httpReqBodyPara = paraAry;
                }
                if (paraAry.length > 0)
                    bodyMod.httpReqBodyPara = paraAry;
                if (bodyMod.httpReqBodyPara && !HttpReqBodyModName) return dmallError('模块名不能为空')
            }
            if (bodyMod.HttpReqBodyModName || bodyMod.httpReqBodyPara) {
                httpReqBodyParaArray.push(bodyMod);
            }
            reqBodyTag++;
        });

        var httpRespParaArray = [];
        var respBodyTag = 1;
        $("#responseArea table").each(function(){
            var mod = "mod" + respBodyTag;
            var modparaCount = $('#httpRespParaCount' + mod).val();
            var bodyMod = new Object();
            var paraAry = new Array();
            if (respBodyTag == 1) {
                $(this).children("tbody").children("tr").each(function(){
                    var httpRespParaOb = new Object();
                    httpRespParaOb.name = $.trim($(this).children("td").eq(0).find("input").val());
                    httpRespParaOb.type = $.trim($(this).children("td").eq(1).find("input").val());
                    httpRespParaOb.description = $(this).children("td").eq(2).find("input").val();
                    if ($(this).children(3).find(":checkbox").attr("checked"))
                        httpRespParaOb.need = 1;
                    else httpRespParaOb.need = 0;
                    if (httpRespParaOb.name != "" || httpRespParaOb.type != "" || httpRespParaOb.description != "") {
                        paraAry.push(httpRespParaOb);
                    }
                });
                if (paraAry.length > 0) {
                    bodyMod.httpRespPara = paraAry;
                }
            } else {
                var HttpRespModName = $(this).find("label").text();
                bodyMod.HttpRespModName = HttpRespModName;
                $(this).children("tbody").children("tr").each(function(){
                    var httpRespParaOb = new Object();
                    httpRespParaOb.name = $.trim($(this).children("td").eq(0).find("input").val());
                    httpRespParaOb.type = $.trim($(this).children("td").eq(1).find("input").val());
                    httpRespParaOb.description = $(this).children("td").eq(2).find("input").val();
                    if ($(this).children(3).find(":checkbox").attr("checked"))
                        httpRespParaOb.need = 1;
                    else httpRespParaOb.need = 0;
                    if (httpRespParaOb.name != "" || httpRespParaOb.type != "" || httpRespParaOb.description != "") {
                        paraAry.push(httpRespParaOb);
                    }
                });
                if (paraAry.length > 0)
                    bodyMod.httpRespPara = paraAry;
                if (bodyMod.httpRespPara && !HttpRespModName) return dmallError('模块名不能为空')
            }
            if (bodyMod.HttpRespModName || bodyMod.httpRespPara) {
                httpRespParaArray.push(bodyMod);
            }
            respBodyTag++;
        });

        var httpRespExamArray = [];
        $("#moreHttpRespExamWrapper tr").each(function(){
            var httpRespExam = new Object();
            httpRespExam.example = $(this).children(0).find("textarea").val();
            if (httpRespExam.example != "") {
                httpRespExamArray.push(httpRespExam);
            }
        });

        var httpPara = {};
        if (httpHeaderArray.length > 0) {
            httpPara.http_header = httpHeaderArray;
        }

        if (httpUrlParaArray.length > 0) {
            httpPara.url_parameter = httpUrlParaArray;
        }
        if (httpPathParaArray.length > 0) {
            httpPara.path_parameter = httpPathParaArray;
        }
        /*if (httpErrCodeArray.length > 0) {
            httpPara.error_code = httpErrCodeArray;
        }*/
        if (httpReqBodyParaArray.length > 0 || httpReqBodyExamArray.length > 0) {
            httpPara.request_body = {};
            if(httpReqBodyParaArray.length > 0){
                httpPara.request_body.parameters = httpReqBodyParaArray;
            }
            if (httpReqBodyExamArray.length > 0) {
                httpPara.request_body.examples = httpReqBodyExamArray;
            }
        }
        if (httpRespParaArray.length > 0 || httpRespExamArray.length > 0) {
            httpPara.http_response = {};
            if (httpRespParaArray.length > 0) {
                httpPara.http_response.parameters = httpRespParaArray;
            }
            if (httpRespExamArray.length > 0) {
                httpPara.http_response.examples = httpRespExamArray;
            }
        }
        var apiJsonString = JSON.stringify(httpPara);
        var apiParams = {
            resourceParamType: resourceParamType,
            url: $("#apiUrl").val(),
            dbColumn: apiJsonString,
            httpMethod: $("#httpMethodList option:selected").val(),
            dopGatewayId: $("#gateWay option:selected").val()
        }
        return apiParams;
    };

    function renderDataApi(catalog) {
        $("#apiUrl").val(catalog.url);
        $("#httpMethodList").val(catalog.httpMethod);

        var dbColumnString = eval("(" + catalog.dbColumn + ")");

        if (dbColumnString.http_header) {
            var http_header = dbColumnString.http_header;
            httpHeaderParaCount = http_header.length;
            httpHeaderParaId = http_header.length;
            //http header
            $("#moreHttpHeaderWrapper").empty();
            for (var i = 0; i < http_header.length; i++) {
                var j = i + 1;
                var outString = '<tr><td>' +
                    '          <input id="httpHeaderName' + j + '" type="text" maxlength="32" name="httpHeaderName" class="form-control"/>' +
                    '        <td colspan="2">' +
                    '          <input id="httpHeaderValue' + j + '" type="text" maxlength="32" name="httpHeaderValue" class="form-control"/>' +
                    '          <small class="errorHttpHeaderValue' + j + ' text-danger"></small></td>' +
                    '        <td>';
                if (http_header[i].need == 1)
                    outString = outString + '         <input type="checkbox"  id="httpHeaderNeed' + j + '" name="httpHeaderNeed" checked ="checked"/></td> ';
                else
                    outString = outString + '         <input type="checkbox"  id="httpHeaderNeed' + j + '" name="httpHeaderNeed" /></td> ';

                outString = outString + '          <td><a href="#" class="removeHttpHeaderClass" style="font-size: 32px">×</a></td>' +
                    '        </tr> ';

                $("#moreHttpHeaderWrapper").append(outString);
                $("#httpHeaderName"+j).val(http_header[i].name);
                $("#httpHeaderValue"+j).val(http_header[i].value);
            }
        }
        //http url参数
        if (dbColumnString.url_parameter) {
            var url_parameter = dbColumnString.url_parameter;
            httpUrlParaCount = url_parameter.length;
            httpUrlParaId = url_parameter.length;

            if (url_parameter.length != 0) {
                $("#moreHttpUrlParaWrapper").empty();
                for (var i = 0; i < url_parameter.length; i++) {
                    var j = i + 1;
                    var outString = '<tr><td>' +
                        '          <input id="httpUrlParaName' + j + '" type="text" maxlength="32" class="form-control"/>' +
                        '          </td>' +
                        '        <td colspan="2">' +
                        '          <input id="httpUrlParaDesc' + j + '" type="text" maxlength="64" class="form-control"/>' +
                        '         </td>';
                    if (url_parameter[i].need == 1)
                        outString = outString + '<td><input type="checkbox"  id="httpUrlParaNeed' + j + '" name="httpUrlParaNeed" checked="checked"/></td>'
                    else
                        outString = outString + '<td><input type="checkbox"  id="httpUrlParaNeed' + j + '" name="httpUrlParaNeed"/></td>'

                    outString = outString + '          <td><a href="#" class="removeHttpUrlParaClass" style="font-size: 32px">×</a></td>' +
                        '        </tr> '

                    $("#moreHttpUrlParaWrapper").append(outString);
                    $("#httpUrlParaName"+j).val(url_parameter[i].name);
                    $("#httpUrlParaDesc"+j).val(url_parameter[i].description);

                }
            }
        }
        //http路径参数
        if (dbColumnString.path_parameter) {
            var path_parameter = dbColumnString.path_parameter;
                                httpPathParaCount = path_parameter.length;
                                httpPathParaId = path_parameter.length;
            if (path_parameter.length != 0) {
                $("#moreHttpPathParaWrapper").empty();
                for (var i = 0; i < path_parameter.length; i++) {
                    var j = i + 1;
                    var outString = '<tr><td>' +
                        '          <input id="httpPathParaName' + j + '" type="text" maxlength="32" class="form-control" readonly/>' +
                        '          </td>' +
                        '        <td colspan="2">' +
                        '          <input id="httpPathParaDesc' + j + '" type="text" maxlength="64" class="form-control"/>' +
                        '         </td>';
                    if (path_parameter[i].need == 1)
                        outString = outString + '<td><input type="checkbox"  id="httpPathParaNeed' + j + '" name="httpPathParaNeed" checked disabled/></td>'
                    else
                        outString = outString + '<td><input type="checkbox"  id="httpPathParaNeed' + j + '" name="httpPathParaNeed" disabled/></td>'

                    outString = outString + '        <td>' +
                        '          </td>' +
                        '        </tr> '

                    $("#moreHttpPathParaWrapper").append(outString);
                    $("#httpPathParaName"+j).val(path_parameter[i].name);
                    $("#httpPathParaDesc"+j).val(path_parameter[i].description);
                    $("#httpPathParam").show();
                }
            }
        }
        //http返回码
        //var error_code = dbColumnString.error_code;
        //if (error_code.length != 0) {
        //    $("#moreHttpErrCodeWrapper").empty();
        //    for (var i = 0; i < error_code.length; i++) {
        //        var j = i + 1;
        //        var outString = '<tr><td>' +
        //            '          <input id="httpErrCode' + j + '" type="text" name="httpErrCode" class="form-control" value="' + error_code[i].code + '"/>' +
        //            '          <small class="errorHttpErrCode' + j + ' text-danger"></small></td>' +
        //            '        <td colspan="2">' +
        //            '          <input id="httpErrCodeDesc' + j + '" name="httpErrCodeDesc" type="text" class="form-control" value="' + error_code[i].description + '"/>' +
        //            '          <small class="errorHttpErrCodeDesc' + j + ' text-danger"></small></td>';
        //        if (error_code[i].need == 1)
        //            outString = outString + '<td><input type="checkbox"  id="httpErrCodeNeed' + j + '" name="httpErrCodeNeed" checked="checked"/></td>'
        //        else outString = outString + '<td><input type="checkbox"  id="httpErrCodeNeed' + j + '" name="httpErrCodeNeed" /></td>'
        //
        //        outString = outString + '        <td>' +
        //            '          <a href="#" class="removeHttpErrCodeClass" style="font-size: 32px">×</a></td>' +
        //            '        </tr> ';
        //
        //        $("#moreHttpErrCodeWrapper").append(outString);
        //    }
        //}
        //http body参数
        if (dbColumnString.request_body) {
            if(dbColumnString.request_body.parameters){
                var request_bodyp = dbColumnString.request_body.parameters;
                httpReqBodyModCount = request_bodyp.length;

                if (request_bodyp.length != 0) {
                    $("#httpBodyArea").empty();
                    for (var i = 0; i < request_bodyp.length; i++) {
                        var ii = i + 1;
                        var outString = '<div class="col-sm-12" style=" margin-top: 15px;padding:0px" id="bodymod' + ii + '">';
                        if (request_bodyp[i].HttpReqBodyModName) {
                            outString = outString + '<label class="col-sm-2 page-padding"></label>'
                        }
                        else {
                            outString = outString + '<label class="col-sm-2 control-label">HTTP Body：</label>'
                        }

                        outString = outString + '  <div class="col-sm-8"><table class="table data-table" id="">';

                        if (request_bodyp[i].HttpReqBodyModName)
                            outString = outString +
                                '                                     <thead><tr><td colspan="4"><label id="labelHttpReqBodyModNamemod' + ii + '"></label>' +
                                '<input id="HttpReqBodyModNamemod' + ii + '" name="bodyModName" type="text" class="form-control" style="display:none" maxlength="32" />' +
                                '<a class="editModName" title="修改模块名称"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a></td>' +
                                '                                     <td><a class="checkedName" hidden style="color:#32cd32;font-size: 20px"><em class="fa fa-check"></em></a></td></tr></thead>'
                            ;
                        outString = outString +
                            '                                        <thead>' +
                            '                                        <tr class="data-table-content-head">' +
                            '                                            <th class="text-center" width="25%">参数</th>' +
                            '                                            <th class="text-center" width="25%">类型</th>' +
                            '                                            <th class="text-center" width="30%">描述</th>' +
                            '                                            <th class="text-center" width="10%">必选</th>' +
                            '                                            <th width="10%"></th>' +
                            '                                        </tr>' +
                            '                                        </thead>' +
                            '                                        <tbody class="text-center a-admin" id="moreHttpReqBodyParaWrappermod' + ii + '">' +
                            '                                        <input type="hidden" value="1" id="httpReqBodyParaCountmod' + ii + '" />' +
                            '                                        </tbody>' +
                            '                                    </table>' +
                            '                                    <div class="col-sm-4">' +
                            '                                        <button id="addMoreHttpReqBodyPara" type="button" class="btn btn-default btn-block addMoreHttpReqBodyPara" value="mod' + ii + '">+添加行</button>' +
                            '                                    </div>' +
                            '                                </div>';
                        if (request_bodyp[i].HttpReqBodyModName) {
                            outString = outString + ' <div class="col-sm-2">' +
                                '<button type="button" class="btn btn-default btn-block removeMoreHttpReqBodyMod" value="mod'+ii+'">×去除模块</button>' +
                                '</div></div>'
                        }
                        else {
                            outString = outString + '<div class="col-sm-2">' +
                                '<button id="addMoreHttpReqBodyMod" type="button" class="btn btn-default btn-block addMoreHttpReqBodyMod">+添加模块</button>' +
                                '</div></div>'
                        }
                        var paras = request_bodyp[i].httpReqBodyPara;
                        httpReqBodyParaCount = paras.length;
                        httpReqBodyParaId = paras.length;
                        $("#httpBodyArea").append(outString);
                        $("#labelHttpReqBodyModNamemod"+ii).text(request_bodyp[i].HttpReqBodyModName);
                        $("#HttpReqBodyModNamemod"+ii).val(request_bodyp[i].HttpReqBodyModName);


                        $("#moreHttpReqBodyParaWrappermod" + ii).empty();
                        if (paras) {
                            $("#moreHttpReqBodyParaWrappermod" + ii).append('<input type="hidden" value="' + paras.length + '" id="httpReqBodyParaCountmod' + ii + '" />')
                            for (var j = 0; j < paras.length; j++) {
                                var jj = j + 1;
                                var outString = '<tr><td>' +
                                    '          <input id="mod' + ii + 'httpReqBodyParaName' + jj + '" type="text" maxlength="32" class="form-control"/>' +
                                    '          </td>' +
                                    '        <td>' +
                                    '          <input id="mod' + ii + 'httpReqBodyParaType' + jj + '" type="text" maxlength="32" class="form-control"/>' +
                                    '         </td>' +
                                    '        <td>' +
                                    '          <input id="mod' + ii + 'httpReqBodyParaDesc' + jj + '" type="text" maxlength="64" class="form-control"/>' +
                                    '         </td>';
                                if (paras[j].need == 1)
                                    outString = outString + '<td>' +
                                        '          <input id="mod' + ii + 'httpReqBodyParaNeed' + jj + '" type="checkbox"  checked="checked"/>' +
                                        '         </td>'
                                else outString = outString + '<td>' +
                                    '          <input id="mod' + ii + 'httpReqBodyParaNeed' + jj + '" type="checkbox"  />' +
                                    '         </td>'

                                outString = outString + '        <td>' +
                                    '          <a href="#" class="removeHttpReqBodyClass" style="font-size: 32px" name="mod' + ii + '">×</a></td>' +
                                    '        </tr> '
                                $("#moreHttpReqBodyParaWrappermod" + ii).append(outString);
                                $("#mod" + ii + "httpReqBodyParaName" + jj +"").val(paras[j].name);
                                $("#mod" + ii + "httpReqBodyParaType" + jj +"").val(paras[j].type);
                                $("#mod" + ii + "httpReqBodyParaDesc" + jj +"").val(paras[j].description);
                            }
                        } else {
                            $("#moreHttpReqBodyParaWrappermod" + ii).append('<input type="hidden" value="' + 1 + '" id="httpReqBodyParaCountmod' + ii + '" />')
                            $("#moreHttpReqBodyParaWrappermod" + ii).append(
                                '<tr><td>' +
                                '          <input id="mod' + ii + 'httpReqBodyParaName' + 1 + '" type="text" maxlength="32" class="form-control" value=""/>' +
                                '          </td>' +
                                '        <td>' +
                                '          <input id="mod' + ii + 'httpReqBodyParaType' + 1 + '" type="text" maxlength="32" class="form-control" value=""/>' +
                                '         </td>' +
                                '        <td>' +
                                '          <input id="mod' + ii + 'httpReqBodyParaDesc' + 1 + '" type="text" maxlength="64" class="form-control" value=""/>' +
                                '         </td>' +
                                '        <td>' +
                                '          <input id="mod' + ii + 'httpReqBodyParaNeed' + 1 + '" type="checkbox"  value=""/>' +
                                '         </td>' +
                                '        <td>' +
                                '          <a href="#" class="removeHttpReqBodyClass" style="font-size: 32px" name="mod' + ii + '">×</a></td>' +
                                '        </tr> ');
                        }
                    }
                }
            }
        }

        //http body举例
        if (dbColumnString.request_body) {
            if(dbColumnString.request_body.examples){
                var request_bodye = dbColumnString.request_body.examples;
                httpReqBodyExamCount = request_bodye.length;
                httpReqBodyExamId = request_bodye.length;

                if (request_bodye.length != 0) {
                    $("#moreHttpReqBodyExamWrapper").empty();
                    for (var i = 0; i < request_bodye.length; i++) {
                        var j = i + 1;
                        $("#moreHttpReqBodyExamWrapper").append('<tr>' +
//                                        '          <td><input id="httpReqBodyExamDesc'+ j +'" type="text" class="form-control" value="'+request_bodye[i].description+'"/>' +
//                                        '          </td>' +
                            '        <td colspan="1">' +
                            '          <textarea rows="4" id="httpReqBodyExam' + j + '" type="text" maxlength="1024" class="form-control"></textarea>' +
                            '         </td>' +
                            '        <td>' +
                            '          <a href="#" class="removeHttpReqBodyExamClass" style="font-size: 32px">×</a></td>' +
                            '        </tr> ');
                        $("#httpReqBodyExam"+j).val(request_bodye[i].example);
                    }
                }
            }
        }
        //http response参数
        if (dbColumnString.http_response) {
            if (dbColumnString.http_response.parameters) {
                var http_responsep = dbColumnString.http_response.parameters;
                httpRespBodyModCount = http_responsep.length;
                if (http_responsep.length != 0) {
                    $("#responseArea").empty();
                    for (var i = 0; i < http_responsep.length; i++) {
                        var ii = i + 1;
                        var outString = '<div class="col-sm-12" style=" margin-top: 15px;padding:0px" id="resbodymod' + ii + '">';
                        if (http_responsep[i].HttpRespModName)
                            outString = outString + '<label class="col-sm-2 page-padding"></label>';
                        else outString = outString + '<label class="col-sm-2 control-label">HTTP Response：</label>';
                        outString = outString + '  <div class="col-sm-8"><table class="table data-table" id="">';

                        if (http_responsep[i].HttpRespModName)
                            outString = outString +
                                '                                     <thead><tr><td colspan="4"><label id="labelHttpRespModNamemod' + ii + '"></label>' +
                                '                                <input id="HttpRespModNamemod' + ii + '" type="text" style="display:none" class="form-control" maxlength="32" />' +
                                '<a class="editModName" title="修改模块名称"><em class="fa fa-edit" style="color:#1E90FF;font-size: 20px"></em></a></td>' +
                                '<td><a class="checkedName" hidden style="color:#32cd32;font-size: 20px"><em class="fa fa-check"></em></a></td></tr></thead>';

                        outString = outString +
                            '                                        <thead>' +
                            '                                        <tr class="data-table-content-head">' +
                            '                                            <th class="text-center" width="25%">参数</th>' +
                            '                                            <th class="text-center" width="25%">类型</th>' +
                            '                                            <th class="text-center" width="30%">描述</th>' +
                            '                                            <th class="text-center" width="10%">必选</th>' +
                            '                                            <th width="10%"></th>' +
                            '                                        </tr>' +
                            '                                        </thead>' +
                            '                                        <tbody class="text-center a-admin" id="moreHttpRespParaWrappermod' + ii + '">' +
                            '                                        <input type="hidden" value="1" id="httpRespParaCountmod' + ii + '" />' +
                            '                                        </tbody>' +
                            '                                    </table>' +
                            '                                    <div class="col-sm-4">' +
                            '                                        <button id="addMoreHttpRespPara" type="button" class="btn btn-default btn-block addMoreHttpRespPara" value="mod' + ii + '">+添加行</button>' +
                            '                                    </div>' +
                            '                                </div>';
                        if (http_responsep[i].HttpRespModName)
                            outString = outString + ' <div class="col-sm-2">' +
                                '<button type="button" class="btn btn-default btn-block removeMoreHttpRespMod" value="mod'+ii+'">×去除模块</button>' +
                                '</div></div>';
                        else outString = outString + '<div class="col-sm-2">' +
                            '<button id="addMoreHttpRespMod" type="button" class="btn btn-default btn-block addMoreHttpRespMod">+添加模块</button>' +
                            '</div></div>'


                        var paras = http_responsep[i].httpRespPara;
                        httpRespParaCount = paras.length;
                        httpRespParaId = paras.length;
                        $("#responseArea").append(outString);
                        $("#HttpRespModNamemod"+ii).val(http_responsep[i].HttpRespModName);
                        $("#labelHttpRespModNamemod"+ii).text(http_responsep[i].HttpRespModName);

                        $("#moreHttpRespParaWrappermod" + ii).empty();
                        if (paras) {
                            $("#moreHttpRespParaWrappermod" + ii).append('<input type="hidden" value="' + paras.length + '" id="httpRespParaCountmod' + ii + '" />')
                            for (var j = 0; j < paras.length; j++) {
                                var jj = j + 1;
                                var outString = '<tr><td>' +
                                    '          <input id="mod' + ii + 'httpRespParaName' + jj + '" type="text" maxlength="32" class="form-control"/>' +
                                    '          </td>' +
                                    '        <td>' +
                                    '          <input id="mod' + ii + 'httpRespParaType' + jj + '" type="text" maxlength="32" class="form-control"/>' +
                                    '         </td>' +
                                    '        <td>' +
                                    '          <input id="mod' + ii + 'httpRespParaDesc' + jj + '" type="text" maxlength="64" class="form-control"/>' +
                                    '         </td>';
                                if (paras[j].need == 1)
                                    outString = outString + '<td>' +
                                        '          <input id="mod' + ii + 'httpRespParaNeed' + jj + '" type="checkbox"  checked="checked"/>' +
                                        '         </td>';
                                else
                                    outString = outString + '<td>' +
                                        '          <input id="mod' + ii + 'httpRespParaNeed' + jj + '" type="checkbox"/>' +
                                        '         </td>';

                                outString = outString + '        <td>' +

                                    '          <a href="#" class="removeHttpRespParaClass" style="font-size: 32px" name="mod' + ii + '">×</a></td>' +
                                    '        </tr> '

                                $("#moreHttpRespParaWrappermod" + ii).append(outString);
                                $("#mod" + ii + "httpRespParaName" + jj +"").val(paras[j].name);
                                $("#mod" + ii + "httpRespParaType" + jj +"").val(paras[j].type);
                                $("#mod" + ii + "httpRespParaDesc" + jj +"").val(paras[j].description);
                            }
                        } else {
                            $("#moreHttpRespParaWrappermod" + ii).append('<input type="hidden" value="' + 1 + '" id="httpRespParaCountmod' + ii + '" />')
                            $("#moreHttpRespParaWrappermod" + ii).append(
                                '<tr><td>' +
                                '          <input id="mod' + ii + 'httpRespParaName' + 1 + '" type="text" maxlength="32" class="form-control" value=""/>' +
                                '          </td>' +
                                '        <td>' +
                                '          <input id="mod' + ii + 'httpRespParaType' + 1 + '" type="text" maxlength="32" class="form-control" value=""/>' +
                                '         </td>' +
                                '        <td>' +
                                '          <input id="mod' + ii + 'httpRespParaDesc' + 1 + '" type="text" maxlength="64" class="form-control" value=""/>' +
                                '         </td>' +
                                '        <td>' +
                                '          <input id="mod' + ii + 'httpRespParaNeed' + 1 + '" type="checkbox"  value=""/>' +
                                '         </td>' +
                                '        <td>' +
                                '          <a href="#" class="removeHttpRespParaClass" style="font-size: 32px" name="mod' + ii + '">×</a></td>' +
                                '        </tr> ');
                        }
                    }
                }
            }
        }
        //http response举例
        if (dbColumnString.http_response) {
            if(dbColumnString.http_response.examples){
                var http_responsee = dbColumnString.http_response.examples;
                httpRespExamCount = http_responsee.length;
                httpRespExamId = http_responsee.length;

                if (http_responsee.length != 0) {
                    $("#moreHttpRespExamWrapper").empty();
                    for (var i = 0; i < http_responsee.length; i++) {
                        var j = i + 1;
                        $("#moreHttpRespExamWrapper").append('<tr>' +
//                                        '          <td><input id="httpRespExamDesc'+ j +'" type="text" class="form-control" value="'+http_responsee[i].description+'"/>' +
//                                        '          </td>' +
                            '        <td colspan="1">' +
                            '          <textarea rows="4" id="httpRespExam' + j + '" type="text" maxlength="1024" class="form-control"></textarea>' +
                            '         </td>' +
                            '        <td>' +
                            '          <a href="#" class="removeHttpRespExamClass" style="font-size: 32px">×</a></td>' +
                            '        </tr> ');
                        $("#httpRespExam"+j).val(http_responsee[i].example);
                    }
                }
            }
        }
    };

    function initDataApi() {
        if ($("#httpHeaderParaCount").val() != undefined) {
            httpHeaderParaCount = $("#httpHeaderParaCount").val();
            httpHeaderParaId = $("#httpHeaderParaCount").val();
        }
        if ($("#httpUrlParaCount").val() != undefined) {
            httpUrlParaCount = $("#httpUrlParaCount").val();
            httpUrlParaId = $("#httpUrlParaCount").val();
        }
        if ($("#httpPathParaCount").val() != undefined) {
            httpPathParaCount = $("#httpPathParaCount").val();
            httpPathParaId = $("#httpPathParaCount").val();
        }
        if ($("#httpErrCodeCount").val() != undefined) {
            httpErrCodeCount = $("#httpErrCodeCount").val();
            httpErrCodeId = $("#httpErrCodeCount").val();
        }
        if ($("#httpReqBodyParaCount").val() != undefined) {
            httpReqBodyParaCount = $("#httpReqBodyParaCount").val();
            httpReqBodyParaId = $("#httpReqBodyParaCount").val();
        }
        if ($("#httpReqBodyExamCount").val() != undefined) {
            httpReqBodyExamCount = $("#httpReqBodyExamCount").val();
            httpReqBodyExamId = $("#httpReqBodyExamCount").val();
        }
        if ($("#httpRespParaCount").val() != undefined) {
            httpRespParaCount = $("#httpRespParaCount").val();
            httpRespParaId = $("#httpRespParaCount").val();
        }
        if ($("#httpRespExamCount").val() != undefined) {
            httpRespExamCount = $("#httpRespExamCount").val();
            httpRespExamId = $("#httpRespExamCount").val();
        }
        if ($("#httpReqBodyModCount").val() != undefined) {
            httpReqBodyModCount = $("#httpReqBodyModCount").val();
        }

        if ($("#httpRespBodyModCount").val() != undefined) {
            httpRespBodyModCount = $("#httpRespBodyModCount").val();
        }
    };
    //获取API网关
    function getGateWay(){
        var tag;
        $.ajax({
            type: 'GET',
            data: {},
            async: false,
            url: rootPath + "/share/getDopServer",
            success: function (data) {
                if (data.result == "success") {
                    if(!data.isConfig){
                        dmallError("请先配置API网关");
                        tag =  false;
                    }else{
                        $("#gateWay").empty();
                        for (var i = 0; i < data.dopServers.length; i++) {
                            var id = data.dopServers[i].id;
                            var name = data.dopServers[i].name;
                            var newOption = new Option(name, id);
                            $("#gateWay").append(newOption);
                        }
                        if($("#dopGatewayId").val() != ""){
                            $("#gateWay").val($("#dopGatewayId").val());
                        }
                        tag =  true;
                    }
                }
            },
            error: function (data) {
                dmallAjaxError();
                tag =  false;
            }
        });
        return tag;
    }
    function emptyDataApi() {
     //   $("#apiUrl").val("");
        if(!getGateWay()){
            return false;
        } else{
            return true;
        }
    };
    function delBracket(str){
        var strNew = str.substring(1,str.length-1);
        return strNew;
    }
};

