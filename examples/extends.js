var Base = require('../index');

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
