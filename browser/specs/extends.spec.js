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
            var BaseError = Base.inherits(Error, {
                    default_status: 500,
                    initialize: function (message, status) {
                        Error.call(this, message);
                        this.message = message || this.default_message || '';
                        this.status = status || this.default_status;
                    },
                    toJSON: function () {
                        return {
                            status: this.status,
                            message: this.message
                        };
                    }
                });
            var NotFoundError = BaseError.extend({
                    default_status: 404,
                    default_message: 'Bad Request'
                });
            var BadRequestError = BaseError.extend({
                    default_status: 400,
                    default_message: 'Not Found'
                });
            module.exports = {
                BaseError: BaseError,
                NotFoundError: NotFoundError,
                BadRequestError: BadRequestError
            };
            if (require.main === module) {
                console.log(new BadRequestError().toJSON());    // { status: 400, message: 'Not Found' }
                // { status: 400, message: 'Not Found' }
                console.log(new BadRequestError('Invalid request').toJSON());    // { status: 400, message: 'Invalid request' }
                // { status: 400, message: 'Invalid request' }
                console.log(new BadRequestError('Unauthorized', 401).toJSON());    // { status: 401, message: 'Unauthorized' }
                // { status: 401, message: 'Unauthorized' }
                console.log(new NotFoundError().toJSON());    // { status: 404, message: 'Bad Request' }
            }
        },
        function (module, exports) {
            module.exports = __external_chai;
        },
        function (module, exports) {
            module.exports = __external_extendablebase;
        },
        function (module, exports) {
            var expect = _require(1).expect;
            var errors = _require(0);
            describe('extends', function () {
                it('supports instanceof', function () {
                    expect(errors.BaseError instanceof Error);
                    expect(errors.BadRequestError instanceof Error);
                    expect(errors.NotFoundError instanceof Error);
                    expect(errors.BadRequestError instanceof errors.BaseError);
                    expect(errors.NotFoundError instanceof errors.BaseError);
                });
                it('supports a default constructor', function () {
                    expect(new errors.BadRequestError().toJSON()).deep.equal({
                        status: 400,
                        message: 'Not Found'
                    });
                    expect(new errors.NotFoundError().toJSON()).deep.equal({
                        status: 404,
                        message: 'Bad Request'
                    });
                });
                it('supports constructor arguments', function () {
                    expect(new errors.BadRequestError('Invalid request').toJSON()).deep.equal({
                        status: 400,
                        message: 'Invalid request'
                    });
                    expect(new errors.BadRequestError('Unauthorized', 401).toJSON()).deep.equal({
                        status: 401,
                        message: 'Unauthorized'
                    });
                });
            });
        }
    ];
    return _require(3);
}));