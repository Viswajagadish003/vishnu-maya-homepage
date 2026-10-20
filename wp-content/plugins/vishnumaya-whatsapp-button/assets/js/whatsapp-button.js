/**
 * Vishnumaya WhatsApp Chat Button - Frontend JS
 */

(function() {
    'use strict';

    function initWhatsAppButton() {
        var wrap = document.querySelector('.vmw-whatsapp-wrap');
        if (!wrap) return;

        // 1. Move WhatsApp button directly to document.body FIRST so it is safely outside any broken footer tags
        if (wrap.parentElement && wrap.parentElement !== document.body) {
            document.body.appendChild(wrap);
        }

        // 2. Remove ONLY the leaked anchor element containing the blue script text
        try {
            var leakedLink = document.querySelector('a.badge-base__link');
            if (leakedLink && leakedLink !== wrap) {
                leakedLink.remove();
            }
        } catch(err) {}

        var phone = wrap.getAttribute('data-phone') || '';
        var message = wrap.getAttribute('data-message') || '';

        // Clean phone number (digits only)
        var cleanPhone = phone.replace(/[^0-9]/g, '');

        // Determine if mobile device
        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 768);

        // Build target URL
        var encodedMsg = encodeURIComponent(message);
        var targetUrl = '';

        if (isMobile) {
            targetUrl = 'https://api.whatsapp.com/send?phone=' + cleanPhone + '&text=' + encodedMsg;
        } else {
            targetUrl = 'https://web.whatsapp.com/send?phone=' + cleanPhone + '&text=' + encodedMsg;
        }

        wrap.setAttribute('href', targetUrl);

        // Click handler to fire custom tracking events
        wrap.addEventListener('click', function(e) {
            // Dispatch standard custom event for Google Tag Manager / Analytics
            try {
                window.dispatchEvent(new CustomEvent('vishnumaya_whatsapp_click', {
                    detail: {
                        phone: cleanPhone,
                        timestamp: new Date().toISOString()
                    }
                }));

                // Support for Google Analytics 4 if available
                if (typeof gtag === 'function') {
                    gtag('event', 'whatsapp_chat_click', {
                        event_category: 'Engagement',
                        event_label: 'Vishnumaya WhatsApp Floating Button'
                    });
                }
            } catch (err) {
                // Ignore analytics errors
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhatsAppButton);
    } else {
        initWhatsAppButton();
    }
})();
