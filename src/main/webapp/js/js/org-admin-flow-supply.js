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
                type:"supply",
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
        $("#flowPara").append('<div style="display: inline-block" data-flowname="APPLYING" name="flow"><div class="dotted-div">' +
        '<span class="circle-done">1</span><p>数据申请</p></div></div>' +
        '<div style="display: inline-block" data-flowname="OBTAINAUTHORIZING" name="flow"><span class="circle-line"></span>' +
        '<div class="dotted-div">' +
        '<span class="circle-done">2</span><p>获取权签</p></div></div>' +
        '<div style="display: inline-block" data-flowname="OBTAINPREPARING" name="flow"><span class="circle-line"></span>' +
        '<div class="dotted-div">' +
        '<span class="circle-done">3</span><p>获取准备</p></div></div>' +
        '<div style="display: inline-block" data-flowname="SUPPLYAUOTHRIZING" name="flow"><span class="circle-line"></span>' +
        '<button type="button" class="close red" data-dismiss="alert" aria-hidden="true">&times;</button><div class="dotted-div">' +
        '<span class="circle-done">4</span><p>供应权签</p></div></div>' );
    }
});