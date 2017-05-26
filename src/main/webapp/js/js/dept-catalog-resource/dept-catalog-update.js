/**
 * Created by yi on 2017/3/18.
 */
var pathname = window.location.pathname;
var list = pathname.split("/");
var proName = list[1];
var rootPath = "http://" + window.location.host + "/" + proName;

var itemMappingArr = [];
var dataDirectItemPageSize = 10;

var $confirmItemCode = $('#confirmItemCode');
var $dataDirectoryList = $('#dataDirectoryList');
//点击所属目录数据项编号未指定
$('#virtualTextTable').on('click','.addDataDirectory',function (e) {
    e.preventDefault();
    var targetIndex = parseInt($(this).parent().parent().index());
    $('#virtualTextTable').data('targetIndex',targetIndex);
    $('#addDataDirectoryItem').modal({backdrop: 'static', keyboard: false});
    $('#toRrlation').attr('disabled', false);
    //获取所属目录数据项编号
    $('#confirmItemDataBtn').attr('disabled', true);
    if(sessionStorage['directoryId'] == '0'){
        $dataDirectoryList.html('未选择所属目录编号!');
    }else{
        getPageDataDirectItem(1);
    }
});
//点击数据项编号未指定
$('#virtualTextTable').on('click','.addDataTable',function (e) {
    e.preventDefault();
    var targetIndex = parseInt($(this).parent().parent().index());
    $('#virtualTextTable').data('targetIndex',targetIndex);
    //打开模态框
    $('#addDataTableItem').modal({backdrop: 'static', keyboard: false});
    $('#toRrlation').attr('disabled', false);
    $('#itemDataBtn').prop('disabled', true);
    //清空
    clearDataTableItem();
    //获取应用系统编号
    getAppSystemNo();
});
//数据项编号提交
$('#itemDataBtn').click(function () {
    var targetIndex = $('#virtualTextTable').data('targetIndex');
    var dataDirectoryItemNo = $('#virtualTextTable tr').eq(targetIndex).children('td').eq(0).children('.toDataItemDetail').html();
    if(dataDirectoryItemNo == undefined)dataDirectoryItemNo='';
    itemMappingArr[targetIndex] = {
        dataDirectoryItemNo:dataDirectoryItemNo,
        dataTableItemNo:dataItemCode
    };
    // itemMappingArr[targetIndex].dataTableItemNo = dataItemCode;
    $('#virtualTextTable tr').eq(targetIndex).children('td').eq(1)
        .html('<a href="#" class="toDataItemDetail">' + dataItemCode + '</a>');
    checkItemMappingRepeat();
});
function translateStr(str) {
    str = str.replace(/</g,'&lt;');
    str = str.replace(/>/g,'&gt;');
    str = str.replace(/\'/g,"&apos;");
    str = str.replace(/\"/g,"&quot;");
    return str;
}
var directoryItemTree;
function getPageDataDirectItem(pageNum){
    $.get(
        rootPath+"/directory/datadirectory_item_list",
        {
            itemNo : $('#confirmItemCode').val(),
            id : sessionStorage['directoryId'],
            pageNumber: pageNum,
            pageSize: dataDirectItemPageSize
        },
        function(data, status){
            if(data.result != "success"){
                $dataDirectoryList.html('未选择所属目录编号!');
            }else {
                var itemEntityList = data.itemEntityList;
                var totalPages = itemEntityList.totalPages;
                var list = itemEntityList.result;
                if(list.length != 0){
                    for(var i = 0; i < list.length; i++){
                        var titleName = list[i].itemName;
                        titleName = translateStr(titleName);
                        list[i]['text'] = '<span  style="float:left;margin-top: -17px;width:450px;height:17px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;" title="'+ list[i].itemNo + ' ' + titleName+'">' + list[i].itemNo + ' ' + titleName+'</span>';
                    }
                    initDataDirectoryPage(pageNum, totalPages);
                    directoryItemTree = $dataDirectoryList.treeview({
                        data: list,
                        onNodeSelected: function (event, node) {
                            $confirmItemCode.data("itemNo", node.itemNo);
                            $confirmItemCode.data("itemName", node.itemName);
                            $('#confirmItemDataBtn').prop('disabled', false);
                        }
                    });
                }else{
                    $dataDirectoryList.html('没有数据！');
                    initDataDirectoryPage(1,1);
                }
            }
        },
        "json"
    );
}
$dataDirectoryList.on('click','li', function () {
    $('#confirmItemDataBtn').attr('disabled', false);
});
//查询
$confirmItemCode.keyup(function () {
    if(sessionStorage['directoryId'] == '0'){
        $dataDirectoryList.html('未选择所属目录编号!');
    }else{
        getPageDataDirectItem(1);
    }
});
//提交
$('#confirmItemDataBtn').click(function () {
    var targetIndex = $('#virtualTextTable').data('targetIndex');
    var dataDirectoryItemNo = $confirmItemCode.data("itemNo");
    var dataTableItemNo = $('#virtualTextTable tr').eq(targetIndex).children('td').eq(1).children('.toDataItemDetail').html();
    if(dataTableItemNo == undefined)dataTableItemNo='';
    itemMappingArr[targetIndex] = {
        dataDirectoryItemNo:dataDirectoryItemNo,
        dataTableItemNo:dataTableItemNo
    };
    // itemMappingArr[targetIndex].dataDirectoryItemNo = dataDirectoryItemNo;
    $('#virtualTextTable tr').eq(targetIndex).children('td').eq(0)
        .html('<a href="#" class="toDataItemDetail">' + dataDirectoryItemNo + '</a>');
    checkItemMappingRepeat();
});
//验证数据项映射是否重复
function checkItemMappingRepeat() {
    var targetIndex = $('#virtualTextTable').data('targetIndex');
    var list = [];
    for(var i = 0; i < itemMappingArr.length; i++){
        list.push(itemMappingArr[i].dataDirectoryItemNo+itemMappingArr[i].dataTableItemNo);
    }
    if(list.join('') == ''){
        $('#addRepeat').css('display', 'block').children().html('数据项映射不能为空!');
        return true;
    }else if(isRemovedItem()){
        $('#addRepeat').css('display', 'block').children().html('有删除线的数据项已不存在，请删除！');
        return true;
    }

    var newList = [];
    var repeatList = [];
    for(var i = 0; i < list.length; i++){
        if(newList.indexOf(list[i]) == -1){
            newList.push(list[i]);
        }else {
            repeatList.push(list[i]);
        }
    }
    var repeatListIndex = [];
    for(var i = 0; i < repeatList.length; i++){
        if(repeatList[i] != ''){
            var arr = findAll(list,repeatList[i]);
            repeatListIndex.push(arr);
        }
    }
    $('#virtualTextTable').find('.repeatRow').css('background','#fff');
    if(repeatListIndex.length != 0){
        // for(var i = 0; i < repeatListIndex.length; i++){
        //     var color = randomColor(60,225);
        //     for(var j = 0; j < repeatListIndex[i].length; j++){
        //         $('#virtualTextTable tr').eq(repeatListIndex[i][j]).find('.repeatRow').css('background',color);
        //     }
        // }
        $('#addRepeat').css('display', 'block').children().html('数据项映射重复！');
        return true;
    }else {
        $('#addRepeat').css('display', 'none');
    }
    for(var i = itemMappingArr.length-1; i >=0; i--){
        if(itemMappingArr[i].dataDirectoryItemNo == ''&&itemMappingArr[i].dataTableItemNo==''){
            itemMappingArr.splice(i,1);
        }
    }
    return false;
}
function randomColor(min,max) {
    var r = Math.floor(Math.random()*(max-min)+min);
    var g = Math.floor(Math.random()*(max-min)+min);
    var b = Math.floor(Math.random()*(max-min)+min);
    return "rgb("+r+','+g+','+b+")";
}
function findAll(a,x){
    var results=[],
        len=a.length,
        pos=0;
    while(pos<len){
        pos=a.indexOf(x,pos);
        if(pos===-1){//未找到就退出循环完成搜索
            break;
        }
        results.push(pos);//找到就存储索引
        pos+=1;//并从下个位置开始搜索
    }
    return results;
}

function initDataDirectoryPage(pageNumber,totalPages, type) {
    $("#dataDirectoryPageNum").empty();

    if (pageNumber == 1) {
        $("#dataDirectoryPageNum").append('<li class="disabled pageTag"><a>&lt;</a></li>');
    } else {
        $("#dataDirectoryPageNum").append('<li class="pageTag"><a>&lt;</a></li>');
        if (pageNumber >= 3 && totalPages >= 5) {
            $("#dataDirectoryPageNum").append('<li class="pageTag"><a>1</a></li>');
        }
    }
    if (pageNumber > 3 && totalPages > 5) {
        $("#dataDirectoryPageNum").append('<li class="pageTag"><a>...</a></li>');
    }
    if ((totalPages - pageNumber) < 2 && pageNumber > 2) {
        if ((totalPages == pageNumber) && pageNumber > 3) {
            $("#dataDirectoryPageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) - 3) + '</a></li>');
        }
        $("#dataDirectoryPageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) - 2) + '</a></li>');
    }

    if (pageNumber > 1) {
        $("#dataDirectoryPageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) - 1) + '</a></li>');
    }
    $("#dataDirectoryPageNum").append('<li class="active pageTag"><a>' + parseInt(pageNumber) + '</a></li>');
    if ((totalPages - pageNumber) >= 1) {
        $("#dataDirectoryPageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) + 1) + '</a></li>');
    }
    if (pageNumber < 3) {
        if ((pageNumber + 2) < totalPages) {
            $("#dataDirectoryPageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) + 2) + '</a></li>');
        }
        if ((pageNumber < 2) && ((pageNumber + 3) < totalPages)) {
            $("#dataDirectoryPageNum").append('<li class="pageTag"><a>' + (parseInt(pageNumber) + 3) + '</a></li>');
        }
    }
    if ((totalPages - pageNumber) >= 3 && totalPages > 5) {
        $("#dataDirectoryPageNum").append('<li class="pageTag"><a >...</a></li>');
    }

    if (pageNumber == totalPages || type == "create") {
        $("#dataDirectoryPageNum").append('<li class="disabled pageTag"><a>&gt;</a></li>');
    } else {
        if ((totalPages - pageNumber) >= 2) {
            $("#dataDirectoryPageNum").append('<li class="pageTag"><a>' + totalPages + '</a></li>');
        }
        $("#dataDirectoryPageNum").append('<li class="pageTag"><a>&gt;</a></li>');
    }
}
// 点击下面的页码改变的页面数据
$("#dataDirectoryPageNum").on("click", ".pageTag", function () {
    if (!$(this).hasClass("disabled")) {
        var pageNumber = $(this).children("a").text();
        var active = parseInt($("#dataDirectoryPageNum li.active a").text());
        if (pageNumber != "<" && pageNumber != ">" && pageNumber!= '...') {
            getPageDataDirectItem(parseInt(pageNumber));
        } else if (pageNumber == "<") {
            getPageDataDirectItem(parseInt(active - 1));
        } else if (pageNumber == ">") {
            getPageDataDirectItem(parseInt(active + 1));
        }
    }
});

function getAllDataDirectoryItem(directoryId) {
    $.get(
        rootPath+"/directory/datadirectory/find_allItem",
        {
            directoryId : directoryId
        },
        function(data, status){
            if(data.result != "success"){
                $('#virtualTextTable').html('');
            }else {
                var itemList = data.itemList;
                console.log(itemList);
                var html = '';
                if(itemList.length != 0){
                    $('#virtualTextTable').empty();
                    for(var i = 0; i < itemList.length; i++){
                        var obj = {
                            dataDirectoryItemNo:itemList[i].itemNo,
                            dataTableItemNo:''
                        };
                        itemMappingArr.push(obj);
                        html += '<tr><td><a href="#" class="toDataItemDetail">'+itemList[i].itemNo+'</a></td>' +
                            '<td><a href="#" class="addDataTable">未指定</a></td>' +
                            '<td><a href="#" class="removeItemMapping" style="font-size: 14px"><em class="fa fa-times-circle"></em></a></td><td><i class="repeatRow"></i></td></tr>';
                    }
                }
                $('#virtualTextTable').html(html);
            }
        },
        "json"
    );
}


//获取数据项详情
$("#virtualTextTable").on("click", ".toDataItemDetail", function (e) {
    e.preventDefault();
    var itemNo = $(this).html();
    openDataItem(itemNo);
});

//删除
$("#virtualTextTable").on("click", ".removeItemMapping", function () {
    var targetName = parseInt($(this).parent().parent().index());
    var target = $(this).parent().parent();
    target.remove();
    itemMappingArr.splice(targetName, 1);
    $('#toRrlation').prop('disabled', false);
    $('#addRepeat').css('display', 'none').children().html('');
    checkItemMappingRepeat();
});




