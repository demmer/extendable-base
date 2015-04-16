(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'));
    } else {
        // Browser globals
        this.extendable_base = factory(underscore);
    }
}(function (__external_underscore) {
    var global = this, define;
    function _require(id) {
        var module = _require.cache[id];
        if (!module) {
            var exports = {};
            module = _require.cache[id] = {
                id: id,
                exports: exports
            };
            _require.modules[id].call(exports, module, exports);
        }
        return module.exports;
    }
    _require.cache = [];
    _require.modules = [
        function (module, exports) {
            module.exports = _require(1);
        },
        function (module, exports) {
            var Extendable = _require(2);    /**
 * Generic base class for extending into subclasses.
 *
 * Enables natural inheritance expressions using `Base.extend`
 * that uses the Backbone extend syntax.
 *
 * The default constructor calls `initialize` on all subclasses
 * in the inheritance hierarchy, passing the same arguments to
 * each constructor.
 *
 */
            /**
 * Generic base class for extending into subclasses.
 *
 * Enables natural inheritance expressions using `Base.extend`
 * that uses the Backbone extend syntax.
 *
 * The default constructor calls `initialize` on all subclasses
 * in the inheritance hierarchy, passing the same arguments to
 * each constructor.
 *
 */
            var Base = Extendable.extend({
                    constructor: function () {
                        Base._init_all(Object.getPrototypeOf(this), this, arguments);
                    }
                }, {
                    // Helper function that walks the prototype chain calling initialize.
                    _init_all: function (proto, leaf, args) {
                        if (proto === null) {
                            return;
                        }
                        Base._init_all(Object.getPrototypeOf(proto), leaf, args);
                        if (proto.hasOwnProperty('initialize')) {
                            proto.initialize.apply(leaf, args);
                        }
                    },
                    // Sets up inheritance from the given parent class. If the constructor
                    // isn't supplied then a default constructor is added which calls
                    // `initialize` for each class in the inheritance hierarchy.
                    inherits: function (parent, protoProps, staticProps) {
                        if (!protoProps.hasOwnProperty('constructor')) {
                            protoProps.constructor = function () {
                                Base._init_all(Object.getPrototypeOf(this), this, arguments);
                            };
                        }
                        return Extendable.inherits(parent, protoProps, staticProps);
                    }
                });    // Stash a reference to Extendable in the Base class itself so that the
                       // module can simply export Base but still have access to Extendable via
                       // Base.Extendable.
            // Stash a reference to Extendable in the Base class itself so that the
            // module can simply export Base but still have access to Extendable via
            // Base.Extendable.
            Base.Extendable = Extendable;
            module.exports = Base;
        },
        function (module, exports) {
            var _ = _require(3);    /**
 * Simple base class that pulls in the extend syntax from Backbone.
 */
            /**
 * Simple base class that pulls in the extend syntax from Backbone.
 */
            var Extendable = function () {
            };    // (Copy of Backbone.extend)
                  // Set up the prototype chain, for subclasses.
                  // Similar to `goog.inherits`, but uses a hash of prototype properties and
                  // class properties to be extended.
            // (Copy of Backbone.extend)
            // Set up the prototype chain, for subclasses.
            // Similar to `goog.inherits`, but uses a hash of prototype properties and
            // class properties to be extended.
            Extendable.extend = function (protoProps, staticProps) {
                var parent = this;
                var child;    // The constructor function for the new subclass is either defined by you
                              // (the "constructor" property in your `extend` definition), or defaulted
                              // by us to simply call the parent's constructor.
                // The constructor function for the new subclass is either defined by you
                // (the "constructor" property in your `extend` definition), or defaulted
                // by us to simply call the parent's constructor.
                if (protoProps && _.has(protoProps, 'constructor')) {
                    child = protoProps.constructor;
                } else {
                    child = function () {
                        return parent.apply(this, arguments);
                    };
                }    // Add static properties to the constructor function, if supplied.
                // Add static properties to the constructor function, if supplied.
                _.extend(child, parent, staticProps);    // Set the prototype chain to inherit from `parent`, without calling
                                                         // `parent`'s constructor function.
                // Set the prototype chain to inherit from `parent`, without calling
                // `parent`'s constructor function.
                var Surrogate = function () {
                    this.constructor = child;
                };
                Surrogate.prototype = parent.prototype;
                child.prototype = new Surrogate();    // Add prototype properties (instance properties) to the subclass,
                                                      // if supplied.
                // Add prototype properties (instance properties) to the subclass,
                // if supplied.
                if (protoProps) {
                    _.extend(child.prototype, protoProps);
                }    // Set a convenience property in case the parent's prototype is needed
                     // later.
                // Set a convenience property in case the parent's prototype is needed
                // later.
                child.__super__ = parent.prototype;
                return child;
            };    // Set up inheritance with a specific parent class.
            // Set up inheritance with a specific parent class.
            Extendable.inherits = function (parent, protoProps, staticProps) {
                var child = Extendable.extend.call(parent, protoProps, staticProps);
                child.extend = Extendable.extend;
                return child;
            };
            module.exports = Extendable;
        },
        function (module, exports) {
            module.exports = __external_underscore;
        }
    ];
    return _require(0);
}));
