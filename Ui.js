// Configuration of UI elements for the Dashboard and all the UI behaviors including
// drag & drop, clicking on tile, launch app, in tile behavior etc. Basically all jQuery
// stuff.
var ui = {
    subcontent_height: 50,
    metro_sections_selector: '.metro-sections',
    metro_section_selector: '.metro-section',
    metro_section: 'metro-section',
    hover_metro_section: 'hover-metro-section',
    metro_section_overflow: 'metro-section-overflow',
    app_iframe_id: 'app_iframe',
    app_iframe_zindex: 60000,
    navbar: '#navbar',
    navbar_zindex: '60001',
    tile: 'tile',
    tile_content_main_selector: '.tile-content-main',
    tile_selector: '.tile',
    tile_color: 'bg-color-blue',
    tile_icon_size: 'tile-icon-large',
    tile_icon_src: 'img/update.png',
    tile_subContent_color: 'bg-color-blueDark',
    tile_multi_content_selector: '.tile-multi-content',
    tile_multi_content: 'tile-multi-content',
    tile_content_slide_delay: 5000,
    tile_content_sub_selector: '.tile-content-sub',
    tile_content_sub: 'tile-content-sub',
    trash: '#trash',
    position_cookie: 'tiles',
    splash_screen_zindex: 65000,
    splash_screen_icon_class: 'tile-icon-large',
    signin_splash_color: 'bg-color-green',
    signin_splash_icon: 'img/User No-Frame.png',
    settings_splash_color: 'bg-color-purple',
    settings_splash_icon: 'img/configure.png',
    appStore_splash_color: 'bg-color-blue',
    appStore_splash_icon: 'img/App Store.png',
    anon_first_name: 'John',
    anon_last_name: 'Anonymous',
    anon_photo: 'img/User No-Frame.png',

    login_page: "ServerStuff/Login.aspx",
    logout_page: "ServerStuff/Logout.ashx",
    settings_page: "ServerStuff/Settings.aspx",

    appRunning: false,
    currentApp: "",

    /*
        Go through all the sections and tiles and hook the dynamic
        behavior to the tiles.
    */
    attachTiles: function () {
        ko.utils.arrayForEach(viewModel.sections(), function (section) {
            //ko.utils.arrayForEach(ko.utils.arrayGetDistinctValues(section.tiles()), function (tile) {
            ko.utils.arrayForEach(section.tiles(), function (tile) {
                tile.init($('#' + tile.uniqueId));
                ui.attach(tile);
            });
        });
    },

    /*
        Attach the Tile DIV to a single Tile object and provide all the UI behaviors
        like click, mouse over etc.
    */
    attach: function (tile) {
        var el = $('#' + tile.uniqueId);
        //el.unbind("mouseenter mouseleave click");

        //el.mouseenter(function () {
        //    el = $(this);
            
        //    if (el.hasClass(ui.tile_multi_content_selector)) {
        //        var c_sub = $(ui.tile_content_sub, el);
        //        c_sub.animate({ "height": ui.subcontent_height, "opacity": 1 }, 200);
        //    }
                      
        //})
        //.mouseleave(function () {
        //    el = $(this);
        //    if (el.hasClass(ui.tile_multi_content_selector)) {
        //        var c_sub = $(ui.tile_content_sub_selector, el);
        //        c_sub.animate({ "height": 0, "opacity": 0 }, 200);
        //    }
        //});
        


        //el.find("a.metro-tile-link").click(function (event) {
        //    $(this).parent().click();
        //});
        // On click, launch the app either inside dashboard or in a new browser tab
        //el.find("a.metro-tile-link").click(function (event) {
        el.click(function (event) {
            // Drag & drop just happened. Prevent incorrect click event.
            if ($(this).parent().data("noclick") == true)
                return;

            // If the item clicked on the tile is a link or inside a link, don't
            // lauch app. Let browser do the hyperlink click behavior.
            /*if (event.target.tagName == "A" ||
                !$(event.target).closest("a").hasClass("metro-tile-link"))
                return;*/

            if (!_.isEmpty(tile.appUrl)) {

                // Open app in new browser window. Not all websites like IFRAMEing.
                if (tile.appInNewWindow) {
                    var open_link = window.open('', '_blank');
                    open_link.location = tile.appUrl;
                }
                else {
                    // Make the tile div explode into full screen
                    window.location.href = tile.appUrl;
                    //ui.hideAllIframes();

                    //var clone = $("<div/>")
                    //    .addClass(tile.tileClasses())
                    //    .css({
                    //        'position': 'absolute',
                    //        'left': el.offset().left,
                    //        'top': el.offset().top,
                    //        'width': el.width() + "px",
                    //        'height': el.height() + "px",
                    //        'z-index': ui.splash_screen_zindex
                    //    })
                    //    .appendTo(document.body)
                    //    .animate({
                    //        left: $(window).scrollLeft(),
                    //        top: $(window).scrollTop(),
                    //        width: "100%",
                    //        height: "100%"
                    //    }, 500, function () {
                    //        // Launch the full screen app inside an IFRAME. ViewModel has
                    //        // this feature.
                    //        ui.launchApp(tile.name, tile.appTitle, tile.appUrl, function () {
                    //            clone.fadeOut();
                    //            ui.restoreAllIframes();
                    //        });
                    //    })
                    //    .append(
                    //        $('<img />')
                    //            .attr('src', tile.appIcon)
                    //            .addClass(tile.iconClasses())
                    //            .css({
                    //                'position': 'absolute',
                    //                'left': ($(window).width() - 512) / 2,
                    //                'top': ($(window).height() - 512) / 2
                    //            })
                    //    );

                }
            }
        });
    },

    /*
        Hide all sections and tiles.
    */
    hideMetroSections: function () {
        $(ui.metro_sections_selector).hide();
    },

    /*
        Transition sections and tiles into view
    */
    showMetroSections: function (callback) {

        $(ui.metro_sections_selector)
            .css({
                'margin-left': 50,
                'margin-top': 20,
                'opacity': 0
            })
            .show()
            .animate({
                'margin-left': 0,
                'opacity': 1
            }, 500, 'swing', callback);
    },

    /*
        Hide all iframe on the screen so that fullscreen DIVs can appear
        without having IFRAMEs peeking through them.
    */
    hideAllIframes: function () {
        $("iframe:visible")
                .hide()
                .data("hidden_during_launch", true);

    },

    /*
        Restore visibility of the iframes that were hidden by calling hideAllIFrame
    */
    restoreAllIframes: function () {
        $("iframe:hidden").each(function (index, iframe) {
            if ($(iframe).data("hidden_during_launch") == true) {
                $(iframe)
                    .show()
                    .data("hidden_during_launch", false);
            }
        });
    },

    /*
        Launch a full screen app. It creates a full screen IFRAME to host the appUrl.
    */
    launchApp: function (id, title, url, loaded) {

        ui.hideMetroSections();

        ui.appRunning = true;
        ui.currentApp = url;

        var iframe = $('<iframe id="' + ui.app_iframe_id + '" frameborder="no" />')
           .css({
               'position': 'absolute',
               'left': "0",
               'top': "0px",
               'width': '100%',
               'height': '100%',
               'z-index': ui.app_iframe_zindex,
               'visibility': 'hidden',
               'background-color': 'white'
           })
           .appendTo(document.body)
           .attr({ 'src': url })
           .load(function () {
               ui.hideNavBar();
               loaded();
               $(this).css('visibility', 'visible');
           });


        location.hash = id;
    },

    /*
        Closes the fullscreen app.
    */
    closeApp: function () {
        $('#' + ui.app_iframe_id).remove();
        ui.showNavBar();

        this.appRunning = false;
        this.currentApp = "";

        ui.showMetroSections(function () { });

        location.hash = "";
    },

    /*
        Hide the top nav bar and keep a small part visible so that when user hovers
        or clicks on that part, the whole nav bar appears.
    */
    hideNavBar: function () {
        var navbar = $(ui.navbar);
        navbar
            .css("z-index", ui.navbar_zindex)
            .delay(3000)
            .animate({
                top: -(navbar.height() - 5) + "px"
            }, function () {
                $('#navbar').tooltip('show');
                _.delay(function () {
                    $('#navbar').tooltip('hide');
                }, 10000);
            }).bind("mouseenter click", function () {
                navbar
                    .stop(true, true)
                    .animate({
                        top: "0px"
                    });
            }).bind("mouseleave", function () {
                navbar
                    .stop(true, true)
                    .delay(3000)
                    .animate({
                        top: -(navbar.height() - 5) + "px"
                    });
            });
    },

    showNavBar: function () {
        var navbar = $(ui.navbar);
        navbar
            .unbind("mouseenter mouseleave")
            .animate({
                top: "0px"
            });
    },

    fullscreenAppClosed: function () {
        ui.showMetroSections(function () { });
    },

    /*
        Tiles can have multiple slides in them. This will run a timer to slide
        through the slides.
    */
    animateTiles: function () {
        //ui.animateTilesOneAfterAnother();
        ui.animateTilesAllAtOnce();
    },

    animateTilesOneAfterAnother: function () {
        window.clearInterval(ui.timerId);
        window.lastTileIndex = 0;
        ui.timerId = window.setInterval(function () {
            var tilesWithSlides = $(ui.tile_selector).has(ui.tile_content_main_selector);
            if (window.lastTileIndex == tilesWithSlides.length)
                window.lastTileIndex = 0;

            if (tilesWithSlides.length > window.lastTileIndex) {
                var el = $(tilesWithSlides[window.lastTileIndex]);
                window.lastTileIndex++;
                var slides = $(ui.tile_content_main_selector, el);
                if (slides.length > 0) {
                    var slideIndex = el.data("slideIndex") || 1;
                    if (slideIndex == slides.length) {
                        slideIndex = 0;
                    }
                    var firstPage = slides.first();
                    firstPage.animate({ marginTop: -(slideIndex * firstPage.height()) }, 500);
                    el.data("slideIndex", ++slideIndex);
                }
            }
        }, ui.tile_content_slide_delay);
    },

    animateTilesAllAtOnce: function () {
        window.clearInterval(ui.timerId);
        window.lastTileIndex = 0;
        ui.timerId = window.setInterval(function () {
            $(ui.tile_selector).each(function (index, tile) {
                var el = $(tile);
                var slides = $(ui.tile_content_main_selector, el);
                if (slides.length > 0) {
                    var slideIndex = el.data("slideIndex") || 1;
                    if (slideIndex == slides.length) {
                        slideIndex = 0;
                    }
                    var firstPage = slides.first();
                    firstPage.animate({ marginTop: -(slideIndex * firstPage.height()) }, 500);
                    el.data("slideIndex", ++slideIndex);
                }
            });
        }, ui.tile_content_slide_delay);
    },

    /*
        Animate a full screen splash
    */
    splashScreen: function (colorClass, icon, complete) {
        ui.hideAllIframes();

        return $("<div/>")
            .addClass(colorClass)
            .css({
                'position': 'absolute',
                'left': -($(window).width() / 4) + 'px',
                'top': $(window).height() / 4,
                'width': $(window).width() / 4 + 'px',
                'height': $(window).height() / 4 + 'px',
                'z-index': ui.splash_screen_zindex,
                'opacity': 0.3
            })
            .appendTo(document.body)
            .animate({
                left: '50px',
                top: '50px',
                'width': $(window).width() - 100 + 'px',
                'height': $(window).height() - 100 + 'px',
                'opacity': 1.0
            }, 500, function () {
                $(this).animate({
                    left: '0px',
                    top: '0px',
                    width: '100%',
                    height: '100%'
                }, 500, function () {
                    complete($(this));
                    ui.restoreAllIframes();
                });
            })
            .append(
                $('<img />')
                    .attr('src', icon)
                    .addClass(ui.splash_screen_icon_class)
                    .css({
                        'position': 'absolute',
                        'left': ($(window).width() - 512) / 2,
                        'top': ($(window).height() - 512) / 2
                    })
            );
    },

    login: function () {
        ui.splashScreen(ui.signin_splash_color, ui.signin_splash_icon, function (div) {
            ui.launchApp("Login", "Login", ui.login_page, function () {
                div.fadeOut();
            });
        });
    },

    logout: function () {
        ui.splashScreen(ui.signin_splash_color, ui.signin_splash_icon, function (div) {
            ui.launchApp("Logout", "Logout", ui.logout_page, function () {
                div.fadeOut();
            });
        });
    },

    settings: function () {
        if (viewModel.user().isAnonymous)
            ui.login();
        else {
            ui.splashScreen(ui.settings_splash_color, ui.settings_splash_icon, function (div) {
                ui.launchApp("Settings", "Settings", ui.settings_page, function () {
                    div.fadeOut();
                });
            });
        }
    },

    apps: function () {
        ui.splashScreen(ui.appStore_splash_color, ui.appStore_splash_icon, function (div) {
            ui.launchApp("AppStore", "App Store", "AppStore.html", function () {
                div.fadeOut();
            });
        });
    },

    switchTheme: function (themename) {
        var classes = $("body").prop("class").split(" ");
        _.each(classes, function (c) {
            if (_.string.startsWith(c, 'theme-'))
                $("body").removeClass(c);
        });

        $("body").addClass(themename);
    },

    reload: function () {
        document.location.href = _.string.strLeft(document.location.href, '#');
    }
};
