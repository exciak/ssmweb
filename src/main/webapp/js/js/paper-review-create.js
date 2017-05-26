
$(document).ready(function(){
    var $selectedId = $("#selectedId");
    var outsideTag = 1;
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var proName = arr[1];
    /*var count = 15;
    var countdown = setInterval(CountDown, 1000);
    function CountDown() {
        $("#commitBtn").attr("disabled", true);
        $("#commitBtn").text(count);
        if (count == 0) {
            $("#commitBtn").text("确定").removeAttr("disabled");
            clearInterval(countdown);
        }
        count--;
    }*/
    $("#promiseModal").modal({backdrop: 'static', keyboard: false});
    $("input[name='deadline']").change(function(){
        var deadline = $("input[name='deadline']").filter(":checked").val();
        if(deadline == "other"){
            $("#deadlinePara").show();
        }else{
            $("#deadlinePara").hide();
        }
    });

    $("#addReviewList").click(function(){
        emptyModal("addReviewListModal");
        $("#catalogListWrap").hide();
        $("#addReviewListModal").modal({backdrop: 'static', keyboard: false});
    });

    //获取资源清单
    function resourceList(page) {
        var myString = $selectedId.val();
        $.get("/" +proName + "/mydata/paper/getExchangeList",
            {
                searchName: myString,
                pageNumber:page
            },
            function (data, status) {
                if ((status == "success") && (data.result == "success")) {
                    $("#catalogList").empty();
                    if (data.paperReviewDetailModels.length == 0) {
                        $selectedId.addClass("errorC");
                        $(".errorSelectedId").html("*请输入资源关键字");
                        $(".errorSelectedId").css("display", "block");
                        $("#catalogListWrap").hide();
                    } else {
                        for (var i = 0; i < data.paperReviewDetailModels.length; i++) {
                            var columns = data.paperReviewDetailModels[i];
                            if(columns.dbTable == undefined){
                                var trHTML = '<li class="longText" style="height: 20px" id=' + columns.exchangeId + ' title=' + columns.resId + ',' + columns.resTitle + '>' +
                                    '<a href="javascript:void(0)">' + columns.exchangeNo +'</a></li>';
                            }else{
                                var trHTML = '<li class="longText" style="height: 20px" id=' + columns.exchangeId + ' title=' + columns.resId + ',' + columns.resTitle+ ',' + columns.dbTable + '>' +
                                    '<a href="javascript:void(0)">' + columns.exchangeNo +'</a></li>';
                            }
                            $("#catalogList").append(trHTML);
                        }
                        $("#currentPage2").html(data.pageNumber);
                        $("#totalPage2").html(data.totalPages);
                        $("#catalogListWrap").show();
                        if(data.totalPages == 1){
                            $("#pageDiv").hide();
                        } else{
                            $("#pageDiv").show();
                        }
                    }
                } else {
                    dmallError("请求异常");
                }
            },
            "json"
        );
    }
    $selectedId.keyup(function(){
        resourceList(1);
    });
    $selectedId.focus(function () {
        $selectedId.removeClass("errorC");
        $(".errorSelectedId").hide();
        resourceList(1);
        outsideTag = 1;
    });
    //
    $("#previouspage2").click(function () {
            if (parseInt($("#currentPage2").html()) > 1) {
                resourceList(parseInt($("#currentPage2").html()) - 1);
            }
            outsideTag = 1;
    });

    $("#nextpage2").click(function () {
            if (parseInt($("#currentPage2").html()) < parseInt($("#totalPage2").html())) {
                resourceList(parseInt($("#currentPage2").html()) + 1);
            }
            outsideTag = 1;
    });

    $("#catalogList").delegate("li", "click", function () {
        var exchangeNo = $(this).text();

        var tagFlag = false;
        $("div [name=exchangeNoDiv]").each(function () {
            if ($(this).text() == exchangeNo) {
                dmallError("该交换记录已经被选择");
                tagFlag = true;
                return false;
            }
        });

        if (tagFlag) {
            return false;
        }

        $selectedId.val(exchangeNo);
        var resDetail = this.title;
        var resArr = resDetail.split(",");
        $("#resId").val(resArr[0]);
        $("#resTitle").val(resArr[1]);
        $("#exchangeId").val(this.id);
        $("#exchangeNo").val(exchangeNo);
        if(resArr.length > 2){
            $("#tableName").val(resArr[2]);
        }
        $("#catalogListWrap").hide();
    });
    //添加资源清单
    $("#addListDetail").click(function(){
        var resId = $("#resId").val();
        var resTitle = $("#resTitle").val();
        var exchangeId = $("#exchangeId").val();
        var exchangeNo = $("#exchangeNo").val();
        var tableName = $("#tableName").val();
        if(tableName == undefined){
            tableName = "";
        }

        if("" == exchangeNo || undefined == exchangeNo) {
            dmallError("请选择交换记录");
            return false;
        }

        var tagFlag = false;
        $("div [name=exchangeNoDiv]").each(function () {
            if ($(this).text() == exchangeNo) {
                dmallError("该交换记录已经被选择");
                tagFlag = true;
                return false;
            }
        });

        if (tagFlag) {
            return false;
        }

        $("#reviewListTable").append('<tr><td><div name="exchangeNoDiv">'+exchangeNo+'</div></td>' +
        '<td>'+resId+'</td>' +
        '<td>'+resTitle+'</td>' +
        '<td>'+tableName+'</td>' +
        '<td><input type="text" value="" class="form-control"/></td>' +
        '<td><a href="#" class="removeReviewList" style="font-size: 32px">×</a></td></tr>');
    });

    $("body").on("click", ".removeReviewList", function (e) {
        $(this).parent().parent().remove();
        return false;
    });

    //取消
    $("#btn_cancel").click(function(){
        location.href = "/" +proName +"/mydata/paper";
    });
    //提交表单
    $("#btn_commit").click(function(){
        //检查手机号和电话号

        doSubmit("create");
    });
    function doSubmit(callback){
        var flag = false
        $(".checkable").each(function(){
            if(checkNotBlank($(this),$(this).siblings("small"),"*请输入"+$(this).data("name"))){
                flag = true;
                return false;
            }
        });
        var deadline = $("input[name='deadline']").filter(":checked").val();
        if(deadline == "other"){
            $(".checkdate").each(function(){
                if(checkNotBlank($(this),$(this).siblings("small"),"*请输入完整日期")){
                    flag = true;
                    return false;
                }
            });
            if(checkYear() || checkMonth() || checkDay()){
                return false;
            }
        }
        if(flag){
            return false;
        }
        var timeLimit = ""
        var timeLimitDetail = "";
        var reviewDetail = "";
        switch (deadline) {
            case "1":timeLimit = "month:1";break;
            case "3":timeLimit = "month:3";break;
            case "6":timeLimit = "month:6";break;
            case "other":
                timeLimit = "other";
                timeLimitDetail = $("#dateY").val()+","+$("#dateM").val()+","+$("#dateD").val();
                break;
        }
        var reviewArray = [];
        $("#reviewListTable tr").each(function(){
            var reviewPara = new Object();
            reviewPara.exchangeNo = $.trim($(this).children("td").eq(0).text());
            reviewPara.remark = $.trim($(this).children().find("input").val());
            reviewArray.push(reviewPara);
        });
        reviewDetail = JSON.stringify(reviewArray);
        $.post("/" +proName +"/mydata/paper/create",
            {
                reviewUserName:$("#reviewUserName").val(),
                reviewDeptName:$("#reviewDeptName").val(),
                reviewAbteilung:$("#reviewAbteilung").val(),
                telephone:$("#telephone").val(),
                mobilePhone:$("#mobilePhone").val(),
                reviewPurpose:$("#reviewPurpose").val(),
                timeLimit:timeLimit,
                timeLimitDetail:timeLimitDetail,
                reviewDetail:reviewDetail
            },function(data,status){
                if(data.result != "success"){
                    dmallError(data.result);
                }else{
                    if(callback == "create"){
                        location.href = "/" +proName +"/mydata/paper";
                    }else{
                        location.href = "/" +proName +"/mydata/paper/preview?id="+data.id + "&actionType=1";
                    }
                }
            },"json");
    }
    $("body").not("#catalogListWrap").click(function () {
        if (!($("#catalogListWrap").is(":hidden"))) {
            if (outsideTag != 1) {
                $("#catalogListWrap").hide();
            }
            outsideTag = 0;
        }
    });
    $("input[type=text]").focus(function(){
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
    });
    $("textarea").focus(function(){
        $(this).removeClass("errorC");
        $(this).siblings("small").hide();
    });
    $(".checkable").blur(function(){
        checkNotBlank($(this),$(this).siblings("small"),"*请输入"+$(this).data("name"));
    });
    $("#telephone").blur(function(){
        checkTelephone();
    });
    $("#mobilePhone").blur(function(){
        checkMobilePhone();
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

    function checkYear(){
        var year = $.trim($("#dateY").val());
        if (year<2016){
            $("#dateY").addClass("errorC");
            $(".errorDate").html("*请输入正确格式时间");
            $(".errorDate").css("display", "block");
            return true;
        }
    }
    function checkMonth(){
        var month = $.trim($("#dateM").val());
        if (month < 0 ||month > 12){
            $("#dateM").addClass("errorC");
            $(".errorDate").html("*请输入正确格式时间");
            $(".errorDate").css("display", "block");
            return true;
        }
    }
    function checkDay(){
        var day = $.trim($("#dateD").val());
        if (day < 0 ||day > 31){
            $("#dateD").addClass("errorC");
            $(".errorDate").html("*请输入正确格式时间");
            $(".errorDate").css("display", "block");
            return true;
        }
    }
});

//检查联系方式
function checkTelephone(){
    var telephone = $.trim($("#telephone").val());
    var re = /^0\d{2,3}-?\d{7,8}$/;
    if (telephone != "" && !re.test(telephone)) {
        $("#telephone").addClass("errorC");
        $(".errorTelephone").html("*请输入正确的电话号码");
        $(".errorTelephone").css("display", "block");
        return true;
    }
}

function checkMobilePhone(){
    var mobilePhone = $.trim($("#mobilePhone").val());
    var re = /^1\d{10}$/;
    if (mobilePhone != "" && !re.test(mobilePhone)) {
        $("#mobilePhone").addClass("errorC");
        $(".errorMobilePhone").html("*请输入正确的手机号码");
        $(".errorMobilePhone").css("display", "block");
        return true;
    }
}