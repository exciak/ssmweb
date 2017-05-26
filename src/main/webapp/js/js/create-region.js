/**
 * Created by Administrator on 2015/7/3.
 */


$(document).ready(function(){
    $("#create").click(function() {
        dmallError("createregion");
        if (inputPassword.value!="") {
            if (inputPassword.value != inputConfirmPassword.value) {
                dmallError("密码不一致");
                inputPassword.value = "";
                inputConfirmPassword.value = "";
                return;
            }
            $.post("../user/createuser",
                {
                    username: inputAdminName.value,
                    email: inputEmail.value,
                    password: inputPassword.value
                },
                function (data, status) {
                    if (data.result == "success") {
                        dmallError("成功。");
                    } else {
                        dmallError("失败。");
                    }

                },
                "json");
            //成功的话
            adminName.value =  inputAdminName.value;
        }
        $.post("../region/createregion",
            {
                regionname: regionName.value,
                decription: description.value,
                administrator: adminName.value
            },
            function(data,status){
                if (data.result == "success") {
                    dmallError("成功。");
                } else {
                    dmallError("失败。");
                }

                location.href = "../../admin_home/page";
            },
            "json");
    });

});
function smallchange(obj){
    if(obj.checked==false)
    {
        document.getElementById("new_user").style.display="none";
    }
    else
    {
        //$("#btn_register").removeAttribute("disabled");
        document.getElementById("new_user").style.display="inline";
    }
}
