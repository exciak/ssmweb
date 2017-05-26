/**
 * Created by Administrator on 2015/7/2.
 */

$(document).ready(function(){
    //document.getElementById("roleSelect").options[4].selected=true;

    $("#btn_modify").click(function(){

        $.post("modify",
            {
                username:userName.value,
                mainDept: $("#roleSelect").find("option:selected").text()
            },
            function(data,status){
                if (data.result == "success") {
                    dmallNotify("保存成功");
                } else {
                    dmallError("保存失败");
                }
            },
            "json");
    });

    $("#btn_cancel").click(function(){
        window.location.href = "../index";
    });

});