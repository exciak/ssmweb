/**
 * Created by xunzhi on 2015/7/13.
 */

$(document).ready(function () {
    var preventDefaultFlag = false;
    var z = /^[0-9]*$/;

    function checkAuthorizerValue() {
        if ($("#authorizerList").children('option:selected').val() == 0) {
            $("#authorizerList").addClass("errorC");
            $(".errorAuthorizerListValue").html("*请选择权签人");
            $(".errorAuthorizerListValue").css("display", "block");
            return true;
        }
        return false;
    }

    $("#authorizerList").focus(function () {
        if ($("#authorizerList").children('option:selected').val() == 0){
            $("#authorizerList").removeClass("errorC");
            $(".errorAuthorizerListValue").hide();
        }
    });
    $("#authorizerList").blur(function () {
        checkAuthorizerValue();
    });
    //共享周期
    $("#exchangeIntervalList").change(function () {
        var selected = $("#exchangeIntervalList option:selected").val();
        if (selected == "") {
            $("#exchangeIntervalValue").val("");
            $("#exchangeIntervalValue").attr("readonly", true);
            $("#exchangeIntervalValue").removeClass("errorC");
            $(".errorExchangeIntervalValue").css("display", "none");
        } else {
            $("#exchangeIntervalValue").attr("readonly", false);
        }
    });
    $("#exchangeIntervalValue").focus(function () {
        $("#exchangeIntervalValue").removeClass("errorC");
        $(".errorExchangeIntervalValue").hide();
    });
    $("#exchangeIntervalValue").blur(function () {
        checkExchangeIntervalValue();
    });
    function checkExchangeIntervalValue() {
        if ($("#exchangeIntervalList option:selected").val() != undefined && $("#exchangeIntervalList option:selected").val() != "") {
            if ($("#exchangeIntervalValue").val() == "") {
                $("#exchangeIntervalValue").addClass("errorC");
                $(".errorExchangeIntervalValue").html("*请输入共享周期");
                $(".errorExchangeIntervalValue").css("display", "block");
                return true;
            } else if (!z.test($("#exchangeIntervalValue").val())) {
                $("#exchangeIntervalValue").addClass("errorC");
                $(".errorExchangeIntervalValue").html("*共享周期必须为整数");
                $(".errorExchangeIntervalValue").css("display", "block");
                return true;
            }
        }
        return false;
    }
    $('#authorizeButton').click(
        function (event) {
            if(checkExchangeIntervalValue() || checkAuthorizerValue()){
                return false;
            }
            $("#authorizeButton").attr("disabled", true);
            $("#cancelButton").attr("disabled", true);
            var dataId = $("#inputHiddenDataId").val();
            var val = {};
            if($("#exchangeIntervalList option:selected").val() != ""){
                var key = $("#exchangeIntervalList option:selected").val();
                var value = $("#exchangeIntervalValue").val();
                val[key] = value;
            }
            var expireTime = JSON.stringify(val);
            $.post("obtain",
                {
                    dataId: dataId,
                    authorizerId: $("#authorizerList option:selected").val(),
                    expireTime:expireTime
                },
                function (data, status) {
                    if (data.result != "success") {
                        dmallError(data.result);
                        $("#authorizeButton").attr("disabled", false);
                        $("#cancelButton").attr("disabled", false);
                    } else {
                        location.href = "mydata/demand";
                    }
                },
                "json");
        }
    );
});

function getDataByDept(deptId, resourceTypeCode) {
    document.cookie = "deptId=" + deptId + "; path=/";
    if (resourceTypeCode == 'DATAAPI')
        window.location.href = "dataapi";
    else window.location.href = "catalog";
}