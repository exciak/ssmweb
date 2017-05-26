/**
 * Created by xunzhi on 2015/7/13.
 */

$(document).ready(function () {
    var arr = $("span[id*='fenshu']");
    if (arr && arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            var grading = arr[i].innerText;
            var num = arr[i].id.substring(6);
            var pr = grading / 5 * 100;
            $('#examplem' + num)[0].style.width = pr + '%';
        }
    }

    function getNum(dataId) {
        $.get("mydata/collection/number",
            {
                dataId: dataId
            },
            function (data, status) {
                var name = "colection_stat_favor_" + dataId;
                if ((status == "success") && (data.result == "success")) {
                    document.getElementById(name).innerText = data.collection;
                }
            },
            "json");
    }

    $('.a-collect').click(
        function () {
            var dataId = $(this).attr('dataid');

            $.post("mydata/collection",
                {
                    dataId: dataId
                },
                function (data, status) {
                    if (data.result == "success") {
                        getNum(dataId);
                        dmallNotify("收藏数据成功");
                    } else {
                        dmallError(data.result);
                    }
                },
                "json");
        }
    );

});
