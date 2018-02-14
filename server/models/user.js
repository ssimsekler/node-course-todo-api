const mongoose = require('mongoose');

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    name: {
        type: String,
        required: false,
        minlength: 1,
        trim: true
    }
});

module.exports.User = User;