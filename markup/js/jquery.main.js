jQuery(function() {
    initTabs();
    initDropDownClasses();
    initTouchNav();
    initCustomHover();
});


// content tabs init
function initTabs() {
    jQuery('.tabset').tabset({
        tabLinks: 'a',
        autoHeight: true,
        addToParent: true,
        defaultTab: true
    });
}
// add classes on hover/touch
function initCustomHover() {
    var hoverClass = 'drop-hover';

    jQuery('.header .has-drop-down').touchHover({
        onHover: function(elem) {
            jQuery('.header').addClass(hoverClass);
        },
        onLeave: function(elem) {
            jQuery('.header').removeClass(hoverClass);
        }

    });
}
$(function(){
    jQuery('.header .box-menu h6').click( function(){
        jQuery(this).parent().find('.drop-menu').toggleClass('active-drop-menu');
    })
});


// handle dropdowns on mobile devices
function initTouchNav() {
    jQuery('.nav').each(function() {
        new TouchNav({
            navBlock: this,
            menuItems: 'li',
            menuDrop: '.drop-down'
        });
    });
}

// add classes if item has dropdown
function initDropDownClasses() {
    jQuery('.nav li').each(function() {
        var item = jQuery(this);
        var drop = item.find('.drop-down');
        var link = item.find('a').eq(0);
        if (drop.length) {
            item.addClass('has-drop-down');
            if (link.length) link.addClass('has-drop-down-a');
        }
    });
}

// mobile menu init
$(function(){
    var body = jQuery('body');
    var opener = jQuery('.header .menu-opener');
    var activeClass = 'nav-active';

    opener.on('click', function(e) {
        e.preventDefault();
        body.toggleClass(activeClass);
    });
});

/*
 * jQuery Tabs plugin
 */

