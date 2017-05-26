/**
 * Created by xunzhi on 2015/9/1.
 */

$(document).ready(function(){
    var $orgList = $('#org-list');
    var rootRoute = $("#rootRoute").val();
    var getOrgListMenu = function() {
        $.get(rootRoute +"/login/org_list",
            function (data, status) {
                if (status == "success") {
                    if (data.result == "success") {
                        $orgList.empty();
                        if (null != data.orgList) {
                            if (data.orgList.length <= 1) {
                                $('#drop-menu-change').hide();
                            } else {
                                for (var i = 0; i < data.orgList.length; i++) {
                                    var org = data.orgList[i];
                                    $orgList.append("<a href='" + rootRoute + "/login/change_org?orgId=" + org.id + "'><li id=" + org.id + " class='longText' title='"+org.name+"'>" + org.name + "</li></a>");
                                }
                            }
                        }
                    }
                } else {
                    dmallError("获取用户所属部门失败");
                }
            },
            "json"
        );
    };
    function fillData2Id (id, data){
        if (null == document.getElementById(id)){
            return false;
        } else{
            $("#" + id)[0].innerText = "(" + data + ")";
        }
    }

    function markIdActive (id){
        if (null == document.getElementById(id)){
            return false;
        } else{
            $("#" + id).removeClass("hidden");
        }
    }

    function getPendingItemNum(){
        var rootRoute = $("#rootRoute").val();
        $.get(rootRoute + "/pendingItem",
            {},
            function (data, status) {
                if((status == "success") && (data.result == "success")){
                    /* 权签人的待办事项数 */
                    if (data.authorFlag == 1) {
                        var authRegisterNum = data.authRegisterNum;
                        var authCancelNum = data.authCancelNum;
                        var authObtainNum = data.authObtainNum;
                        var authSupplyNum = data.authSupplyNum;
                        var authPublishNum = data.authPublishNum;
                        var authPaperNum = data.authPaperNum;

                        if ((authObtainNum != 0) || (authSupplyNum != 0) || (authPaperNum != 0)) {
                            //一级"数据交换"菜单加红点
                            markIdActive("demandPending");

                            //数据交换的下级菜单：获取权签添加待办事项数量
                            if (authObtainNum != 0) {
                                fillData2Id("authObtainPendingNum", authObtainNum);
                                fillData2Id("authObtainPendingHeader", authObtainNum);
                            }

                            //数据交换的下级菜单：供应权签添加待办事项数量
                            if (authSupplyNum != 0) {
                                fillData2Id("authSupplyPendingNum", authSupplyNum);
                                fillData2Id("authSupplyPendingHeader", authSupplyNum);
                            }

                            //数据交换的下级菜单：纸件权签添加待办事项数量
                            if (authPaperNum != 0) {
                                fillData2Id("authPaperPendingNum", authPaperNum);
                                fillData2Id("authPaperPendingHeader", authPaperNum);
                            }
                        }

                        if ((authRegisterNum != 0) || (authCancelNum != 0)) {
                            //一级"部门目录管理"菜单加红点
                            markIdActive("deptCatalogPending");

                            //部门目录管理的下级菜单：目录注册添加待办事项数量
                            if (authRegisterNum != 0) {
                                fillData2Id("authRegisterPendingNum", authRegisterNum);
                                fillData2Id("authRegisterPendingHeader", authRegisterNum);
                            }

                            //部门目录管理的下级菜单：注销审核添加待办事项数量
                            if (authCancelNum != 0) {
                                fillData2Id("authCancelPendingNum", authCancelNum);
                                fillData2Id("authCancelPendingHeader", authCancelNum);
                            }
                        }
                        if (authPublishNum != 0) {
                            markIdActive("demandPending");
                            fillData2Id("authPublishPendingNum", authPublishNum);
                            fillData2Id("authPublishPendingHeader", authPublishNum);
                        }
                    }

                    /* 审核人的待办事项数 */
                    if (data.reviewFlag == 1){
                        var reviewRegisterNum = data.reviewRegisterNum;

                        if (reviewRegisterNum != 0){
                            //一级"部门目录管理"菜单加红点
                            markIdActive("deptCatalogPending");

                            //部门目录管理的下级菜单：注册审核添加待办事项数量
                            fillData2Id('reviewRegisterPendingNum', reviewRegisterNum);
                            fillData2Id('reviewRegisterPendingHeader', reviewRegisterNum);
                        }
                    }

                    /* 使用人的待办事项数 */
                    if (data.userFlag == 1) {
                        var obtainExchangeNum = data.obtainExchangeNum;
                        var submitPaperNum = data.submitPaperNum;
                        if (obtainExchangeNum != 0) {
                            //一级"我的数据"菜单加红点
                            markIdActive("myObtainData");

                            //我的数据的下级菜单：获取的数据添加待办事项数量
                            fillData2Id("obtainExchangePending", obtainExchangeNum);
                        }

                        var appPublishNum = data.appPublishNum;
                        if (appPublishNum != 0) {
                            markIdActive("myObtainData");
                            fillData2Id("appPublishPending", appPublishNum);
                        }
                        //我的数据的下级菜单：纸件权签添加待办事项数量
                        if (submitPaperNum != 0) {
                            fillData2Id("paperReviewPending", submitPaperNum);
                            fillData2Id("paperReviewPendingHeader", submitPaperNum);
                        }
                    }

                    /* 编目人的待办事项数 */
                    if (data.catalogFlag == 1) {
                        var catalogSubmitNum = data.catalogSubmitNum;
                        var catalogCancelNum = data.catalogCancelNum;
                        var catalogDraftNum = data.catalogDraftNum;

                        if ((catalogSubmitNum != 0) || (catalogCancelNum != 0) || (catalogDraftNum != 0)) {
                            //一级"部门目录管理"菜单加红点
                            markIdActive("deptCatalogPending");

                            //部门目录管理的下级菜单：目录提交添加待办事项数量
                            if (catalogSubmitNum != 0) {
                                fillData2Id("catalogSubmitPendingNum", catalogSubmitNum);
                                fillData2Id("catalogSubmitPendingHeader", catalogSubmitNum);
                            }

                            //部门目录管理的下级菜单：目录草稿添加待办事项数量
                            if (catalogDraftNum != 0) {
                                fillData2Id("catalogDraftPendingNum", catalogDraftNum);
                            }

                            //部门目录管理的下级菜单：目录注销添加待办事项数量
                            if (catalogCancelNum != 0) {
                                fillData2Id("catalogCancelPendingNum", catalogCancelNum);
                            }
                        }
                    }

                    /* 系统运维人员的待办事项数 */
                    if (data.maintainFlag == 1) {
                        var maintainOffShelveNum = data.maintainOffShelveNum;
                        var maintainPublishNum = data.maintainPublishNum;
                        var terminateExchangeNum = data.terminateExchangeNum;

                        if ((maintainOffShelveNum != 0) || (maintainPublishNum != 0)) {
                            //一级"中心目录管理"菜单加红点
                            markIdActive("centerCatalogPending");

                            //中心目录管理的下级菜单：目录注销添加待办事项数量
                            if (maintainOffShelveNum != 0) {
                                fillData2Id("maintainOffShelvePendingNum", maintainOffShelveNum);
                                fillData2Id("maintainOffShelvePendingHeader", maintainOffShelveNum);
                            }

                            //中心目录管理的下级菜单：目录发布添加待办事项数量
                            if (maintainPublishNum != 0) {
                                fillData2Id("maintainPublishPendingNum", maintainPublishNum);
                                fillData2Id("maintainPublishPendingHeader", maintainPublishNum);
                            }

                            //数据交换下级菜单:终止交换权签待办事项数量
                            if(terminateExchangeNum != 0) {
                                fillData2Id("terminateExchangePendingNum", terminateExchangeNum);
                                fillData2Id("terminateExchangePendingHeader", terminateExchangeNum);
                            }
                        }

                        if (terminateExchangeNum != 0) {
                            markIdActive("demandPending");

                            //数据交换下级菜单:终止交换权签待办事项数量
                            if(terminateExchangeNum != 0) {
                                fillData2Id("terminateExchangePendingNum", terminateExchangeNum);
                                fillData2Id("terminateExchangePendingHeader", terminateExchangeNum);
                            }
                        }
                    }

                    if (data.securityAuditorFlag == 1) {
                        var appPublishMngtPending = data.appPublishMngtPending;
                        if (appPublishMngtPending != 0) {
                            markIdActive("demandPending");
                            if (appPublishMngtPending != 0) {
                                fillData2Id("appPublishMngtPendingNum", appPublishMngtPending);
                            }
                        }
                    }

                    //中间库管理员代办事项
                    if (data.dataBaseAuditorFlag == 1) {
                        var centerDataBasePending = data.centerDataBasePending;
                        if (centerDataBasePending != 0) {
                            markIdActive("centerDataBasePending");
                            if(centerDataBasePending != 0) {
                                fillData2Id("centerDataBasePendingNum", centerDataBasePending);
                            }
                        }
                    }
                }
            },
            "json"
        );
    };

    getPendingItemNum();

    //get the drop down menu content when doc ready
    getOrgListMenu();
    $(".search-type").click(function(){
        $(this).addClass("active");
        $(this).siblings(".search-type").removeClass("active");
    });
    $("#pageHeadSearch").click(function (){
   // var searchType=$('#searchResourceList')[0].value;
        var searchType = $(".search-bar-label .active").data("searchtype");
        location.href = encodeURI(rootRoute + "/search?searchKeys=" + searchKeys.value+"&searchType="+ searchType);
    });

    $("#searchKeys").keypress(function(e){
        if (event.keyCode == 13) {
            event.cancelBubble = true;
            event.returnValue = false;
            $("#pageHeadSearch").click();
        }
    });
    $("#pageHeadSearch2").click(function (){
        var searchType=$('#searchResourceList')[0].value;
        location.href = encodeURI(rootRoute + "/search?searchKeys=" + searchKeys2.value+"&searchType="+ searchType);
    });

    $("#searchKeys2").keypress(function(e){
        if (event.keyCode == 13) {
            event.cancelBubble = true;
            event.returnValue = false;
            $("#pageHeadSearch2").click();
        }
    });
});