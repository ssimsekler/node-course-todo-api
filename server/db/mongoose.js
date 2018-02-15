const mongoose = require('mongoose');

const dbName = 'ToDoApp';
const url = process.env.MONGODB_URI || `mongodb://localhost:27017/${dbName}`;

mongoose.Promise = global.Promise;
mongoose.connect(`${url}`)
    .then(() => {
        console.log(`URL: ${url}`, ' MongoDB connection established.');
    })
    .catch((err) => {
        console.log(`URL: ${url}`, err);
    });

module.exports.mongoose = mongoose;