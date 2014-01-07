

ko.bindingHandlers.tooltip = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var model = ko.utils.unwrapObservable(valueAccessor());

        //use an iframe for this sample and just set the src
        $(element).append("<iframe />");

        //handle open
        ko.computed({
            read: function () {
                if (model.isOpen()) {
                    $(element).show();
                } else {
                    $(element).hide();
                }
            },
            disposeWhenNodeIsRemoved: element
        });

        //handle location
        ko.computed({
            read: function () {
                var location = model.location();
                $(element).css("top", location.top + "px").css("left", location.left + "px");
            },
            disposeWhenNodeIsRemoved: element
        });

        //handle content
        ko.computed({
            read: function () {
                var data = model.data();
                if (model.getUrlFormat && data) {
                    //if "this" is already bound, then can use first arg
                    var url = model.getUrlFormat.call(data, data);
                    $(element).find("iframe").attr("src", url);
                }
            },
            disposeWhenNodeIsRemoved: element
        });
    },
    BindingModel: function (config) {
        config = config || {};
        var self = this;
        self.data = ko.observable();
        self.isOpen = ko.observable(config.isOpen);        
        self.location = ko.observable({
            left: config.left || 0,
            top: config.top || 0
        });
        self.getUrlFormat = config.urlFormatter;

        self.open = function (data, top, left) {
            var tooltip = $('#tooltipframe');
            if (tooltip.css('visibility')=='hidden') {
                tooltip.attr("src", data).css('left', left + 40 + 'px').css('top', top - 150 + 'px').css('visibility', 'visible');
            }            
        };

        self.close = function () {
            var tooltip = $('#tooltipframe');
            tooltip.css('visibility', 'hidden');
        };
    }
};


