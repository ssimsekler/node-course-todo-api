const env = process.env.NODE_ENV || 'development';
console.log('env *****', env);

if (env === 'development' || env === 'test') {
    var config = require('./config.json');
    var envConfig = config[env];
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}
var configOut = {
    port: process.env.PORT || 3000,
    mongodb_uri: process.env.MONGODB_URI,
    jwt_secret: process.env.JWT_SECRET
};
console.log('Config:', configOut);
console.log('process.env', process.env.MONGODB_URI, process.env.JWT_SECRET);

module.exports.config = configOut;