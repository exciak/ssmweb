/**
 * Created by DD on 2016/5/19.
 */

var curId;

$(document).ready(function () {
    $('#cancelPublishModalBtn').click(function() {
            $('#cancelPublishModal').modal('hide');
            $.post("app/cancel",
                {
                    id: curId
                },
                function (data, status) {
                    if (data.result == "success") {
                        dmallNotifyAndLocation("撤销发布成功。", window.location.href);
                    } else {
                        dmallError(data.result);
                    }
                },
                "json");
        }
    );
});

function cancelPublish(obj, id){
    curId = id;
    $('#cancelPublishModal').modal({backdrop: 'static', keyboard: false});
}