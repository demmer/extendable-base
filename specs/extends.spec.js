var expect = require('chai').expect;

var errors = require('../examples/extends');

describe('extends', function() {
    it('supports instanceof', function() {
        expect(errors.BaseError instanceof Error);
        expect(errors.BadRequestError instanceof Error);
        expect(errors.NotFoundError instanceof Error);
        expect(errors.BadRequestError instanceof errors.BaseError);
        expect(errors.NotFoundError instanceof errors.BaseError);
    });

    it('supports a default constructor', function() {
        expect(new errors.BadRequestError().toJSON())
            .deep.equal({ status: 400, message: 'Not Found' });
        expect(new errors.NotFoundError().toJSON())
            .deep.equal({ status: 404, message: 'Bad Request' });
    });

    it('supports constructor arguments', function() {
        expect(new errors.BadRequestError("Invalid request").toJSON())
            .deep.equal({ status: 400, message: 'Invalid request' });

        expect(new errors.BadRequestError("Unauthorized", 401).toJSON())
            .deep.equal({ status: 401, message: 'Unauthorized' });
    });
});
