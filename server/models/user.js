const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const {
    config
} = require('../config/config.js');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid e-mail address!'
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    name: {
        type: String,
        required: true,
        minlength: 3
    },

    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }

    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email', 'name']);
};

UserSchema.methods.generateAuthToken = function () { //Not an arrow function because we require this binding
    var user = this;

    if (!user._id) {
        return Promise.reject();
    }

    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, config.jwt_secret).toString();

    user.tokens = user.tokens.concat([{
        access,
        token
    }]);

    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) { //Not an arrow function because we require this binding
    var user = this;

    return user.update({
        $pull: {
            tokens: {
                token: token
            }
        }
    });
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, config.jwt_secret);
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        return Promise.reject('User not found!');
    };

    return User.findOne({
        _id: decoded._id,
        'tokens.access': 'auth',
        'tokens.token': token
    });

};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({
        email
    }).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => { //eslint-disable-line no-unused-vars
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(3, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports.User = User;