

function checkItemNo(){
    var string = $("#itemNo").val();
    var ret = inputCheckItemNo(string);
    if(!ret)
    {
        $("#itemNo").addClass("border-red");
        $(".error3").html("*请输数据目录编号");
        $(".error3").css("display", "block");
        preventDefaultFlag = true;
    }
};
$("#itemNo").blur(function(){
    checkItemNo();
});
$("#itemNo").focus(function () {
    var string = $("#itemNo").val();
    var ret = inputCheckItemNo(string);
    if(!ret)
    {
        $("#itemNo").removeClass("border-red");
        $(".error3").hide();
    }
});



function checkItemName(){
    var string = $("#itemName").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#itemName").addClass("border-red");
        $(".error4").html("*请输数据目录名称");
        $(".error4").css("display", "block");
        preventDefaultFlag = true;
    }
};
$("#itemName").blur(function(){
    checkItemName();
});
$("#itemName").focus(function () {
    var string = $("#itemName").val();
    var ret = checkItemName(string);
    if(!ret)
    {
        $("#itemName").removeClass("border-red");
        $(".error4").hide();
    }
});

//数据项编号校验
function checkInputNum(){
    console.log(123);
    var string = $("#inputNum").val();
    var ret = inputCheckCodeNum(string);
    if(!ret)
    {
        $("#inputNum").addClass("border-red");
        $(".error1").html("*请输数据项编号");
        $(".error1").css("display", "block");
        preventDefaultFlag = true;
    }
};
$("#inputNum").blur(function(){
    checkInputNum();
});
$("#inputNum").focus(function () {
    console.log(123);
    var string = $("#inputNum").val();
    var ret = inputCheckCodeNum(string);
    if(!ret)
    {
        $("#inputNum").removeClass("border-red");
        $(".error1").hide();
    }
});

//数据项名称校验
function checkInputName(){
    var string = $("#inputName").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#inputName").addClass("border-red");
        $(".error2").html("*请输数据目录名称");
        $(".error2").css("display", "block");
        preventDefaultFlag = true;
    }
};
$("#inputName").blur(function(){
    checkInputName();
});
$("#inputName").focus(function () {
    var string = $("#inputName").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#inputName").removeClass("border-red");
        $(".error2").hide();
    }
});
//数据项中文名称
function checkInputChineseNameName(){
    var string = $("#inputChineseName").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#inputChineseName").addClass("border-red");
        $(".error5").html("*请输数据项中文名称");
        $(".error5").css("display", "block");
        preventDefaultFlag = true;
    }
};
$("#inputChineseName").blur(function(){
    checkInputChineseNameName();
});
$("#inputChineseName").focus(function () {
    var string = $("#inputChineseName").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#inputChineseName").removeClass("border-red");
        $(".error5").hide();
    }
});

//数据元内容标识符???
function checkInputDataContent(){
    var string = $("#inputDataContent").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#inputDataContent").addClass("border-red");
        $(".error6").html("*请输数据元内容标识符");
        $(".error6").css("display", "block");
        preventDefaultFlag = true;
    }
};
$("#inputDataContent").blur(function(){
    checkInputDataContent();
});
$("#inputDataContent").focus(function () {
    var string = $("#inputDataContent").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#inputDataContent").removeClass("border-red");
        $(".error6").hide();
    }
});
//数据项长度
function checkInputDatalength(){
    var string = $("#inputDatalength").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#inputDatalength").addClass("border-red");
        $(".error7").html("*请输数据项长度");
        $(".error7").css("display", "block");
        preventDefaultFlag = true;
    }
};
$("#inputDatalength").blur(function(){
    checkInputDatalength();
});
$("#inputDatalength").focus(function () {
    var string = $("#inputDatalength").val();
    var ret = inputCheckName(string);
    if(!ret)
    {
        $("#inputDatalength").removeClass("border-red");
        $(".error7").hide();
    }
});