;(function($, $win) {
    'use strict';

    function Tabset($holder, options) {
        this.$holder = $holder;
        this.options = options;

        this.init();
    }

    Tabset.prototype = {
        init: function() {
            this.$tabLinks = this.$holder.find(this.options.tabLinks);

            this.setStartActiveIndex();
            this.setActiveTab();

            if (this.options.autoHeight) {
                this.$tabHolder = $(this.$tabLinks.eq(0).attr(this.options.attrib)).parent();
            }

            this.makeCallback('onInit', this);
        },

        setStartActiveIndex: function() {
            var $classTargets = this.getClassTarget(this.$tabLinks);
            var $activeLink = $classTargets.filter('.' + this.options.activeClass);
            var $hashLink = this.$tabLinks.filter('[' + this.options.attrib + '="' + location.hash + '"]');
            var activeIndex;

            if (this.options.checkHash && $hashLink.length) {
                $activeLink = $hashLink;
            }

            activeIndex = $classTargets.index($activeLink);

            this.activeTabIndex = this.prevTabIndex = (activeIndex === -1 ? (this.options.defaultTab ? 0 : null) : activeIndex);
        },

        setActiveTab: function() {
            var self = this;

            this.$tabLinks.each(function(i, link) {
                var $link = $(link);
                var $classTarget = self.getClassTarget($link);
                var $tab = $($link.attr(self.options.attrib));

                if (i !== self.activeTabIndex) {
                    $classTarget.removeClass(self.options.activeClass);
                    $tab.addClass(self.options.tabHiddenClass).removeClass(self.options.activeClass);
                } else {
                    $classTarget.addClass(self.options.activeClass);
                    $tab.removeClass(self.options.tabHiddenClass).addClass(self.options.activeClass);
                }

                self.attachTabLink($link, i);
            });
        },

        attachTabLink: function($link, i) {
            var self = this;

            $link.on(this.options.event + '.tabset', function(e) {
                e.preventDefault();

                if (self.activeTabIndex === self.prevTabIndex && self.activeTabIndex !== i) {
                    self.activeTabIndex = i;
                    self.switchTabs();
                }
            });
        },

        resizeHolder: function(height) {
            var self = this;

            if (height) {
                this.$tabHolder.height(height);
                setTimeout(function() {
                    self.$tabHolder.addClass('transition');
                }, 10);
            } else {
                self.$tabHolder.removeClass('transition').height('');
            }
        },

        switchTabs: function() {
            var self = this;

            var $prevLink = this.$tabLinks.eq(this.prevTabIndex);
            var $nextLink = this.$tabLinks.eq(this.activeTabIndex);

            var $prevTab = this.getTab($prevLink);
            var $nextTab = this.getTab($nextLink);

            $prevTab.removeClass(this.options.activeClass);

            if (self.haveTabHolder()) {
                this.resizeHolder($prevTab.outerHeight());
            }

            setTimeout(function() {
                self.getClassTarget($prevLink).removeClass(self.options.activeClass);

                $prevTab.addClass(self.options.tabHiddenClass);
                $nextTab.removeClass(self.options.tabHiddenClass).addClass(self.options.activeClass);

                self.getClassTarget($nextLink).addClass(self.options.activeClass);

                if (self.haveTabHolder()) {
                    self.resizeHolder($nextTab.outerHeight());

                    setTimeout(function() {
                        self.resizeHolder();
                        self.prevTabIndex = self.activeTabIndex;
                        self.makeCallback('onChange', self);
                    }, self.options.animSpeed);
                } else {
                    self.prevTabIndex = self.activeTabIndex;
                }
            }, this.options.autoHeight ? this.options.animSpeed : 1);
        },

        getClassTarget: function($link) {
            return this.options.addToParent ? $link.parent() : $link;
        },

        getActiveTab: function() {
            return this.getTab(this.$tabLinks.eq(this.activeTabIndex));
        },

        getTab: function($link) {
            return $($link.attr(this.options.attrib));
        },

        haveTabHolder: function() {
            return this.$tabHolder && this.$tabHolder.length;
        },

        destroy: function() {
            var self = this;

            this.$tabLinks.off('.tabset').each(function() {
                var $link = $(this);

                self.getClassTarget($link).removeClass(self.options.activeClass);
                $($link.attr(self.options.attrib)).removeClass(self.options.activeClass + ' ' + self.options.tabHiddenClass);
            });

            this.$holder.removeData('Tabset');
        },

        makeCallback: function(name) {
            if (typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        }
    };

    $.fn.tabset = function(opt) {
        var args = Array.prototype.slice.call(arguments);
        var method = args[0];

        var options = $.extend({
            activeClass: 'active',
            addToParent: false,
            autoHeight: false,
            checkHash: false,
            defaultTab: true,
            animSpeed: 500,
            tabLinks: 'a',
            attrib: 'href',
            event: 'click',
            tabHiddenClass: 'js-tab-hidden'
        }, opt);
        options.autoHeight = options.autoHeight && $.support.opacity;

        return this.each(function() {
            var $holder = jQuery(this);
            var instance = $holder.data('Tabset');

            if (typeof opt === 'object' || typeof opt === 'undefined') {
                $holder.data('Tabset', new Tabset($holder, options));
            } else if (typeof method === 'string' && instance) {
                if (typeof instance[method] === 'function') {
                    args.shift();
                    instance[method].apply(instance, args);
                }
            }
        });
    };
}(jQuery, jQuery(window)));

/*
 * Mobile hover plugin
 */
;(function($){

    // detect device type
    var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
        isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);

    // define events
    var eventOn = (isTouchDevice && 'touchstart') || (isWinPhoneDevice && navigator.pointerEnabled && 'pointerdown') || (isWinPhoneDevice && navigator.msPointerEnabled && 'MSPointerDown') || 'mouseenter',
        eventOff = (isTouchDevice && 'touchend') || (isWinPhoneDevice && navigator.pointerEnabled && 'pointerup') || (isWinPhoneDevice && navigator.msPointerEnabled && 'MSPointerUp') || 'mouseleave';

    // event handlers
    var toggleOn, toggleOff, preventHandler;
    if(isTouchDevice || isWinPhoneDevice) {
        // prevent click handler
        preventHandler = function(e) {
            e.preventDefault();
        };

        // touch device handlers
        toggleOn = function(e) {
            var options = e.data, element = $(this);

            var toggleOff = function(e) {
                var target = $(e.target);
                if (!target.is(element) && !target.closest(element).length) {
                    element.removeClass(options.hoverClass);
                    element.off('click', preventHandler);
                    if(options.onLeave) options.onLeave(element);
                    $(document).off(eventOn, toggleOff);
                }
            };

            if(!element.hasClass(options.hoverClass)) {
                element.addClass(options.hoverClass);
                element.one('click', preventHandler);
                $(document).on(eventOn, toggleOff);
                if(options.onHover) options.onHover(element);
            }
        };
    } else {
        // desktop browser handlers
        toggleOn = function(e) {
            var options = e.data, element = $(this);
            element.addClass(options.hoverClass);
            $(options.context).on(eventOff, options.selector, options, toggleOff);
            if(options.onHover) options.onHover(element);
        };
        toggleOff = function(e) {
            var options = e.data, element = $(this);
            element.removeClass(options.hoverClass);
            $(options.context).off(eventOff, options.selector, toggleOff);
            if(options.onLeave) options.onLeave(element);
        };
    }

    // jQuery plugin
    $.fn.touchHover = function(opt, callback) {
        callback = callback || false;

        var options = $.extend({
            context: this.context,
            selector: this.selector,
            hoverClass: 'hover'
        }, opt);

        $(this.context).on(eventOn, this.selector, options, toggleOn);
        return this;
    };
}(jQuery));


