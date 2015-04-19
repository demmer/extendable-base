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
            module.exports = __external_chai;
        },
        function (module, exports) {
            module.exports = __external_extendablebase;
        },
        function (module, exports) {
            var Base = _require(1);
            var expect = _require(0).expect;
            describe('base class', function () {
                function BaseClass() {
                    this.base_was_here = true;
                }
                var DerivedClass = Base.inherits(BaseClass, {
                        initialize: function () {
                            this.derived_was_here = true;
                        }
                    });
                it('calls base class constructor', function () {
                    var d = new DerivedClass();
                    expect(d.base_was_here).to.equal(true);
                    expect(d.derived_was_here).to.equal(true);
                });
            });
        }
    ];
    return _require(2);
}));