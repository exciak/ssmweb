/**
 * Created by wanggang on 2016/6/27.
 */
var preventDefaultFlag=false;
$(document).ready(function(){
    var croppicContainerModalOptionsModify = {
        uploadUrl:'../homepage/saveOriginalFile',
        cropUrl:'../homepage/saveCropFile',
        modal:true,
        imgEyecandyOpacity:0.6,
        loaderHtml:'<div class="loader bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div> ',
        //callbacks
        onBeforeImgUpload: function(){ console.log('onBeforeImgUpload') },
        onAfterImgUpload: function(){ console.log('onAfterImgUpload') },
        onImgDrag: function(){ console.log('onImgDrag') },
        onImgZoom: function(){ console.log('onImgZoom') },
        onBeforeImgCrop: function(){ console.log('onBeforeImgCrop') },
        onAfterImgCrop:function(){
            console.log('onAfterImgCrop');
            $("#backgroundBtnDiv2").show();
            $("#backgroundBtnDiv1").hide();
        },
        onReset:function(){
            console.log('onReset');
            var path =  $("#imgBackgroundPath").val();
            $("#cropContainerModal").append('<img class="croppedImg" src="'+ path +'"/>');
        },
        onError:function(errormessage){
            dmallError(errormessage);
        }
    }
    var cropContainerModal = new Croppic('cropContainerModal', croppicContainerModalOptionsModify);

    //上传图片
    $("#btnUploadBackground").click(function(){
        //触发上传操作
        $(".cropControlUpload").click();
    });

    //使用配置
    $("#btnUseBackground").click(function(){
        $("#btnUseBackground").attr("disabled", true);
        $("#btnUploadBackgroundCancel").attr("disabled", true);

        var imgUrl = $(".croppedImg").attr("src");
        $.post("../homepage/modify",
            {
                imgUrl : imgUrl
            },
            function(data, status){
                if ((status == "success") && (data.result == "success")) {
                    //使用配置成功
                    dmallNotify("使用配置成功");
                    setTimeout("window.location.reload()",1500);
                } else {
                    $("#backgroundBtnDiv1").show();
                    $("#backgroundBtnDiv2").hide();
                    $("#btnUseBackground").attr("disabled", false);
                    $("#btnUploadBackgroundCancel").attr("disabled", false);

                    dmallError("使用配置失败：" + data.result);
                }
        });
    });

    //取消上传图片
    $("#btnUploadBackgroundCancel").click(function(){
        //触发reset操作
        $(".cropControlRemoveCroppedImage").click();
    });
});

//检查上传文件是否为图片
function CheckImgOfForm(backgroundFile) {
    if (!backgroundFile) {
        dmallError(backgroundFile + ":文件为空");
        preventDefaultFlag = true;
        return;
    }

    if (!isImg(backgroundFile)) {
        dmallError(backgroundFile + "不是图片");
        preventDefaultFlag = true;
        return;
    }

}

function isImg(photo) {
    //判断是否为图片的数组
    var img = ['jpg','png'];
    photo = photo.split('.');
    photo = photo[photo.length - 1];

    for(var i in img) {
        if(img[i] == photo) {
            return true;
        }
    }
    return false;
}