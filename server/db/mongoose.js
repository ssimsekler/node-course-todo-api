const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(`${url}`)
    .then(() => {
        console.log(`URL: ${url}`, ' MongoDB connection established.');
    })
    .catch((err) => {
        console.log(`URL: ${url}`, err);
    });

module.exports.mongoose = mongoose;