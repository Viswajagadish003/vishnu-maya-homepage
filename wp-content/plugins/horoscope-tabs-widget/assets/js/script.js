(function($) {
    'use strict';

    var WidgetHoroscopeTabsHandler = function( $scope, $ ) {
        
        var $tabs = $scope.find('.ht-tab-item');
        var $panes = $scope.find('.ht-tab-pane');
        
        $tabs.on('click', function() {
            var $this = $(this);
            var index = $this.data('tab-index');
            var $wrapper = $this.closest('.ht-tabs-wrapper');
            
            // Remove active class from all tabs and panes in this widget
            $wrapper.find('.ht-tab-item').removeClass('active');
            $wrapper.find('.ht-tab-pane').removeClass('active');
            
            // Add active class to clicked tab and corresponding pane
            $this.addClass('active');
            $wrapper.find('.ht-tab-pane[data-tab-pane="' + index + '"]').addClass('active');
        });

    };

    // Make sure you run this code under Elementor.
    $( window ).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/horoscope_tabs.default', WidgetHoroscopeTabsHandler );
    } );
    
})(jQuery);
