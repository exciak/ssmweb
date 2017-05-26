/**
 * Created by xunzhi on 2015/7/13.
 */
$(document).ready(function () {
    $(function () {
        if (window.chrome) {
            $('.banner li').css('background-size', '100% 100%');
        }
        $('.banner').unslider({
            //speed: 500,               //  The speed to animate each slide (in milliseconds)
            //delay: 300000,              //  The delay between slide animations (in milliseconds)
            //complete: function() {},  //  A function that gets called after every slide animation
            keys: true,               //  Enable keyboard (left, right) arrow shortcuts
            dots: false,               //  Display dot navigation
            fluid: true              //  Support responsive design. May break non-responsive designs
        });
    });

});