/*
    Represents a single Tile object model.
*/
var Tile = function (param, ui) {
    var self = this;

    this.uniqueId = param.uniqueId; // unique ID of a tile, Weather1, Weather2. Each instance must have unique ID.
    this.name = param.name; // unique name of a tile, eg Weather. 
    //this.index = ko.observable(param.index || 0); // order of tile on the screen. Calculated at run time.
    this.size = param.size || ""; // Size of the tile. eg tile-double, tile-double-vertical
    this.color = param.color || ui.tile_color;  // Color of tile. eg bg-color-blue
    this.additionalClass = param.additionalClass || ""; // Some additional class if you want to pass to further customize the tile
    this.tileImage = param.tileImage || ""; // Tile background image that fills the tile.

    this.cssSrc = param.cssSrc || [];   // CSS files to load at runtime.
    this.scriptSrc = param.scriptSrc || []; // Javascript files to load at runtime.
    this.initFunc = param.initFunc || ""; // After loading javascript, which function to call.
    this.initParams = param.initParams || {}; // Parameters to pass to the initial function.
    this.slidesFrom = param.slidesFrom || []; // HTML pages to load and inject as slides inside the tiles that rotate.

    this.appTitle = param.appTitle || ""; // Title of the application when launched by clicking on tile.
    this.appUrl = param.appUrl || "";   // URL of the application to launch.
    this.appInNewWindow = param.appInNewWindow || false; // To load the app on new browser window outside the Dashboard.

    this.iconStyle = param.iconStyle || ui.tile_icon_size; // Tile icon size.
    this.iconAdditionalClass = param.iconAdditionalClass || ""; // Additional class for the tile icon.
    this.iconSrc = param.iconSrc || ui.tile_icon_src; // Icon url
    this.appIcon = param.appIcon || this.iconSrc; // Icon to show when full screen app being launched.

    this.label = ko.observable(param.label || ""); // Bottom left label 
    this.counter = ko.observable(param.counter || ""); // Bottom right counter
    this.subContent = ko.observable(param.subContent || ""); // Content that comes up when mouse hover
    this.subContentColor = param.subContentColor || ui.tile_subContent_color; // Color for content

    this.slides = ko.observableArray(param.slides || []); // Tile content that rotates. Collection of html strings.

    this.tileClasses = ko.computed(function () {
        return [ui.tile,
            this.size,
            this.color,
            this.additionalClass,
            (this.slides().length > 0 ? ui.tile_multi_content : "")].join(" ");
        ;
    }, this);

    this.helpurl = param.helpurl || "";

    this.hasIcon = ko.computed(function () {
        return this.iconSrc.length > 0;
    }, this);

    this.iconClasses = ko.computed(function () {
        return [this.iconStyle, this.iconAdditionalClass].join(" ");
    }, this);

    this.hasLabel = ko.computed(function () {
        return this.label().length > 0;
    }, this);

    this.hasCounter = ko.computed(function () {
        return this.counter().length > 0;
    }, this);

    this.hasSubContent = ko.computed(function () {
        return this.subContent().length > 0;
    }, this);

    this.subContentClasses = ko.computed(function () {
        return [ui.tile_content_sub, this.subContentColor].join(" ");
    }, this);

    this.init = function (div) {
        if ($(div).data("tile_initialized") !== true)
            $(div).data("tile_initialized", true);
        else
            return;

        // If tile has css to load, then load all CSS.
        if (_.isArray(self.cssSrc)) {
            var head = $('head');

            // This needs to be exactly like this to work in IE 8.
            _.each(self.cssSrc, function (url) {
                $("<link>")
                  .appendTo(head)
                  .attr({ type: 'text/css', rel: 'stylesheet' })
                  .attr('href', url);
            });
        }

        // If tile has a collection of html pages as slides, then load them
        // and inject them inside tile so that they rotate.
        if (!_.isEmpty(self.slidesFrom)) {
            $.get((_.isArray(self.slidesFrom) ? self.slidesFrom : [self.slidesFrom]),
                function (slides) {
                    _.each(slides, function (slide) {
                        self.slides.push(slide);
                    });

                    // After loading the htmls, load the JS so that they
                    // can use the html elements.
                    self.loadScripts(div);
                });
        }
        else {
            self.loadScripts(div);
        }
    }

    // Loads the javascripts on a tile dynamically. Called from .attach()
    this.loadScripts = function (div) {
        if (!_.isEmpty(self.scriptSrc)) {
            $.getScript(self.scriptSrc, function () {
                if (!_.isEmpty(self.initFunc)) {
                    var func = eval(self.initFunc);
                    if (_.isFunction(func))
                        func(self, div, self.initParams);
                    else {
                        //console.log("Not a function: " + self.initFunc);
                    }
                }
            })
        }
    }

    this.click = function () {
        
    }

    this.disabled = "false";

    if (typeof param.disabled != 'undefined')
        this.disabled = param.disabled;

    self.tipModel = new ko.bindingHandlers.tooltip.BindingModel({ urlFormatter: self.helpurl });
};

/*
    Section holds a collection of tiles. Each group of tiles you see
    huddled together on screen, are sections.
*/
var Section = function (section) {
    var self = this;

    this.name = ko.observable(section.name); // Name of a section. Can be used to show some title over section.
    this.uniqueId = ko.observable(section.uniqueId);//_.uniqueId('section_'); // Unique ID generated at runtime and stored on the section Div.

    this.tiles = ko.observableArray(section.tiles);

    // Get a tile inside the section
    this.getTile = function(uniqueId) {
        return ko.utils.arrayFirst(self.tiles(), function(tile) {
            return tile.uniqueId == uniqueId;
        });
    }

    // Add a new tile at the end of the section
    this.addTile = function (tile) {
        self.tiles.push(tile);
        _.defer(function () {
            tile.attach($('#' + tile.uniqueId));
        });
    }

    this.getCSS = (section.name == "Reports") ? "metro-section-reports" : "metro-section-small";
    
    this.sectionClasses = ko.computed(function () {
        return ["metro-section-title",
               viewModel.title() != "Favorites" ? "":
                  section.name == "Reports" ? "": "context-menu-one menu-1"].join(" ");
    }, this);
    
};
