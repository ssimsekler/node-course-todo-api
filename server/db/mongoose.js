const mongoose = require('mongoose');

const url = (process.env.MONGODB_URI) ? encodeURIComponent(process.env.MONGODB_URI) : 'mongodb://localhost:27017';
const dbName = 'ToDoApp';

mongoose.Promise = global.Promise;
mongoose.connect(`${url}/${dbName}`);

module.exports.mongoose = mongoose;