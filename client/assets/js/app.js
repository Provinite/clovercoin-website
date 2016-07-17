$(document).foundation();
$('.full-spread-menu > div').each(function() {
    $(this).click(function() {
        if ($(this).data('href')) {
            if ($(this).data('target') == '_blank') {
                window.open($(this).data('href'));
            } else {
                window.top.location.href = $(this).data('href');
            }
        }
    });
});
