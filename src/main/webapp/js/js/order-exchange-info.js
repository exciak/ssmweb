/**
 * Created by Administrator on 2015/8/13.
 */

$(document).ready(function () {
    var paraJSON = $("#whereParams").val();
    if (paraJSON == null) {
        return;
    }
    var whereParams = jQuery.parseJSON(paraJSON);
    $.each(whereParams, function (key, value) {
        for (var i = 0; i < value.length; i++) {
            var tableArrayP = value[i];

            var values = "";
            var type = "";
            if (key == "datetimes") {
                values = "$" + tableArrayP.source + ".format(\"" + tableArrayP.format + "\")" + tableArrayP.offset;
                type = "datetime";
            } else if (key == "enums") {
                if (tableArrayP.values.length > 0) {
                    values = JSON.stringify(tableArrayP.values);
                }
                type = "enum";
            }
            var newRow = '<tr> <td align="center">' + tableArrayP.name + '</td>' +
                '<td align="center">' + type + '</td>' +
                '<td align="center">' + values + '</td></tr>';
            $("#paramTable").append(newRow);
        }
    });
})