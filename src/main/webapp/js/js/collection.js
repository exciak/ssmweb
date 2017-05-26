var userId = 1;

$(document).ready(function () {
    $('#deleteCollectionBtn').click(
        function () {
            $('#deleteModal').modal('hide');
            $.post("collection/delete",
                {
                    dataId: $('#deleteCollectionBtn').data("dataId")
                },
                function (data, status) {
                    if (data.result != "success") {
                        dmallError(data.result);
                    } else {
                        location.href = "?" + "&pageNumber=" + pageNumber;
                    }
                },
                "json");
        }
    );

    $('#deleteSelectedCollectionBtn').click(
        function () {
            $('#deleteSelectedModal').modal('hide');
            var indexList = "";
            for (i = 0; i < $("input[name='ids']:enabled:checked").size(); i++) {
                indexList = indexList + $("input[name='ids']:enabled:checked")[i].value;
                if ((i + 1) != $("input[name='ids']:enabled:checked").size()) {
                    indexList += ',';
                }
            }

            $.ajax({
                url: "collection/deleteSelected",
                type: "POST",
                data: {indexList: indexList.split(",")},
                dataType: "json",
                success: function (data, status) {
                    if (data.result != "success") {
                        dmallError(data.result);
                    } else {
                        location.href = "?" + "&pageNumber=" + pageNumber;
                    }
                },
                error: function (data) {
                    dmallAjaxError();
                }
            });
        }
    );

});

function deleteCollection(dataId, pageNumber) {
    $('#deleteCollectionBtn').data("dataId", dataId);
    $('#deleteModal').modal({backdrop: 'static', keyboard: false});
}

function deleteSelectedCollectionData(pageNumber) {
    var number = $("input[name='ids']:enabled:checked").size();
    if (number == 0) {
        dmallError("请选择要删除的数据");
        return;
    }
    $('#deleteSelectedModal').modal({backdrop: 'static', keyboard: false});
}

//存组织机构的相应属性
function getDataListByDeptCode(deptCode, resourceTypeCode) {
    document.cookie = "deptCode=" + deptCode + "; path=/";
    if (resourceTypeCode == 'DATAAPI') {
        window.location.href = "../dataapi";
    }
    else {
        window.location.href = "../catalog";
    }
}
