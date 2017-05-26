
function simplePagination(curPageTmp, totalPagesTmp, getFunc) {
    var html = '';
    var curPage = parseInt(curPageTmp);
    var totalPages = parseInt(totalPagesTmp);

    if (totalPages == 0) {
        return html;
    }

    if (curPage > totalPages) {
        curPage = totalPages;
    }

    html = html + '<span class=""><sp class="text-danger" id="curPage">' + curPage + '</sp>/<sp id="totalPages">' + totalPages + '</sp> &nbsp;</span>';
    if (curPage == 1) {
        html = html + ' <a class="btn btn-sm btn-default fa fa-chevron-left disabled" ></a>';
    } else {
        html = html + '<a class="btn btn-sm btn-default fa fa-chevron-left" onclick="' + getFunc + '(' + (curPage - 1) + ')"></a>'
    }
    if (curPage == totalPages) {
        html = html + ' <a class="btn btn-sm btn-default fa fa-chevron-right disabled" ></a>'
    } else {
        html = html + '<a class="btn btn-sm btn-default fa fa-chevron-right" onclick="' + getFunc + '(' + (curPage + 1) + ')"></a>'
    }

    return html;
}

function fullPagination(pageNumberTmp, totalPagesTmp, getFunc) {
    var outString = "";
    var pageNumberInput = pageNumberTmp;
    var pageNumber = parseInt(pageNumberTmp);
    var totalPages = parseInt(totalPagesTmp);

    if (pageNumber > totalPages) {
        pageNumber = totalPages;
    }

    if (pageNumber > 0 && totalPages > 0) {
        outString = outString + '<ul class = "pagination mtm mb pull-right" >';
        if (pageNumber == 1) {
            outString = outString + '<li class="disabled"><a>&lt;</a></li>';
        } else {
            outString = outString + '<li><a onclick="' + getFunc + '(' + (pageNumber - 1) + ')">&lt;</a></li>';
            if (pageNumber >= 3 && totalPages >= 5) {
                outString = outString + '<li><a onclick="' + getFunc + '(' + 1 + ')">1</a></li>';
            }
        }
        if (pageNumber > 3 && totalPages > 5) {
            outString = outString + '<li><a href="#">...</a></li>';
        }
        if ((totalPages - pageNumber) < 2 && pageNumber > 2) {
            if ((totalPages == pageNumber) && pageNumber > 3) {
                outString = outString + '<li><a onclick="' + getFunc + '(' + (pageNumber - 3) + ')">' + (pageNumber - 3) + '</a></li>';
            }
            outString = outString + '<li><a onclick="' + getFunc + '(' + (pageNumber - 2) + ')">' + (pageNumber - 2) + '</a></li>';
        }
        if (pageNumber > 1) {
            outString = outString + '<li><a onclick="' + getFunc + '(' + (pageNumber - 1) + ')">' + (pageNumber - 1) + '</a></li>';
        }
        outString = outString + '<li class="active"><a onclick="' + getFunc + '(' + pageNumber + ')">' + pageNumber + '</a></li>';
        if ((totalPages - pageNumber) >= 1) {
            outString = outString + '<li><a onclick="' + getFunc + '(' + (pageNumber + 1) + ')">' + (pageNumber + 1) + '</a></li>';
        }
        if (pageNumber < 3) {
            if ((pageNumber + 2) < totalPages) {
                outString = outString + '<li><a onclick="' + getFunc + '(' + (pageNumber + 2) + ')">' + (pageNumber + 2) + '</a></li>';
            }
            if ((pageNumber < 2) && (pageNumber + 3 < totalPages)) {
                outString = outString + '<li><a onclick="' + getFunc + '(' + (pageNumber + 3) + ')">' + (pageNumber + 3) + '</a></li>';
            }
        }
        if ((totalPages - pageNumber) >= 3 && totalPages > 5) {
            outString = outString + '<li><a>...</a></li>';
        }

        if (pageNumber == totalPages) {
            outString = outString + '<li class="disabled"><a >&gt;</a></li>';
        } else {
            if ((totalPages - pageNumber) >= 2) {
                outString = outString + '<li><a onclick="' + getFunc + '(' + totalPages + ')">' + totalPages + '</a></li>';
            }
            outString = outString + '<li><a onclick="' + getFunc + '(' + (pageNumber + 1) + ')">&gt;</a></li>';
        }

        outString = outString + '<span class="">&nbsp;到第&nbsp;' +
        '<input type="hidden" id="pageNumber2" name="pageNumber" value="1"/>' +
        '<input type="number" id="pageNumberInput2" value=' + pageNumberInput + ' min="1">&nbsp;&nbsp;页&nbsp;&nbsp;' +
        '<a type="submit" id="" class="btn btn-default" onclick="pagerTurn(' + getFunc + ')">确定</a>' +
        '</span>' +
        '</ul>'
    }

    return outString;
}

function pagerTurn(getFunc) {
    var pageNumber = $('#pageNumberInput2').val();
    getFunc(pageNumber);
}
