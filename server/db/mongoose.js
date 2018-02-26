const {
    config //eslint-disable-line no-unused-vars
} = require('../config/config.js'); 

const mongoose = require('mongoose');

const url = config.mongodb_uri;

mongoose.Promise = global.Promise;
mongoose.connect(`${url}`)
    .then(() => {
        console.log(`URL: ${url}`, ' MongoDB connection established.');
    })
    .catch((err) => {
        console.log(`URL: ${url}`, err);
    });

module.exports.mongoose = mongoose;