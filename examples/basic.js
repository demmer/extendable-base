var Base = require('extendable-base');

var MyClass = Base.extend({
    initialize: function(name) {
        this.name = name;
    },

    whoami: function() {
        console.log("I am", this.name);
    }
});

new MyClass('joe').whoami();