// navigation accesibility module
function TouchNav(opt) {
    this.options = {
        hoverClass: 'hover',
        menuItems: 'li',
        menuOpener: 'a',
        menuDrop: 'ul',
        navBlock: null
    };
    for (var p in opt) {
        if (opt.hasOwnProperty(p)) {
            this.options[p] = opt[p];
        }
    }
    this.init();
}
TouchNav.isActiveOn = function(elem) {
    return elem && elem.touchNavActive;
};
TouchNav.prototype = {
    init: function() {
        if (typeof this.options.navBlock === 'string') {
            this.menu = document.getElementById(this.options.navBlock);
        } else if (typeof this.options.navBlock === 'object') {
            this.menu = this.options.navBlock;
        }
        if (this.menu) {
            this.addEvents();
        }
    },
    addEvents: function() {
        // attach event handlers
        var self = this;
        var touchEvent = (navigator.pointerEnabled && 'pointerdown') || (navigator.msPointerEnabled && 'MSPointerDown') || (this.isTouchDevice && 'touchstart');
        this.menuItems = lib.queryElementsBySelector(this.options.menuItems, this.menu);

        var initMenuItem = function(item) {
            var currentDrop = lib.queryElementsBySelector(self.options.menuDrop, item)[0],
                currentOpener = lib.queryElementsBySelector(self.options.menuOpener, item)[0];

            // only for touch input devices
            if (currentDrop && currentOpener && (self.isTouchDevice || self.isPointerDevice)) {
                lib.event.add(currentOpener, 'click', lib.bind(self.clickHandler, self));
                lib.event.add(currentOpener, 'mousedown', lib.bind(self.mousedownHandler, self));
                lib.event.add(currentOpener, touchEvent, function(e) {
                    if (!self.isTouchPointerEvent(e)) {
                        self.preventCurrentClick = false;
                        return;
                    }
                    self.touchFlag = true;
                    self.currentItem = item;
                    self.currentLink = currentOpener;
                    self.pressHandler.apply(self, arguments);
                });
            }
            // for desktop computers and touch devices
            jQuery(item)
                .bind('mouseenter', function() {
                    if (!self.touchFlag) {
                        self.currentItem = item;
                        self.mouseoverHandler();
                    }
                });
            jQuery(item)
                .bind('mouseleave', function() {
                    if (!self.touchFlag) {
                        self.currentItem = item;
                        self.mouseoutHandler();
                    }
                });
            item.touchNavActive = true;
        };

        // addd handlers for all menu items
        for (var i = 0; i < this.menuItems.length; i++) {
            initMenuItem(self.menuItems[i]);
        }

        // hide dropdowns when clicking outside navigation
        if (this.isTouchDevice || this.isPointerDevice) {
            lib.event.add(document.documentElement, 'mousedown', lib.bind(this.clickOutsideHandler, this));
            lib.event.add(document.documentElement, touchEvent, lib.bind(this.clickOutsideHandler, this));
        }
    },
    mousedownHandler: function(e) {
        if (this.touchFlag) {
            e.preventDefault();
            this.touchFlag = false;
            this.preventCurrentClick = false;
        }
    },
    mouseoverHandler: function() {
        lib.addClass(this.currentItem, this.options.hoverClass);
        jQuery(this.currentItem)
            .trigger('itemhover');
    },
    mouseoutHandler: function() {
        lib.removeClass(this.currentItem, this.options.hoverClass);
        jQuery(this.currentItem)
            .trigger('itemleave');
    },
    hideActiveDropdown: function() {
        for (var i = 0; i < this.menuItems.length; i++) {
            if (lib.hasClass(this.menuItems[i], this.options.hoverClass)) {
                lib.removeClass(this.menuItems[i], this.options.hoverClass);
                jQuery(this.menuItems[i])
                    .trigger('itemleave');
            }
        }
        this.activeParent = null;
    },
    pressHandler: function(e) {
        // hide previous drop (if active)
        if (this.currentItem !== this.activeParent) {
            if (this.activeParent && this.currentItem.parentNode === this.activeParent.parentNode) {
                lib.removeClass(this.activeParent, this.options.hoverClass);
            } else if (!this.isParent(this.activeParent, this.currentLink)) {
                this.hideActiveDropdown();
            }
        }
        // handle current drop
        this.activeParent = this.currentItem;
        if (lib.hasClass(this.currentItem, this.options.hoverClass)) {
            this.preventCurrentClick = false;
        } else {
            e.preventDefault();
            this.preventCurrentClick = true;
            lib.addClass(this.currentItem, this.options.hoverClass);
            jQuery(this.currentItem)
                .trigger('itemhover');
        }
    },
    clickHandler: function(e) {
        // prevent first click on link
        if (this.preventCurrentClick) {
            e.preventDefault();
        }
    },
    clickOutsideHandler: function(event) {
        var e = event.changedTouches ? event.changedTouches[0] : event;
        if (this.activeParent && !this.isParent(this.menu, e.target)) {
            this.hideActiveDropdown();
            this.touchFlag = false;
        }
    },
    isParent: function(parent, child) {
        while (child.parentNode) {
            if (child.parentNode == parent) {
                return true;
            }
            child = child.parentNode;
        }
        return false;
    },
    isTouchPointerEvent: function(e) {
        return (e.type.indexOf('touch') > -1) ||
            (navigator.pointerEnabled && e.pointerType === 'touch') ||
            (navigator.msPointerEnabled && e.pointerType == e.MSPOINTER_TYPE_TOUCH);
    },
    isPointerDevice: (function() {
        return !!(navigator.pointerEnabled || navigator.msPointerEnabled);
    }()),
    isTouchDevice: (function() {
        return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
    }())
};

