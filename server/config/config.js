
const env = process.env.NODE_ENV || 'development';
console.log('env *****', env);

const dbName = 'ToDoApp';
if (env === 'development') {
    process.env.MONGODB_URI = `mongodb://localhost:27017/${dbName}`;
} else if (env === 'test') {
    process.env.MONGODB_URI = `mongodb://localhost:27017/${dbName}Test`;
};

config = { port: process.env.PORT || 3000 };
debugger;
module.exports.config = config;