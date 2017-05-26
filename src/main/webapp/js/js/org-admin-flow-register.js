/**
 * Created by ss on 2016/7/18.
 */
$(document).ready(function () {
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var prjName = arr[1];
    $("#btn_commit").click(function(){
        $("#btn_commit").attr("disabled",true);
        $("#btn_reset").attr("disabled",true);
        var flowString = getFlow();
        $.post("/" + prjName + "/customized_flow/modify",
            {
                type:"register",
                flowContent:flowString
            },
        function(data,status){
            if(data.result != "success"){
                $("#btn_commit").attr("disabled",false);
                $("#btn_reset").attr("disabled",false);
                dmallError(data.result);
            }else{
                location.href = window.location.href;
            }
        },"json");
    });
    $("#btn_reset").click(function(){
        reset();
        $("#btn_commit").show();
        $("#btn_reset").hide();
        $("#btn_cancel").show();
    });
    $("#btn_cancel").click(function(){
        window.location.reload();
    });

    function getFlow(){
        var flowString = "";
        $("div [name='flow']").each(function(){
            if(flowString == ""){
                flowString = $(this).data("flowname");
            } else{
                flowString = flowString + "," + $(this).data("flowname");
            }
        });
        return flowString;
    }
    //重置
    function reset(){
        $("#flowPara").empty();
        $("#flowPara").append('<div style="display: inline-block" data-flowname="CATALOGING" name="flow"><div class="dotted-div">' +
        '<span class="circle-done">1</span><p>目录提交</p></div></div>' +
        '<div style="display: inline-block" data-flowname="REVIEWING" name="flow"><span class="circle-line"></span>' +
        '<button type="button" class="close red" data-dismiss="alert" aria-hidden="true">&times;</button><div class="dotted-div">' +
        '<span class="circle-done">2</span><p>目录审核</p></div></div>' +
        '<div style="display: inline-block" data-flowname="REGISTERING" name="flow"><span class="circle-line"></span>' +
        '<button type="button" class="close red" data-dismiss="alert" aria-hidden="true">&times;</button><div class="dotted-div">' +
        '<span class="circle-done">3</span><p>目录注册</p></div></div>' +
        '<div style="display: inline-block" data-flowname="PUBLISHING" name="flow"><span class="circle-line"></span><div class="dotted-div">' +
        '<span class="circle-done">4</span><p>中心审核</p></div></div>' );
    }
});