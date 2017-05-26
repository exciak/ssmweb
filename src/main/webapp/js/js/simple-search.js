var dxpSimpleSearch = (function($){

    $(function(){

        var
            $searchInput = $("#simple-search > input[type='text']"),
            $simpleClicks = $("#simple-search-clicks"),
            $tabMenu = $("#subType"),
            $clicks = $("#search-clicks"),
            $simpleSearchBtn = $("#simple-search-btn"),
            $simpleClearBtn = $("#simple-clear-btn"),
            $searchBtn = $("#searchmessage"),
            $clearBtn = $("#clearcondition"),
            $advSearchSectionTriggerLink =$("#adv-search-link"),
            $advSearchImage =$("#adv-search-link > i"),
            $advanceSearchSection = $("#advanced-search"),
            //$dataTypeSelectBox = $("#dataType"),
            $dataSrcTypeSelectBox = $("#dataSrcType"),
            COLLAPSED = "collapsed",
            EXPANDED = "expanded",
            ALL = "ALL",
            DATATABLE = "DATATABLE",
            DISABLED = "disabled";

        //change the first letter of query parameter to lowercase
        var firstLetterToLowerCase = function(s){
            return s.charAt(0).toLowerCase() + s.slice(1);
        };

        //advanced search
        var searchFields = function(ele) {
            var searchItems = $.merge(ele.find("input"), ele.find("select"));
            var searchString = "?";
            for(var i=0; i<searchItems.length; i++) {
                var searchItemName = searchItems.eq(i).attr("name");
                if (searchItemName != undefined) {
                    searchItems.eq(i).val() ? searchString += "&" + firstLetterToLowerCase(searchItemName) + "=" + $.trim(encodeURI(searchItems.eq(i).val())) : null;
                }
            }
            if ($tabMenu.length) {
                searchString += "&" + $tabMenu.attr("name") + "=" + encodeURI($tabMenu.val())
            }
            window.location.href = searchString;
        };

        //search on Enter key press
        var searchOnEnterKey = function(ele){
            var searchItems = $.merge(ele.find("input"), ele.find("select"));
            for(var i=0; i<searchItems.length; i++) {
                searchItems.eq(i).on("keyup", function(event){
                    if(event.keyCode == 13){
                        $.cookie('advSearchStatus') == EXPANDED ? searchFields($("#search-fields")) : searchSingle(firstLetterToLowerCase($searchInput.attr("name")), $.trim($searchInput.val()));
                    }
                });
            }
        };

        //advanced clear
        var advancedClear = function(ele) {
            var inputsToClear = ele.find("input");
            var selectToClear = ele.find("select");
            for(var j=0; j<selectToClear.length; j++) {
                if(selectToClear.eq(j).val() === ALL || !selectToClear.eq(j).val() || "clear" == selectToClear.data("clear")) {
                    //do nothing
                } else {
                    selectToClear.eq(j).val(ALL);
                    //resetDateSelectBox();
                }
            }

            for(var i=0; i<inputsToClear.length; i++) {
                inputsToClear.eq(i).val() ? inputsToClear.eq(i).val("") : null;

            }
            for(var i=0; i<$("#listForm input").length;i++){
                $("#listForm input").eq(i).val() ?$("#listForm input").eq(i).val(""):null;
            }
            $("#exportInput").val("导出");
            $("#btn-import").val("导入");
            var $startTime = $("#startTime"),
                $endTime = $("#endTime");
            $endTime.datetimepicker('setStartDate', null);
            $startTime.datetimepicker('setEndDate', null);
            $("#clearIcon").hide();
        };

        //simple search
        var searchSingle = function(para, query){
            var subType = "";
            if ($tabMenu.length) {
                subType = "&" + $tabMenu.attr("name") + "=" + encodeURI($tabMenu.val());
            }
            window.location.href = "?" + para + "=" + encodeURI(query) + subType;
        };

        //var resetDateSelectBox = function() {
            //$dataTypeSelectBox.val() === DATATABLE ? $dataSrcTypeSelectBox.removeAttr("disabled") : $dataSrcTypeSelectBox.val(ALL).attr(DISABLED, DISABLED);
        //};

        //display advanced search fields
        var showAdvSearch = function(){
            $advSearchImage.removeClass("fa fa-angle-down");
            $advSearchImage.addClass("fa fa-angle-up");
            $advanceSearchSection.show();
            $clicks.show();
            $simpleClicks.hide();
            $.cookie('advSearchStatus', EXPANDED);
        };

        //hide advanced search fields
        var hideAdvSearch = function(){
            $advSearchImage.removeClass("fa fa-angle-up");
            $advSearchImage.addClass("fa fa-angle-down");
            $advanceSearchSection.hide();
            $clicks.hide();
            $simpleClicks.show();
            $.cookie('advSearchStatus', COLLAPSED);
        };

        //resetDateSelectBox();

        searchOnEnterKey($("#search-fields"));

        $simpleSearchBtn.on('click', function(){
            searchSingle(firstLetterToLowerCase($searchInput.attr("name")), $.trim($searchInput.val()));
        });

        $simpleClearBtn.on('click', function(){
            $searchInput.val("");
        });

        $searchBtn.on('click', function(){
            searchFields($("#search-fields"));
        });

        $clearBtn.on('click', function(){
            advancedClear($("#search-fields"));
        });

        //$dataTypeSelectBox.on('change', function(){
        //    resetDateSelectBox();
        //});

        //use cookie to keep advanced search expand-collapse state
        if($searchInput.length!=0)
            $.cookie('advSearchStatus') == EXPANDED ? showAdvSearch() : hideAdvSearch();

        $advSearchSectionTriggerLink.on('click', function(e){
            e.preventDefault();
            $.cookie('advSearchStatus') == EXPANDED ? hideAdvSearch() : showAdvSearch();
        });

    });

})(jQuery);