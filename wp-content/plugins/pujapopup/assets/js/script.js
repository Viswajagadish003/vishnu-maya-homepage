jQuery(document).ready(function($) {
    $('.pujapopup-card').on('click', function() {
        var id = $(this).data('id');
        if (typeof pujapopupData !== 'undefined' && pujapopupData[id]) {
            var data = pujapopupData[id];
            
            var html = '';
            
            if (data.heading) {
                html += '<h4>' + data.heading + '</h4>';
            }
            if (data.subheading) {
                html += '<div class="pujapopup-subheading">' + data.subheading + '</div>';
            }
            if (data.para1) {
                html += '<p>' + data.para1 + '</p>';
            }
            if (data.para2) {
                html += '<p>' + data.para2 + '</p>';
            }
            
            if (data.purposes_heading) {
                html += '<h5>' + data.purposes_heading + '</h5>';
            }
            
            if (data.purposes) {
                html += '<div class="pujapopup-purposes-text">' + data.purposes + '</div>';
            }
            
            $('#pujapopup-modal-content').html(html);
            $('#pujapopup-overlay').css('display', 'flex').hide().fadeIn(200);
            $('body').css('overflow', 'hidden'); // Prevent background scrolling
        }
    });
    
    $('.pujapopup-modal-close').on('click', function() {
        $('#pujapopup-overlay').fadeOut(200);
        $('body').css('overflow', '');
    });

    $('#pujapopup-overlay').on('click', function(e) {
        if (e.target === this) {
            $(this).fadeOut(200);
            $('body').css('overflow', '');
        }
    });
});
