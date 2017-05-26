/**
 * Created by 如川 on 2016/3/17.
 */

var pathname = window.location.pathname;
var arr = pathname.split("/");
var proName = arr[1];

document.write("<script type='text/javascript' language='text/javascript' src='http://" + window.location.host + "/" + proName + "/view/js/dept-catalog-resource/dept-catalog-comm.js'></script>");
document.write("<script type='text/javascript' language='text/javascript' src='http://" + window.location.host + "/" + proName + "/view/js/dept-catalog-resource/dept-catalog-struct.js'></script>");
document.write("<script type='text/javascript' language='text/javascript' src='http://" + window.location.host + "/" + proName + "/view/js/dept-catalog-resource/dept-catalog-odps.js'></script>");
document.write("<script type='text/javascript' language='text/javascript' src='http://" + window.location.host + "/" + proName + "/view/js/dept-catalog-resource/dept-catalog-dataapi.js'></script>");
document.write("<script type='text/javascript' language='text/javascript' src='http://" + window.location.host + "/" + proName + "/view/js/dept-catalog-resource/dept-catalog-rds.js'></script>");
document.write("<script type='text/javascript' language='text/javascript' src='http://" + window.location.host + "/" + proName + "/view/js/dept-catalog-resource/dept-catalog-onlineurl.js'></script>");
document.write("<script type='text/javascript' language='text/javascript' src='http://" + window.location.host + "/" + proName + "/view/js/dept-catalog-resource/dept-catalog-virtual.js'></script>");
document.write("<script type='text/javascript' language='text/javascript' src='http://" + window.location.host + "/" + proName + "/view/js/dept-catalog-resource/dept-catalog-datasource.js'></script>");
document.write("<script type='text/javascript' language='text/javascript' src='http://" + window.location.host + "/" + proName + "/view/js/dept-catalog-resource/dept-catalog-update.js'></script>");

var Module = {};

Module.BASE = 0;
Module.ODPS = 1;
Module.RDS = 2;
Module.ONLINEURL = 3;
Module.DATAAPI = 4;
Module.STRUCTFILE = 5;
Module.COMMFILE = 6;
Module.VIRTUAL = 7;
Module.MAX = 8;

var Flag = {
    NEGATIVE: 0,
    POSITIVE: 1
};


ExtraCatalog = {

    _renderFunc: [],
    _getFunc: [],
    _initFunc: [],
    _checkFunc: [],


    regGetData: function (type, param) {
        if (type <= Module.BASE || type >= Module.MAX)
            return;
        else
            this._getFunc[type] = param;
    },

    getExtraData: function (type) {
        if (type <= Module.BASE || type >= Module.MAX)
            return;
        else
            return this._getFunc[type].apply(window, null);
    },

    regInit: function (type, param) {
        if (type <= Module.BASE || type >= Module.MAX)
            return;
        else
            this._initFunc[type] = param;
    },

    init: function (type, bool) {
        if (type <= Module.BASE || type >= Module.MAX)
            return;
        else
            return this._initFunc[type].apply(window, Array.prototype.slice.call(arguments, 1));

    },

    regRender: function (type, param) {
        if (type <= Module.BASE || type >= Module.MAX)
            return;
        else
            this._renderFunc[type] = param;
    },

    render: function (type, catalog) {
        if (type <= Module.BASE || type >= Module.MAX)
            return;
        else
            return this._renderFunc[type].apply(window, Array.prototype.slice.call(arguments, 1));
    },


    regCheck: function (type, param) {
        if (type <= Module.BASE || type >= Module.MAX)
            return;
        else
            this._checkFunc[type] = param;
    },

    check: function (type) {
        if (type <= Module.BASE || type >= Module.MAX)
            return;
        else
            return this._checkFunc[type].apply(window, null);
    }


}
