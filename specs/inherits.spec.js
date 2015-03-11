
var Base = require('extendable-base');
var expect = require('chai').expect;

describe("base class", function() {
    function BaseClass() {
        this.base_was_here = true;
    }
    
    var DerivedClass = Base.inherits(BaseClass, {
        initialize: function() {
            this.derived_was_here = true;
        }
    });

    it("calls base class constructor", function() {
        var d = new DerivedClass();
        
        expect(d.base_was_here).to.equal(true);
        expect(d.derived_was_here).to.equal(true);
    });
});
