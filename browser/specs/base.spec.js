(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([
            'chai',
            'underscore',
            'extendable-base'
        ], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('chai'), require('underscore'), require('extendable-base'));
    } else {
        // Browser globals
        this.extendable_base_specs = factory(chai, underscore, extendablebase);
    }
}(function (__external_chai, __external_underscore, __external_extendablebase) {
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
            var Base = _require(2);
            var Animal = Base.extend({
                    initialize: function () {
                        this.classname = 'Animal';
                        this.chain = this.classname;
                    },
                    ident: function () {
                        return 'I am an ' + this.classname;
                    },
                    legs: function () {
                        return 'I have ' + this._legs + ' legs';
                    }
                });
            var TwoLegged = Animal.extend({
                    // Prototype properties can be set inline
                    _legs: 2
                });
            var FourLegged = Animal.extend({
                    // Initialize is called for all classes
                    initialize: function () {
                        this._legs = 4;
                        this.chain = this.chain + '->FourLegged';
                    }
                });
            var Furry = {
                    initialize: function () {
                        this.chain = this.chain + '->Furry';
                    },
                    fur: function () {
                        return 'I have ' + this.fur_color + ' fur';
                    }
                };
            var FurryDog = FourLegged.extend(Furry).extend({
                    classname: 'FurryDog',
                    initialize: function (fur_color) {
                        this.fur_color = fur_color;
                        this.chain = this.chain + '->FurryDog';
                    }
                });
            module.exports = {
                Animal: Animal,
                TwoLegged: TwoLegged,
                FourLegged: FourLegged,
                Furry: Furry,
                FurryDog: FurryDog
            };
        },
        function (module, exports) {
            module.exports = __external_chai;
        },
        function (module, exports) {
            module.exports = __external_extendablebase;
        },
        function (module, exports) {
            var expect = _require(1).expect;
            var zoo = _require(0);
            var Animal = zoo.Animal;
            var TwoLegged = zoo.TwoLegged;
            var FourLegged = zoo.FourLegged;
            var FurryDog = zoo.FurryDog;
            describe('base class', function () {
                it('inherits properties', function () {
                    var a = new Animal();
                    expect(a.classname).to.equal('Animal');
                    expect(a.classname).equal('Animal');
                });
                it('calls the constructor', function () {
                    var a = new Animal();
                    expect(a.ident()).equal('I am an Animal');
                });
                it('supports polymorphism', function () {
                    var twolegs = new TwoLegged();
                    var fourlegs = new FourLegged();
                    expect(twolegs.legs()).equal('I have 2 legs');
                    expect(fourlegs.legs()).equal('I have 4 legs');
                });
                it('enables mixins', function () {
                    var dog = new FurryDog('brown');
                    expect(dog.legs()).equal('I have 4 legs');
                    expect(dog.fur()).equal('I have brown fur');
                });
                it('initializers are called in order of inheritance', function () {
                    var dog = new FurryDog('brown');
                    expect(dog.chain).equal('Animal->FourLegged->Furry->FurryDog');
                });
                it('handles instanceof', function () {
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
        }
    ];
    return _require(3);
}));