//数据目录校验
function inputCheckItemNo(string){
    //var regex =  /^[a-zA-Z0-9_\u4e00-\u9fa5-]{1,64}$/;
    var regex =  /^[A-Z]{1,64}-\d{1,2}-\d{1,}$/;
    return regex.test(string);
}
function inputCheckCodeNum(string) {
    var regex = /^[0-9]{1,16}$/
    return regex.test(string);
}
// //数据目录名称校验
// function inputCheckName(string){
//     //var regex =  /^[a-zA-Z0-9_\u4e00-\u9fa5-]{1,64}$/;
//     var regex =  /^[A-Z]{1,64}-\d{1,2}-\d{1,}$/;
//     return regex.test(string);
//
// }



$("#btn_create").click(function () {
    console.log($('#itemNo').val());
    $("#datadirectoryItemNum").html($('#itemNo').val()+"-");
    $('#createModal').modal({backdrop: 'static', keyboard: false});
});
//删除按钮
$("#listTable tbody ").on("click","tr td:last-child button",function () {
    var target = $(this).parent().parent();
    target.remove();
});

$("#btn-submit").click(function () {
    var inputNum = $("#inputNum").val();
    var inputName = $("#inputName").val();
    var inputChineseName = $("#inputChineseName").val();
    var inputDataType = $("#inputDataType option:selected").text().split(" ")[0];
    var inputDataContent = $("#inputDataContent").val();
    var inputDatalength = $("#inputDatalength").val();
    var inputDescription = $("#inputDescription").val();
    console.log(inputNum,inputName,inputChineseName,inputDataType,inputDataContent,inputDatalength,inputDescription);
    $("#listTable tbody").append('<tr>'+
        '<td>'+inputNum+'</td>'+
        '<td>'+inputName+'</td>'+
        '<td>'+inputDataType+'</td>'+
        '<td>'+inputDataContent+'</td>'+
        '<td>'+inputDatalength+'</td>'+
        '<td>'+inputDescription+'</td>'+
        '<td><button>'+'&times;'+'</button></td>'+
        '</tr>');

});
//数据目录编号改变事件
var $itemNo = $('#itemNo');
//        $itemNo.val('ZNB-03-113200001');
console.log($itemNo.val())


//失去焦点
$itemNo.blur(function () {
//            checkResourceIdValue();
    var str = $itemNo.val();
    var arr = str.split('-');
//            //更改所属目录编号
//            $('#directoryName').val(arr[2] + '-' + arr[3] + '-' + arr[4]);
    //更改行业类别
    $('#industryCode').val(arr[0]);
    //更改公安业务分类
    $('#businessCode').val(arr[1]);
    //更改数据资源要素一级分类
    $('#data1stCode').val(parseInt(arr[2][0]));
    //更改数据资源要素二级分类
    $('#data2ndCode').val(parseInt(arr[2][1]));
    //更改数据资源要素细目分类
    $('#dataDetailCode').val(parseInt(arr[2][2]));
    //更改数据资源属性分类
    $('#dataPropertyCode').val(parseInt(arr[2][3]));

});
//        $data1stName.change(function () {
//            var value = $data1stName.val();
//            changeSelect2(value, 0);
//        });
//        //数据资源要素一、二级分类，数据资源要素细目分类，属性分类选择后更改
//        function changeSelect2(value, n) {
//            var str = $resourceNo.val();
//            var arr = str.split('-');
//            var arr4 = arr[4].split('');
//            arr4[n]=value;
//            arr[4]=arr4.join('');
//            str=arr.join('-');
//            arr = str.split('-');
//            //更改数据资源编号
//            $resourceNo.val(str);
//            //更改所属目录编号
//            $('#directoryName').val(arr[2] + '-' + arr[3] + '-' + arr[4]);
//        }
var str = $itemNo.val();
var arr = str.split('-');
var $industryCode = $("#industryCode");
$industryCode.change(function () {
    $("#itemNo").val($("#industryCode").val()+"-"+arr[1]+"-"+arr[2]);
    arr[0] = $("#industryCode").val();
    var $businessCode = $("#businessCode");
    $businessCode.change(function () {
        $("#itemNo").val(arr[0]+"-"+$("#businessCode").val()+"-"+arr[2]);
        arr[1] = $("#businessCode").val();
        var $data1stCode = $("#data1stCode");
        $data1stCode.change(function () {
            $("#itemNo").val(arr[0]+"-"+arr[1]+"-"+$("#data1stCode").val()+arr[2][1]+arr[2][2]+arr[2][3]+"00001");
            arr[2][0] = $("#data1stCode").val();
            var $data2ndCode = $("#data2ndCode");
            $data2ndCode.change(function () {
                $("#itemNo").val(arr[0]+"-"+arr[1]+"-"+arr[2][0]+$("#data2ndCode").val()+arr[2][2]+arr[2][3]+"00001");
                arr[2][1] = $("#data2ndCode").val();
                var $dataDetailCode = $("#dataDetailCode");
                $dataDetailCode.change(function () {
                    $("#itemNo").val(arr[0]+"-"+arr[1]+"-"+arr[2][0]+arr[2][1]+$("#dataDetailCode").val()+arr[2][3]+"00001");
                    arr[2][2] = $("#dataDetailCode").val();
                    var $dataPropertyCode = $("#dataPropertyCode");
                    $dataPropertyCode.change(function () {
                        $("#itemNo").val(arr[0]+"-"+arr[1]+"-"+arr[2][0]+arr[2][1]+arr[2][2]+$("#dataPropertyCode").val()+"00001");
                        arr[2][3] = $("#dataPropertyCode").val();
                    });
                });
            });
        });
    });

});

