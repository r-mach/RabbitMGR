$(document).ready(function () {
    $('#start_demo').click(function () {
        if (typeof $("#emotion input[type='radio']:checked").val() != "undefined" && typeof $("#demo input[type='radio']:checked").val() != "undefined") {
            var widthSize = Math.round(98 / $("#emotion input[type='radio']:checked").val());
            var frameHtml = "";
            for (var i = 0; i < $("#emotion input[type='radio']:checked").val(); i++) {
                frameHtml = frameHtml + '<iframe src="demo/' + $("#demo input[type='radio']:checked").val() + '" style="width: ' + widthSize + '%;border:0;height:100%;float:left;"></iframe>';
            }
            $('#body-id').html(frameHtml);
        }
    });
});