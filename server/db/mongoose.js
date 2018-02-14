const mongoose = require('mongoose');

const url = (process.env.MONGODB_URI) ? encodeURIComponent(process.env.MONGODB_URI) : 'mongodb://localhost:27017';
const dbName = 'ToDoApp';

mongoose.Promise = global.Promise;
mongoose.connect(`${url}/${dbName}`)
    .then(() => {
        console.log(`URL: ${url}`, ' MongoDB connection established.');
    })
    .catch((err) => {
        console.log(`URL: ${url}`, err);
    });

module.exports.mongoose = mongoose;