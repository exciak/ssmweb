function doReturn() {
    var pathname = window.location.pathname;
    var arr = pathname.split("/");
    var proName = arr[1];

    var actionType = $("#actionType").val();
    var id = $("#id").val();
    if (actionType == "1") {
        location.href = "/" + proName + "/mydata/paper/modify?id=" + id;
    } else {
        window.history.go(-1);
    }
}

function printPage() {
    printHtml("mainData");
}

function printFirstPage() {
   printHtml("firstPage");
}

function printSecondPage() {
    printHtml("secondPage");
}

function printThirdPage() {
    printHtml("thirdPage");
}

function printHtml(type) {
    var bdhtml = window.document.body.innerHTML;//获取当前页的html代码
    window.document.body.innerHTML = document.getElementById(type).innerHTML; // 打印区域
    window.print();
    window.document.body.innerHTML = bdhtml;
}
