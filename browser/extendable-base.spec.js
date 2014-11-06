!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.extendableBase=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Base = require('../index');

var Animal = Base.extend({
    initialize: function() {
        this.classname = "Animal";
    },

    ident : function() {
        return 'I am an ' + this.classname;
    },

    legs : function() {
        return 'I have ' + this._legs + ' legs';
    }
});

var TwoLegged = Animal.extend({
    // Prototype properties can be set inline
    _legs: 2
});

var FourLegged = Animal.extend({
    // Initialize is called for all classes
    initialize : function() {
        this._legs = 4;
    }
});

var Furry = {
    fur: function() {
        return 'I have ' + this.fur_color + ' fur';
    }
};

var FurryDog = FourLegged.extend(Furry).extend({
    classname: 'FurryDog',

    initialize: function(fur_color) {
        this.fur_color = fur_color;
    }
});

module.exports = {
    Animal: Animal,
    TwoLegged: TwoLegged,
    FourLegged: FourLegged,
    Furry: Furry,
    FurryDog: FurryDog
};

},{"../index":2}],2:[function(require,module,exports){
module.exports = require('./lib/base');

},{"./lib/base":3}],3:[function(require,module,exports){
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

},{"./extendable":4}],4:[function(require,module,exports){
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

},{"underscore":undefined}],5:[function(require,module,exports){
var expect = require('chai').expect;

var zoo = require('../examples/inheritance');
var Animal = zoo.Animal;
var TwoLegged = zoo.TwoLegged;
var FourLegged = zoo.FourLegged;
var FurryDog = zoo.FurryDog;

describe("base class", function() {
    it("inherits properties", function() {
        var a = new Animal();

        expect(a.classname).to.equal("Animal");
        expect(a.classname).equal("Animal");
    });

    it("calls the constructor", function() {
        var a = new Animal();
        expect(a.ident()).equal("I am an Animal");
    });

    it("supports polymorphism", function() {
        var twolegs = new TwoLegged();
        var fourlegs = new FourLegged();

        expect(twolegs.legs()).equal("I have 2 legs");
        expect(fourlegs.legs()).equal("I have 4 legs");
    });

    it("enables mixins", function() {
        var dog = new FurryDog("brown");
        expect(dog.legs()).equal("I have 4 legs");
        expect(dog.fur()).equal("I have brown fur");
    });

    it('handles instanceof', function() {
        var a = new Animal();
        var twolegs = new TwoLegged();
        var fourlegs = new FourLegged();
        var dog = new FurryDog('brown');

        expect(a instanceof Animal).equal(true);

        expect(twolegs instanceof Animal).equal(true);
        expect(twolegs instanceof TwoLegged).equal(true);

        expect(fourlegs instanceof Animal).equal(true);
        expect(fourlegs instanceof FourLegged).equal(true);

        expect(dog instanceof Animal).equal(true);
        expect(dog instanceof FourLegged).equal(true);
        expect(dog instanceof FurryDog).equal(true);
    });
});

},{"../examples/inheritance":1,"chai":undefined}]},{},[5])(5)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2dydW50LWRyeS9ub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZXMvaW5oZXJpdGFuY2UuanMiLCJpbmRleC5qcyIsImxpYi9iYXNlLmpzIiwibGliL2V4dGVuZGFibGUuanMiLCJzcGVjcy9iYXNlLnNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBCYXNlID0gcmVxdWlyZSgnLi4vaW5kZXgnKTtcblxudmFyIEFuaW1hbCA9IEJhc2UuZXh0ZW5kKHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jbGFzc25hbWUgPSBcIkFuaW1hbFwiO1xuICAgIH0sXG5cbiAgICBpZGVudCA6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJ0kgYW0gYW4gJyArIHRoaXMuY2xhc3NuYW1lO1xuICAgIH0sXG5cbiAgICBsZWdzIDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAnSSBoYXZlICcgKyB0aGlzLl9sZWdzICsgJyBsZWdzJztcbiAgICB9XG59KTtcblxudmFyIFR3b0xlZ2dlZCA9IEFuaW1hbC5leHRlbmQoe1xuICAgIC8vIFByb3RvdHlwZSBwcm9wZXJ0aWVzIGNhbiBiZSBzZXQgaW5saW5lXG4gICAgX2xlZ3M6IDJcbn0pO1xuXG52YXIgRm91ckxlZ2dlZCA9IEFuaW1hbC5leHRlbmQoe1xuICAgIC8vIEluaXRpYWxpemUgaXMgY2FsbGVkIGZvciBhbGwgY2xhc3Nlc1xuICAgIGluaXRpYWxpemUgOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fbGVncyA9IDQ7XG4gICAgfVxufSk7XG5cbnZhciBGdXJyeSA9IHtcbiAgICBmdXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJ0kgaGF2ZSAnICsgdGhpcy5mdXJfY29sb3IgKyAnIGZ1cic7XG4gICAgfVxufTtcblxudmFyIEZ1cnJ5RG9nID0gRm91ckxlZ2dlZC5leHRlbmQoRnVycnkpLmV4dGVuZCh7XG4gICAgY2xhc3NuYW1lOiAnRnVycnlEb2cnLFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oZnVyX2NvbG9yKSB7XG4gICAgICAgIHRoaXMuZnVyX2NvbG9yID0gZnVyX2NvbG9yO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBBbmltYWw6IEFuaW1hbCxcbiAgICBUd29MZWdnZWQ6IFR3b0xlZ2dlZCxcbiAgICBGb3VyTGVnZ2VkOiBGb3VyTGVnZ2VkLFxuICAgIEZ1cnJ5OiBGdXJyeSxcbiAgICBGdXJyeURvZzogRnVycnlEb2dcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2Jhc2UnKTtcbiIsInZhciBFeHRlbmRhYmxlID0gcmVxdWlyZSgnLi9leHRlbmRhYmxlJyk7XG5cbi8qKlxuICogR2VuZXJpYyBiYXNlIGNsYXNzIGZvciBleHRlbmRpbmcgaW50byBzdWJjbGFzc2VzLlxuICpcbiAqIEVuYWJsZXMgbmF0dXJhbCBpbmhlcml0YW5jZSBleHByZXNzaW9ucyB1c2luZyBgQmFzZS5leHRlbmRgXG4gKiB0aGF0IHVzZXMgdGhlIEJhY2tib25lIGV4dGVuZCBzeW50YXguXG4gKlxuICogVGhlIGRlZmF1bHQgY29uc3RydWN0b3IgY2FsbHMgYGluaXRpYWxpemVgIG9uIGFsbCBzdWJjbGFzc2VzXG4gKiBpbiB0aGUgaW5oZXJpdGFuY2UgaGllcmFyY2h5LCBwYXNzaW5nIHRoZSBzYW1lIGFyZ3VtZW50cyB0b1xuICogZWFjaCBjb25zdHJ1Y3Rvci5cbiAqXG4gKi9cbnZhciBCYXNlID0gRXh0ZW5kYWJsZS5leHRlbmQoe1xuICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgQmFzZS5faW5pdF9hbGwoT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpLCB0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbn0sIHtcblxuICAgIC8vIEhlbHBlciBmdW5jdGlvbiB0aGF0IHdhbGtzIHRoZSBwcm90b3R5cGUgY2hhaW4gY2FsbGluZyBpbml0aWFsaXplLlxuICAgIF9pbml0X2FsbDogZnVuY3Rpb24ocHJvdG8sIGxlYWYsIGFyZ3MpIHtcbiAgICAgICAgaWYgKHByb3RvID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgQmFzZS5faW5pdF9hbGwoT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKSwgbGVhZiwgYXJncyk7XG4gICAgICAgIGlmIChwcm90by5oYXNPd25Qcm9wZXJ0eSgnaW5pdGlhbGl6ZScpKSB7XG4gICAgICAgICAgICBwcm90by5pbml0aWFsaXplLmFwcGx5KGxlYWYsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIFNldHMgdXAgaW5oZXJpdGFuY2UgZnJvbSB0aGUgZ2l2ZW4gcGFyZW50IGNsYXNzLiBJZiB0aGUgY29uc3RydWN0b3JcbiAgICAvLyBpc24ndCBzdXBwbGllZCB0aGVuIGEgZGVmYXVsdCBjb25zdHJ1Y3RvciBpcyBhZGRlZCB3aGljaCBjYWxsc1xuICAgIC8vIGBpbml0aWFsaXplYCBmb3IgZWFjaCBjbGFzcyBpbiB0aGUgaW5oZXJpdGFuY2UgaGllcmFyY2h5LlxuICAgIGluaGVyaXRzOiBmdW5jdGlvbihwYXJlbnQsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgICAgIGlmICghcHJvdG9Qcm9wcy5oYXNPd25Qcm9wZXJ0eSgnY29uc3RydWN0b3InKSkge1xuICAgICAgICAgICAgcHJvdG9Qcm9wcy5jb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIEJhc2UuX2luaXRfYWxsKE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKSwgdGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEV4dGVuZGFibGUuaW5oZXJpdHMocGFyZW50LCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcyk7XG4gICAgfVxufSk7XG5cbi8vIFN0YXNoIGEgcmVmZXJlbmNlIHRvIEV4dGVuZGFibGUgaW4gdGhlIEJhc2UgY2xhc3MgaXRzZWxmIHNvIHRoYXQgdGhlXG4vLyBtb2R1bGUgY2FuIHNpbXBseSBleHBvcnQgQmFzZSBidXQgc3RpbGwgaGF2ZSBhY2Nlc3MgdG8gRXh0ZW5kYWJsZSB2aWFcbi8vIEJhc2UuRXh0ZW5kYWJsZS5cbkJhc2UuRXh0ZW5kYWJsZSA9IEV4dGVuZGFibGU7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZTtcbiIsInZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG4vKipcbiAqIFNpbXBsZSBiYXNlIGNsYXNzIHRoYXQgcHVsbHMgaW4gdGhlIGV4dGVuZCBzeW50YXggZnJvbSBCYWNrYm9uZS5cbiAqL1xudmFyIEV4dGVuZGFibGUgPSBmdW5jdGlvbigpIHsgfTtcblxuLy8gKENvcHkgb2YgQmFja2JvbmUuZXh0ZW5kKVxuLy8gU2V0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4sIGZvciBzdWJjbGFzc2VzLlxuLy8gU2ltaWxhciB0byBgZ29vZy5pbmhlcml0c2AsIGJ1dCB1c2VzIGEgaGFzaCBvZiBwcm90b3R5cGUgcHJvcGVydGllcyBhbmRcbi8vIGNsYXNzIHByb3BlcnRpZXMgdG8gYmUgZXh0ZW5kZWQuXG5FeHRlbmRhYmxlLmV4dGVuZCA9IGZ1bmN0aW9uKHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgdmFyIHBhcmVudCA9IHRoaXM7XG4gICAgdmFyIGNoaWxkO1xuXG4gICAgLy8gVGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciB0aGUgbmV3IHN1YmNsYXNzIGlzIGVpdGhlciBkZWZpbmVkIGJ5IHlvdVxuICAgIC8vICh0aGUgXCJjb25zdHJ1Y3RvclwiIHByb3BlcnR5IGluIHlvdXIgYGV4dGVuZGAgZGVmaW5pdGlvbiksIG9yIGRlZmF1bHRlZFxuICAgIC8vIGJ5IHVzIHRvIHNpbXBseSBjYWxsIHRoZSBwYXJlbnQncyBjb25zdHJ1Y3Rvci5cbiAgICBpZiAocHJvdG9Qcm9wcyAmJiBfLmhhcyhwcm90b1Byb3BzLCAnY29uc3RydWN0b3InKSkge1xuICAgICAgICBjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGQgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHBhcmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIH1cblxuICAgIC8vIEFkZCBzdGF0aWMgcHJvcGVydGllcyB0byB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb24sIGlmIHN1cHBsaWVkLlxuICAgIF8uZXh0ZW5kKGNoaWxkLCBwYXJlbnQsIHN0YXRpY1Byb3BzKTtcblxuICAgIC8vIFNldCB0aGUgcHJvdG90eXBlIGNoYWluIHRvIGluaGVyaXQgZnJvbSBgcGFyZW50YCwgd2l0aG91dCBjYWxsaW5nXG4gICAgLy8gYHBhcmVudGAncyBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICB2YXIgU3Vycm9nYXRlID0gZnVuY3Rpb24oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfTtcbiAgICBTdXJyb2dhdGUucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcbiAgICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgU3Vycm9nYXRlKCk7XG5cbiAgICAvLyBBZGQgcHJvdG90eXBlIHByb3BlcnRpZXMgKGluc3RhbmNlIHByb3BlcnRpZXMpIHRvIHRoZSBzdWJjbGFzcyxcbiAgICAvLyBpZiBzdXBwbGllZC5cbiAgICBpZiAocHJvdG9Qcm9wcykgeyBfLmV4dGVuZChjaGlsZC5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyB9XG5cbiAgICAvLyBTZXQgYSBjb252ZW5pZW5jZSBwcm9wZXJ0eSBpbiBjYXNlIHRoZSBwYXJlbnQncyBwcm90b3R5cGUgaXMgbmVlZGVkXG4gICAgLy8gbGF0ZXIuXG4gICAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcblxuICAgIHJldHVybiBjaGlsZDtcbn07XG5cbi8vIFNldCB1cCBpbmhlcml0YW5jZSB3aXRoIGEgc3BlY2lmaWMgcGFyZW50IGNsYXNzLlxuRXh0ZW5kYWJsZS5pbmhlcml0cyA9IGZ1bmN0aW9uKHBhcmVudCwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICB2YXIgY2hpbGQgPSBFeHRlbmRhYmxlLmV4dGVuZC5jYWxsKHBhcmVudCwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpO1xuICAgIGNoaWxkLmV4dGVuZCA9IEV4dGVuZGFibGUuZXh0ZW5kO1xuICAgIHJldHVybiBjaGlsZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRXh0ZW5kYWJsZTtcbiIsInZhciBleHBlY3QgPSByZXF1aXJlKCdjaGFpJykuZXhwZWN0O1xuXG52YXIgem9vID0gcmVxdWlyZSgnLi4vZXhhbXBsZXMvaW5oZXJpdGFuY2UnKTtcbnZhciBBbmltYWwgPSB6b28uQW5pbWFsO1xudmFyIFR3b0xlZ2dlZCA9IHpvby5Ud29MZWdnZWQ7XG52YXIgRm91ckxlZ2dlZCA9IHpvby5Gb3VyTGVnZ2VkO1xudmFyIEZ1cnJ5RG9nID0gem9vLkZ1cnJ5RG9nO1xuXG5kZXNjcmliZShcImJhc2UgY2xhc3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgaXQoXCJpbmhlcml0cyBwcm9wZXJ0aWVzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYSA9IG5ldyBBbmltYWwoKTtcblxuICAgICAgICBleHBlY3QoYS5jbGFzc25hbWUpLnRvLmVxdWFsKFwiQW5pbWFsXCIpO1xuICAgICAgICBleHBlY3QoYS5jbGFzc25hbWUpLmVxdWFsKFwiQW5pbWFsXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJjYWxscyB0aGUgY29uc3RydWN0b3JcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhID0gbmV3IEFuaW1hbCgpO1xuICAgICAgICBleHBlY3QoYS5pZGVudCgpKS5lcXVhbChcIkkgYW0gYW4gQW5pbWFsXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzdXBwb3J0cyBwb2x5bW9ycGhpc21cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0d29sZWdzID0gbmV3IFR3b0xlZ2dlZCgpO1xuICAgICAgICB2YXIgZm91cmxlZ3MgPSBuZXcgRm91ckxlZ2dlZCgpO1xuXG4gICAgICAgIGV4cGVjdCh0d29sZWdzLmxlZ3MoKSkuZXF1YWwoXCJJIGhhdmUgMiBsZWdzXCIpO1xuICAgICAgICBleHBlY3QoZm91cmxlZ3MubGVncygpKS5lcXVhbChcIkkgaGF2ZSA0IGxlZ3NcIik7XG4gICAgfSk7XG5cbiAgICBpdChcImVuYWJsZXMgbWl4aW5zXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZG9nID0gbmV3IEZ1cnJ5RG9nKFwiYnJvd25cIik7XG4gICAgICAgIGV4cGVjdChkb2cubGVncygpKS5lcXVhbChcIkkgaGF2ZSA0IGxlZ3NcIik7XG4gICAgICAgIGV4cGVjdChkb2cuZnVyKCkpLmVxdWFsKFwiSSBoYXZlIGJyb3duIGZ1clwiKTtcbiAgICB9KTtcblxuICAgIGl0KCdoYW5kbGVzIGluc3RhbmNlb2YnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGEgPSBuZXcgQW5pbWFsKCk7XG4gICAgICAgIHZhciB0d29sZWdzID0gbmV3IFR3b0xlZ2dlZCgpO1xuICAgICAgICB2YXIgZm91cmxlZ3MgPSBuZXcgRm91ckxlZ2dlZCgpO1xuICAgICAgICB2YXIgZG9nID0gbmV3IEZ1cnJ5RG9nKCdicm93bicpO1xuXG4gICAgICAgIGV4cGVjdChhIGluc3RhbmNlb2YgQW5pbWFsKS5lcXVhbCh0cnVlKTtcblxuICAgICAgICBleHBlY3QodHdvbGVncyBpbnN0YW5jZW9mIEFuaW1hbCkuZXF1YWwodHJ1ZSk7XG4gICAgICAgIGV4cGVjdCh0d29sZWdzIGluc3RhbmNlb2YgVHdvTGVnZ2VkKS5lcXVhbCh0cnVlKTtcblxuICAgICAgICBleHBlY3QoZm91cmxlZ3MgaW5zdGFuY2VvZiBBbmltYWwpLmVxdWFsKHRydWUpO1xuICAgICAgICBleHBlY3QoZm91cmxlZ3MgaW5zdGFuY2VvZiBGb3VyTGVnZ2VkKS5lcXVhbCh0cnVlKTtcblxuICAgICAgICBleHBlY3QoZG9nIGluc3RhbmNlb2YgQW5pbWFsKS5lcXVhbCh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGRvZyBpbnN0YW5jZW9mIEZvdXJMZWdnZWQpLmVxdWFsKHRydWUpO1xuICAgICAgICBleHBlY3QoZG9nIGluc3RhbmNlb2YgRnVycnlEb2cpLmVxdWFsKHRydWUpO1xuICAgIH0pO1xufSk7XG4iXX0=
