$(document).ready(function(){
   var rootRoute = $("#rootRoute").val();
    var $searchIcon = $("#search-icon"),
        $crossIcon = $("#cross-icon"),
        $searchSwapper = $("#search-swapper"),
        $searchCover = $("#search-cover");

    $searchIcon.on('click', function(){
        $searchCover.show();
        $searchSwapper.show();
        $("#topNav").hide();
    //    $("body").css("overflow", "hidden");
    });

    $crossIcon.on('click', function(){
        $searchCover.hide();
        $searchSwapper.hide();
        $("#topNav").show();
   //     $("body").css("overflow", "auto");
    });
    var searchType=$('#searchType').val();
    var outPut='<option  selected="selected" value="all">全部</option>'+
        '<option value="common">数据目录</option>'+
       '<option value="api">API服务目录</option>';
    if(null!= searchType && searchType!="" && "all"!=searchType){
        if('api' == searchType){
            outPut='<option value="all">全部</option>'+
            '<option value="common">数据目录</option>'+
            '<option selected="selected" value="api">API服务目录</option>';
        }else{
        outPut='<option value="all">全部</option>'+
        '<option selected="selected" value="common">数据目录</option>'+
        '<option value="api">API服务目录</option>';
        }
    }
    $("#searchResourceList").append(outPut);
});