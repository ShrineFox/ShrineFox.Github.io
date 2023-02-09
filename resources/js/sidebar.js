$(document).ready(function () {
    $('.menu-button').click(function () {
        $('#sidebar').addClass('show');
    });

    $('.close').click(function () {
        $('#sidebar').removeClass('show');
    });
});
