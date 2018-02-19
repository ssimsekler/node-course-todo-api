const expect = require('expect');
const request = require('supertest');
const {
    ObjectID
} = require('mongodb');

const {
    mongoose //eslint-disable-line no-unused-vars
} = require('../db/mongoose.js'); 
const {
    app
} = require('../server.js');
const {
    User
} = require('../models/user.js');

const initialTestUsers = [{
    _id: new ObjectID(),
    email: 'person01@acme.com',
    password: 'Password01!',
    name: 'Person01 Acme'
}, {
    _id: new ObjectID(),
    email: 'person02@acme.com',
    password: 'Password02!',
    name: 'Person02 Acme'
}, {
    _id: new ObjectID(),
    email: 'person03@acme.com',
    password: 'Password03!',
    name: 'Person03 Acme'
}, {
    _id: new ObjectID(),
    email: 'person04@acme.com',
    password: 'Password04!',
    name: 'Person04  Acme'
}];

beforeEach((done) => {
    User.remove({}).then(() => {
        return User.insertMany(initialTestUsers);
    }).then(() => {
        done();
    });
});

describe('============ TEST API for the USER entity ============', () => {
    describe('POST /users', () => {
        it('should create a new user', (done) => {
            var newUser = {
                _id: new ObjectID(),
                email: 'personTestCreate@acme.com',
                password: 'Passwordtestuser01!',
                name: 'Person TestCreate Acme'
            };

            request(app)
                .post('/users')
                .send(newUser)
                .expect(200)
                .expect((res) => {
                    expect(res.body.name).toBe(newUser.name);
                }).end((err, res) => { // eslint-disable-line no-unused-vars
                    if (err) {
                        return done(err);
                    }
                    User.find({
                        name: newUser.name
                    }).then((users) => {
                        expect(users.length).toBe(1);
                        expect(users[0].name).toBe(newUser.name);
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should not create a user with invalid body data', (done) => {
            request(app)
                .post('/users')
                .send({})
                .expect(400)
                .end((err, res) => { // eslint-disable-line no-unused-vars
                    if (err) {
                        return done(err);
                    }

                    User.find().then((users) => {
                        expect(users.length).toBe(initialTestUsers.length);
                        done();
                    }).catch((e) => done(e));
                });
        });
    });

    describe('GET /users', () => {
        it('should get all users', (done) => {
            request(app)
                .get('/users')
                .expect(200)
                .expect((res) => {
                    expect(res.body.users.length).toBe(initialTestUsers.length);
                })
                .end(done);
        });
    });

    describe('GET /users/:id', () => {
        it('should return user doc', (done) => {
            request(app)
                .get(`/users/${initialTestUsers[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.user.text).toBe(initialTestUsers[0].text);
                })
                .end(done);
        });

        it('should return 404 if document is not found', (done) => {
            var newTestID = new ObjectID();
            // console.log('Test object ID:', newTestID);
            request(app)
                .get(`/users/${newTestID}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object-ids', (done) => {
            request(app)
                .get(`/users/123`)
                .expect(404)
                .end(done);
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete user doc', (done) => {
            let idToDelete = initialTestUsers[1]._id.toHexString();
            request(app)
                .delete(`/users/${idToDelete}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.user._id).toBe(idToDelete);
                })
                .end((err, res) => { // eslint-disable-line no-unused-vars
                    if (err) {
                        return done(err);
                    }
                    User.findById(idToDelete).then((user) => {
                        expect(user).toNotExist();
                        done();
                    }).catch((e) => {
                        console.log(e);
                    });
                });
        });

        it('should return 404 if document is not found', (done) => {
            var newTestID = new ObjectID();
            // console.log('Test object ID:', newTestID);
            request(app)
                .delete(`/users/${newTestID}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object-ids', (done) => {
            request(app)
                .delete(`/users/123`)
                .expect(404)
                .end(done);
        });
    });

    describe('PATCH /users/:id', () => {
        it('should update user doc', (done) => {
            var idToUpdate = initialTestUsers[1]._id.toHexString();
            var updatedName = "Updated Name";
            request(app)
                .patch(`/users/${idToUpdate}`)
                .send({
                    "name": updatedName
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.name).toBe(updatedName);
                })
                .end((err, res) => { // eslint-disable-line no-unused-vars
                    if (err) {
                        return done(err);
                    }
                    User.findById(idToUpdate).then((user) => {
                        expect(user.name).toBe(updatedName);
                        done();
                    }).catch((e) => {
                        console.log(e);
                    });
                });
        });

        it('should return 404 if document is not found', (done) => {
            var newTestID = new ObjectID();
            // console.log('Test object ID:', newTestID);
            request(app)
                .patch(`/users/${newTestID}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object-ids', (done) => {
            request(app)
                .patch(`/users/123`)
                .expect(404)
                .end(done);
        });
    });
});