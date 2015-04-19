extendable-base: Simple library for setting up Javascript classes [![Build Status: Linux](https://travis-ci.org/jut-io/extendable-base.png?branch=master)](https://travis-ci.org/jut-io/extendable-base)
=================================================================

Leverages `Backbone.extend` semantics for defining subclasses in a generic way,
making it straightforward to set up javascript class hierarchies.

As a convenience, adds logic so that the default constructor for the `Base`
class calls `initialize` function on all classes in the inheritance chain
passing the same arguments to each class.

Basic Usage
===========

    var Base = require('base-extend');

    var MyClass = Base.extend({
        initialize: function(name) {
            this.name = name;
        },

        whoami: function() {
            console.log("I am", this.name);
        }
    });

    console.log(new MyClass('joe').whoami());
    // 'I am joe'

Inheritance
===========

Simple inheritance chains work as well, calling `initialize` for all classes
in the chain:

    var Animal = Base.extend({
        initialize: function(type) {
            this.classname = "Animal";
            this.type = type;
        },

        ident : function() {
            return 'I am an ' + this.classname + ': ' + this.type;
        },

        legs : function() {
            return 'I have ' + this._legs + ' legs';
        }
    });

    var FourLegged = Animal.extend({
        // Initialize is called for all classes
        initialize : function(type) {
            this._legs = 4;
        }
    });

    var dog = new FourLegged('dog');

    console.log(dog.ident());
    // 'I am an Animal: dog'

    console.log(dog.legs());
    // 'I have 4 legs'

Extending existing types
========================

You can use `Base.extends` to subclass an existing Javascript type, for example
to define custom `Error` subclasses:

    var BaseError = Base.inherits(Error, {
        default_status: 500,

        initialize: function(message, status) {
            Error.call(this, message);

            this.message = message || this.default_message || "";
            this.status = status || this.default_status;
        },

        toJSON: function() {
            return {status: this.status, message: this.message};
        }
    });

    var NotFoundError = BaseError.extend({
        default_status: 404,
        default_message: "Bad Request"
    });

    var BadRequestError = BaseError.extend({
        default_status: 400,
        default_message: "Not Found"
    });

    console.log(new BadRequestError().toJSON());
    // { status: 400, message: 'Not Found' }

    console.log(new BadRequestError("Invalid request").toJSON());
    // { status: 400, message: 'Invalid request' }

    console.log(new BadRequestError("Unauthorized", 401).toJSON());
    // { status: 401, message: 'Unauthorized' }

    console.log(new NotFoundError().toJSON());
    // { status: 404, message: 'Bad Request' }
