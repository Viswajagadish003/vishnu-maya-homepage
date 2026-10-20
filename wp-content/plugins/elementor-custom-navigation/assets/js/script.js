/**
 * Elementor Custom Navigation Menu Script
 * Robust Mobile Drawer, Backdrop Overlay, Accordion Submenus, and Desktop Overflow Handlers
 */
(function() {
    function isMobileMode(container) {
        if (!container) return window.innerWidth < 1025;
        var toggle = container.querySelector(".ecn-nav-mobile-toggle");
        if (toggle) {
            return window.getComputedStyle(toggle).display !== "none";
        }
        return window.innerWidth < 768;
    }

    function ecn_close_all_drawers() {
        var openMenus = document.querySelectorAll(".ecn-custom-nav-menu.ecn-mobile-open");
        openMenus.forEach(function(menu) {
            menu.classList.remove("ecn-mobile-open");
        });

        var activeOverlays = document.querySelectorAll(".ecn-mobile-overlay.ecn-active");
        activeOverlays.forEach(function(overlay) {
            overlay.classList.remove("ecn-active");
        });

        document.body.classList.remove("ecn-body-locked");
    }

    function ecn_init_menu() {
        var containers = document.querySelectorAll(".ecn-nav-menu-container");

        containers.forEach(function(container) {
            var menu = container.querySelector(".ecn-custom-nav-menu");
            if (!menu) return;

            // Self-healing: Ensure overlay exists
            var overlay = container.querySelector(".ecn-mobile-overlay");
            if (!overlay) {
                overlay = document.createElement("div");
                overlay.className = "ecn-mobile-overlay";
                container.appendChild(overlay);
            }

            // Self-healing: Ensure close button exists in drawer header
            var drawerHeader = menu.querySelector(".ecn-mobile-drawer-header");
            if (!drawerHeader) {
                drawerHeader = document.createElement("li");
                drawerHeader.className = "ecn-mobile-drawer-header";
                drawerHeader.innerHTML = '<div class="ecn-drawer-title">vishnumayadirect</div><button type="button" class="ecn-mobile-close-btn" aria-label="Close menu">&times;</button>';
                menu.insertBefore(drawerHeader, menu.firstChild);
            } else {
                var drawerTitle = drawerHeader.querySelector(".ecn-drawer-title");
                if (drawerTitle && !drawerTitle.textContent.trim()) {
                    drawerTitle.textContent = "vishnumayadirect";
                }
                var closeBtn = drawerHeader.querySelector(".ecn-mobile-close-btn");
                if (!closeBtn) {
                    closeBtn = document.createElement("button");
                    closeBtn.type = "button";
                    closeBtn.className = "ecn-mobile-close-btn";
                    closeBtn.setAttribute("aria-label", "Close menu");
                    closeBtn.innerHTML = "&times;";
                    drawerHeader.appendChild(closeBtn);
                }
            }

            // Mobile Toggle Click Handler
            var toggle = container.querySelector(".ecn-nav-mobile-toggle");
            if (toggle) {
                var newToggle = toggle.cloneNode(true);
                toggle.replaceWith(newToggle);
                toggle = newToggle;

                toggle.addEventListener("click", function(e) {
                    e.stopPropagation();
                    var isOpen = menu.classList.contains("ecn-mobile-open");
                    if (isOpen) {
                        menu.classList.remove("ecn-mobile-open");
                        if (overlay) overlay.classList.remove("ecn-active");
                        document.body.classList.remove("ecn-body-locked");
                    } else {
                        // Close any open submenus on drawer open so submenus are never open by default
                        var openSubmenus = menu.querySelectorAll(".ecn-submenu-open");
                        openSubmenus.forEach(function(item) {
                            item.classList.remove("ecn-submenu-open");
                        });
                        menu.classList.add("ecn-mobile-open");
                        if (overlay) overlay.classList.add("ecn-active");
                        document.body.classList.add("ecn-body-locked");
                        // Reset scroll position to top
                        menu.scrollTop = 0;
                    }
                });
            }

            // Close Button Click Handler
            var closeBtn = menu.querySelector(".ecn-mobile-close-btn");
            if (closeBtn) {
                var newCloseBtn = closeBtn.cloneNode(true);
                closeBtn.replaceWith(newCloseBtn);
                closeBtn = newCloseBtn;

                closeBtn.addEventListener("click", function(e) {
                    e.stopPropagation();
                    ecn_close_all_drawers();
                });
            }

            // Overlay Click Handler
            if (overlay) {
                var newOverlay = overlay.cloneNode(true);
                overlay.replaceWith(newOverlay);
                overlay = newOverlay;

                overlay.addEventListener("click", function(e) {
                    e.stopPropagation();
                    ecn_close_all_drawers();
                });
            }

            // Handle Submenu Accordion on Mobile / Drawer
            var parentLinks = menu.querySelectorAll(".has-ecn-submenu > a");
            parentLinks.forEach(function(item) {
                var newItem = item.cloneNode(true);
                item.replaceWith(newItem);
                item = newItem;

                item.addEventListener("click", function(e) {
                    if (isMobileMode(container)) {
                        e.preventDefault();
                        e.stopPropagation();
                        var parentLi = this.closest("li");
                        if (parentLi) {
                            var wasOpen = parentLi.classList.contains("ecn-submenu-open");
                            // Accordion mode: close other open submenus so drawer stays compact
                            var openSiblings = menu.querySelectorAll(".has-ecn-submenu.ecn-submenu-open");
                            openSiblings.forEach(function(sib) {
                                if (sib !== parentLi) sib.classList.remove("ecn-submenu-open");
                            });
                            if (!wasOpen) {
                                parentLi.classList.add("ecn-submenu-open");
                            } else {
                                parentLi.classList.remove("ecn-submenu-open");
                            }
                        }
                    }
                });
            });

            // Close drawer when clicking normal links inside drawer (e.g. navigation or CTA)
            var regularLinks = menu.querySelectorAll("li:not(.has-ecn-submenu):not(.ecn-mobile-drawer-header) a");
            regularLinks.forEach(function(link) {
                link.addEventListener("click", function() {
                    if (isMobileMode(container)) {
                        setTimeout(ecn_close_all_drawers, 200);
                    }
                });
            });
            // Desktop submenus are positioned cleanly via CSS without JS flicker
        });
    }

    // Close on outside click (fallback)
    function ecn_close_menu_outside(e) {
        var openMenus = document.querySelectorAll(".ecn-custom-nav-menu.ecn-mobile-open");
        openMenus.forEach(function(menu) {
            var container = menu.closest(".ecn-nav-menu-container");
            if (container && !container.contains(e.target)) {
                ecn_close_all_drawers();
            }
        });
    }

    // Close on Escape key
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" || e.keyCode === 27) {
            ecn_close_all_drawers();
        }
    });

    // Close if resized to desktop
    window.addEventListener("resize", function() {
        if (window.innerWidth >= 1025) {
            ecn_close_all_drawers();
        }
    });

    document.addEventListener("click", ecn_close_menu_outside);
    document.addEventListener("DOMContentLoaded", ecn_init_menu);

    function hookElementor() {
        if (window.elementorFrontend && window.elementorFrontend.hooks) {
            elementorFrontend.hooks.addAction("frontend/element_ready/ecn_navigation_menu.default", function() {
                ecn_init_menu();
            });
        }
    }

    if (window.jQuery) {
        jQuery(window).on("elementor/frontend/init", hookElementor);
    }
    hookElementor();
    // Run periodically in Elementor preview iframe to ensure re-rendered widgets are wired up
    if (window.location.search.indexOf("elementor-preview") !== -1) {
        setInterval(ecn_init_menu, 2000);
    }
})();