/*
 * Utility module
 */
lib = {
    hasClass: function(el,cls) {
        return el && el.className ? el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')) : false;
    },
    addClass: function(el,cls) {
        if (el && !this.hasClass(el,cls)) el.className += " "+cls;
    },
    removeClass: function(el,cls) {
        if (el && this.hasClass(el,cls)) {el.className=el.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'),' ');}
    },
    extend: function(obj) {
        for(var i = 1; i < arguments.length; i++) {
            for(var p in arguments[i]) {
                if(arguments[i].hasOwnProperty(p)) {
                    obj[p] = arguments[i][p];
                }
            }
        }
        return obj;
    },
    each: function(obj, callback) {
        var property, len;
        if(typeof obj.length === 'number') {
            for(property = 0, len = obj.length; property < len; property++) {
                if(callback.call(obj[property], property, obj[property]) === false) {
                    break;
                }
            }
        } else {
            for(property in obj) {
                if(obj.hasOwnProperty(property)) {
                    if(callback.call(obj[property], property, obj[property]) === false) {
                        break;
                    }
                }
            }
        }
    },
    event: (function() {
        var fixEvent = function(e) {
            e = e || window.event;
            if(e.isFixed) return e; else e.isFixed = true;
            if(!e.target) e.target = e.srcElement;
            e.preventDefault = e.preventDefault || function() {this.returnValue = false;};
            e.stopPropagation = e.stopPropagation || function() {this.cancelBubble = true;};
            return e;
        };
        return {
            add: function(elem, event, handler) {
                if(!elem.events) {
                    elem.events = {};
                    elem.handle = function(e) {
                        var ret, handlers = elem.events[e.type];
                        e = fixEvent(e);
                        for(var i = 0, len = handlers.length; i < len; i++) {
                            if(handlers[i]) {
                                ret = handlers[i].call(elem, e);
                                if(ret === false) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            }
                        }
                    };
                }
                if(!elem.events[event]) {
                    elem.events[event] = [];
                    if(elem.addEventListener) elem.addEventListener(event, elem.handle, false);
                    else if(elem.attachEvent) elem.attachEvent('on'+event, elem.handle);
                }
                elem.events[event].push(handler);
            },
            remove: function(elem, event, handler) {
                var handlers = elem.events[event];
                for(var i = handlers.length - 1; i >= 0; i--) {
                    if(handlers[i] === handler) {
                        handlers.splice(i,1);
                    }
                }
                if(!handlers.length) {
                    delete elem.events[event];
                    if(elem.removeEventListener) elem.removeEventListener(event, elem.handle, false);
                    else if(elem.detachEvent) elem.detachEvent('on'+event, elem.handle);
                }
            }
        };
    }()),
    queryElementsBySelector: function(selector, scope) {
        scope = scope || document;
        if(!selector) return [];
        if(selector === '>*') return scope.children;
        if(typeof document.querySelectorAll === 'function') {
            return scope.querySelectorAll(selector);
        }
        var selectors = selector.split(',');
        var resultList = [];
        for(var s = 0; s < selectors.length; s++) {
            var currentContext = [scope || document];
            var tokens = selectors[s].replace(/^\s+/,'').replace(/\s+$/,'').split(' ');
            for (var i = 0; i < tokens.length; i++) {
                token = tokens[i].replace(/^\s+/,'').replace(/\s+$/,'');
                if (token.indexOf('#') > -1) {
                    var bits = token.split('#'), tagName = bits[0], id = bits[1];
                    var element = document.getElementById(id);
                    if (element && tagName && element.nodeName.toLowerCase() != tagName) {
                        return [];
                    }
                    currentContext = element ? [element] : [];
                    continue;
                }
                if (token.indexOf('.') > -1) {
                    var bits = token.split('.'), tagName = bits[0] || '*', className = bits[1], found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; j < elements.length; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (found[k].className && found[k].className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'))) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
                    var tagName = RegExp.$1 || '*', attrName = RegExp.$2, attrOperator = RegExp.$3, attrValue = RegExp.$4;
                    if(attrName.toLowerCase() == 'for' && this.browser.msie && this.browser.version < 8) {
                        attrName = 'htmlFor';
                    }
                    var found = [], foundCount = 0;
                    for (var h = 0; h < currentContext.length; h++) {
                        var elements;
                        if (tagName == '*') {
                            elements = currentContext[h].getElementsByTagName('*');
                        } else {
                            elements = currentContext[h].getElementsByTagName(tagName);
                        }
                        for (var j = 0; elements[j]; j++) {
                            found[foundCount++] = elements[j];
                        }
                    }
                    currentContext = [];
                    var currentContextIndex = 0, checkFunction;
                    switch (attrOperator) {
                        case '=': checkFunction = function(e) { return (e.getAttribute(attrName) == attrValue) }; break;
                        case '~': checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('(\\s|^)'+attrValue+'(\\s|$)'))) }; break;
                        case '|': checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('^'+attrValue+'-?'))) }; break;
                        case '^': checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) == 0) }; break;
                        case '$': checkFunction = function(e) { return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length) }; break;
                        case '*': checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) > -1) }; break;
                        default : checkFunction = function(e) { return e.getAttribute(attrName) };
                    }
                    currentContext = [];
                    var currentContextIndex = 0;
                    for (var k = 0; k < found.length; k++) {
                        if (checkFunction(found[k])) {
                            currentContext[currentContextIndex++] = found[k];
                        }
                    }
                    continue;
                }
                tagName = token;
                var found = [], foundCount = 0;
                for (var h = 0; h < currentContext.length; h++) {
                    var elements = currentContext[h].getElementsByTagName(tagName);
                    for (var j = 0; j < elements.length; j++) {
                        found[foundCount++] = elements[j];
                    }
                }
                currentContext = found;
            }
            resultList = [].concat(resultList,currentContext);
        }
        return resultList;
    },
    trim: function (str) {
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
    },
    bind: function(f, scope, forceArgs){
        return function() {return f.apply(scope, typeof forceArgs !== 'undefined' ? [forceArgs] : arguments);};
    }
};