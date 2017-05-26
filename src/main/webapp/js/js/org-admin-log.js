/**
 * Created by zlx on 2015/8/3.
 */


$(document).ready(function () {
    $('#btn_clear').click(function(){
        $('#inputFilterDescription').val("");
        $('#inputFilterCreator').val("");
        $('#startTime').val("");
        $('#endTime').val("");
        $("#startTime").datetimepicker('setEndDate', null);
        $("#endTime").datetimepicker('setStartDate', null);
    });
});