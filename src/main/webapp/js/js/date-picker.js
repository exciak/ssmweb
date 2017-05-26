var datePicker = (function($){
    $(function(){
        var $datePickerField = $(".date-picker-field > input[type='text']"),
            $startTime = $("#startTime"),
            $endTime = $("#endTime");

        pickDate($startTime);
        $startTime.datetimepicker().on('changeDate', function() {
            $endTime.datetimepicker('setStartDate', $startTime.val());
        });

        pickDate($endTime);
        $endTime.datetimepicker().on('changeDate', function() {
            $startTime.datetimepicker('setEndDate', $endTime.val());
        });

        pickDate($datePickerField);

        var startTime = $startTime.val();
        if (startTime != "") {
           $endTime.datetimepicker('setStartDate', startTime);
        }
        var endTime = $endTime.val();
        if (endTime != "") {
            $startTime.datetimepicker('setEndDate', endTime);
        }

        function pickDate(ele) {
            ele.datetimepicker({
                language:  'zh-CN',
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0
            });
        };

    });
})(jQuery);