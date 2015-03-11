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
    // isn't supplied then a default constructor is added which invokes
    // the parent then calls `initialize` for each class in the
    // inheritance hierarchy.
    inherits: function(parent, protoProps, staticProps) {
        if (!protoProps.hasOwnProperty('constructor')) {
            protoProps.constructor = function() {
                parent.apply(this);
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
