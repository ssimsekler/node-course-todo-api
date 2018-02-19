const jwt = require('jsonwebtoken');

const {
    ObjectID
} = require('mongodb');

const {
    Todo
} = require('../../models/todo.js');

const {
    User
} = require('../../models/user.js');

const secretKey = 'abc123';

var testUsers = [];
for (let i = 0; i < 5; i++) {
    let userId = new ObjectID();
    let userSuffix = (i+1).toString();
    testUsers.push({
        _id: userId,
        email: `person${userSuffix}@acme.com`,
        password: `Password${userSuffix}!`,
        name: `Person${userSuffix} Acme`,
        tokens: [{
            access: 'auth',
            token: jwt.sign({
                _id: userId,
                access: 'auth'
            }, secretKey).toString()
        }]
    });
}
// var userId = new ObjectID();
// const testUsers = [{
//     _id: userId,
//     email: 'person01@acme.com',
//     password: 'Password01!',
//     name: 'Person01 Acme',
//     tokens: [{
//         access: 'auth',
//         token: jwt.sign({
//             _id: userId,
//             access: 'auth'
//         }, secretKey).toString()
//     }]
// }, {
//     _id: new ObjectID(),
//     email: 'person02@acme.com',
//     password: 'Password02!',
//     name: 'Person02 Acme'
// }, {
//     _id: new ObjectID(),
//     email: 'person03@acme.com',
//     password: 'Password03!',
//     name: 'Person03 Acme'
// }, {
//     _id: new ObjectID(),
//     email: 'person04@acme.com',
//     password: 'Password04!',
//     name: 'Person04  Acme'
// }];


const testTodos = [{
    _id: new ObjectID(),
    text: 'Test to-do 01'
}, {
    _id: new ObjectID(),
    text: 'Test to-do 02'
}, {
    _id: new ObjectID(),
    text: 'Test to-do 03'
}];

const populateTestUsers = (done) => {
    User.remove({}).then(() => {
        // return User.insertMany(testUsers);
        var savePromises = [];
        testUsers.forEach((testUser) => {
            savePromises.push(new User(testUser).save());
        });
        return Promise.all(savePromises);
    }).then(() => {
        done();
    });
};

const populateTestTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(testTodos);
    }).then(() => {
        done();
    });
};

module.exports = {
    testUsers,
    populateTestUsers,
    testTodos,
    populateTestTodos
};