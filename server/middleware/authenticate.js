const {
    User
} = require('../models/user.js');

//Authentication
var authenticate = (req, res, next) => {

    var token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        if (!user) {
            // return res.status(401).send();
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((err) => {
        res.status(401).send(err);
    });;

};

module.exports.authenticate = authenticate;