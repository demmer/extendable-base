!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.extendableBase=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/base');

},{"./lib/base":2}],2:[function(require,module,exports){
var Extendable = require('./extendable');

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
    constructor: function() {
        Base._init_all(Object.getPrototypeOf(this), this, arguments);
    }
}, {

    // Helper function that walks the prototype chain calling initialize.
    _init_all: function(proto, leaf, args) {
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
    inherits: function(parent, protoProps, staticProps) {
        if (!protoProps.hasOwnProperty('constructor')) {
            protoProps.constructor = function() {
                Base._init_all(Object.getPrototypeOf(this), this, arguments);
            };
        }
        return Extendable.inherits(parent, protoProps, staticProps);
    }
});

// Stash a reference to Extendable in the Base class itself so that the
// module can simply export Base but still have access to Extendable via
// Base.Extendable.
Base.Extendable = Extendable;

module.exports = Base;

},{"./extendable":3}],3:[function(require,module,exports){
var _ = require('underscore');

/**
 * Simple base class that pulls in the extend syntax from Backbone.
 */
var Extendable = function() { };

// (Copy of Backbone.extend)
// Set up the prototype chain, for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
Extendable.extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
    } else {
        child = function() { return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function() { this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) { _.extend(child.prototype, protoProps); }

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
};

// Set up inheritance with a specific parent class.
Extendable.inherits = function(parent, protoProps, staticProps) {
    var child = Extendable.extend.call(parent, protoProps, staticProps);
    child.extend = Extendable.extend;
    return child;
};

module.exports = Extendable;

},{"underscore":undefined}]},{},[1])(1)
});


//# sourceMappingURL=extendable-base.js.map