/**
 * 分页函数
 * pno--页数
 * psize--每页显示记录数
 * 分页部分是从真实数据行开始，因而存在加减某个常数，以确定真正的记录数
 * 纯js分页实质是数据行全部加载，通过是否显示属性完成分页功能
 **/
function goPage(pno,psize){
    var num = $("#listTable tbody tr").length;;//表格所有行数(所有记录数)
    console.log(num);
    var totalPage = 0;//总页数3

    var pageSize = psize;//每页显示行数
    //总共分几页
    if(num/pageSize > parseInt(num/pageSize)){
        totalPage=parseInt(num/pageSize)+1;
    }else{
        totalPage=parseInt(num/pageSize);
    }
    var currentPage = pno;//当前页数
    var startRow = (currentPage - 1) * pageSize+1;//开始显示的行  31
    var endRow = currentPage * pageSize;//结束显示的行   40
    endRow = (endRow > num)? num : endRow;    40
    console.log(endRow);
    //遍历显示数据实现分页
    for(var i=1;i<(num+1);i++){
        var irow = itable.rows[i-1];
        if(i>=startRow && i<=endRow){
            irow.style.display = "block";
        }else{
            irow.style.display = "none";
        }
    }
    var pageEnd = document.getElementById("pageEnd");
    var tempStr = "共"+num+"条记录 分"+totalPage+"页 当前第"+currentPage+"页";
    if(currentPage>1){
        tempStr += "<a href=\"#\" onClick=\"goPage("+(1)+","+psize+")\">首页</a>";
        tempStr += "<a href=\"#\" onClick=\"goPage("+(currentPage-1)+","+psize+")\"><上一页</a>"
    }else{
        tempStr += "首页";
        tempStr += "<上一页";
    }

    if(currentPage<totalPage){
        tempStr += "<a href=\"#\" onClick=\"goPage("+(currentPage+1)+","+psize+")\">下一页></a>";
        tempStr += "<a href=\"#\" onClick=\"goPage("+(totalPage)+","+psize+")\">尾页</a>";
    }else{
        tempStr += "下一页>";
        tempStr += "尾页";
    }

    document.getElementById("barcon").innerHTML = tempStr;

}


// $("#datadirectoryItemNum").val("${}")




