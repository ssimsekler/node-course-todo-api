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

const {
    testUsers,
    populateTestUsers
} = require('./seed/seed.js');

beforeEach(populateTestUsers);

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
                    expect(res.headers['x-auth']).toExist();
                    expect(res.body._id).toExist();
                    expect(res.body.name).toBe(newUser.name);
                    expect(res.body.email).toBe(newUser.email);
                }).end((err, res) => { // eslint-disable-line no-unused-vars
                    if (err) {
                        return done(err);
                    }
                    User.find({
                        email: newUser.email
                    }).then((users) => {
                        expect(users.length).toBe(1);
                        expect(users[0].email).toBe(newUser.email);
                        expect(users[0].name).toBe(newUser.name);
                        expect(users[0].password).toNotBe(newUser.password);
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should not create a user with empty body data', (done) => {
            request(app)
                .post('/users')
                .send({})
                .expect(400)
                .end((err, res) => { // eslint-disable-line no-unused-vars
                    if (err) {
                        return done(err);
                    }

                    User.find().then((users) => {
                        expect(users.length).toBe(testUsers.length);
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should not create a user with invalid body data', (done) => {
            var newUser = {
                _id: new ObjectID(),
                email: 'personTestCreateacme.com',
                password: 'Passwordtestuser01!',
                name: 'Person TestCreate Acme'
            };

            request(app)
                .post('/users')
                .send(newUser)
                .expect(400)
                .expect((res) => { //eslint-disable-line no-unused-vars
                    // expect(res.body).toBe({});
                }).end((err, res) => { // eslint-disable-line no-unused-vars
                    if (err) {
                        return done(err);
                    }

                    User.find().then((users) => {
                        expect(users.length).toBe(testUsers.length);
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should not create a user with existing e-mail address', (done) => {
            var newUser = {
                _id: new ObjectID(),
                email: testUsers[0].email,
                password: 'Passwordtestuser01!',
                name: 'Person TestCreate Acme'
            };

            request(app)
                .post('/users')
                .send(newUser)
                .expect(400)
                .expect((res) => { //eslint-disable-line no-unused-vars
                    // expect(res.body).toBe({});
                }).end((err, res) => { // eslint-disable-line no-unused-vars
                    if (err) {
                        return done(err);
                    }

                    User.find().then((users) => {
                        expect(users.length).toBe(testUsers.length);
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
                    expect(res.body.users.length).toBe(testUsers.length);
                })
                .end(done);
        });
    });

    describe('GET /users/me', () => {
        it('should get my user based on token in the header', (done) => {
            request(app)
                .get('/users/me')
                .set('x-auth', testUsers[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body._id).toBe(testUsers[0]._id.toHexString());
                    expect(res.body.email).toBe(testUsers[0].email);
                })
                .end(done);
        });
        it('should return 401 if bot authenticated', (done) => {
            request(app)
                .get('/users/me')
                .set('x-auth', '123')
                .expect(401)
                .end(done);
        });
    });

    describe('GET /users/:id', () => {
        it('should return user doc', (done) => {
            request(app)
                .get(`/users/${testUsers[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.user.text).toBe(testUsers[0].text);
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
            let idToDelete = testUsers[1]._id.toHexString();
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
            var idToUpdate = testUsers[1]._id.toHexString();
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