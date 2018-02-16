const expect = require('expect');
const request = require('supertest');
const {
    ObjectID
} = require('mongodb');

const {
    mongoose  //eslint-disable-line no-unused-vars
} = require('../db/mongoose.js');
const {
    app
} = require('../server.js');
const {
    Todo
} = require('../models/todo.js');

const initialTestTodos = [{
    _id: new ObjectID(),
    text: 'Test to-do 01'
}, {
    _id: new ObjectID(),
    text: 'Test to-do 02'
}, {
    _id: new ObjectID(),
    text: 'Test to-do 03'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(initialTestTodos);
    }).then(() => {
        done();
    });
});

describe('============ TEST API for the TODO entity ============', () => {
    describe('POST /todos', () => {
        it('should create a new todo', (done) => {
            var text = 'Test todo text NEW';

            request(app)
                .post('/todos')
                .send({
                    text
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.text).toBe(text);
                }).end((err, res) => { // eslint-disable-line no-unused-vars
                    if (err) {
                        return done(err);
                    }

                    Todo.find({
                        text
                    }).then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should not create a todo with invalid body data', (done) => {
            request(app)
                .post('/todos')
                .send({})
                .expect(400)
                .end((err, res) => { // eslint-disable-line no-unused-vars
                    if (err) {
                        return done(err);
                    }

                    Todo.find().then((todos) => {
                        expect(todos.length).toBe(initialTestTodos.length);
                        done();
                    }).catch((e) => done(e));
                });
        });
    });

    describe('GET /todos', () => {
        it('should get all to-dos', (done) => {
            request(app)
                .get('/todos')
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(initialTestTodos.length);
                })
                .end(done);
        });
    });

    describe('GET /todos/:id', () => {
        it('should return to-do doc', (done) => {
            request(app)
                .get(`/todos/${initialTestTodos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(initialTestTodos[0].text);
                })
                .end(done);
        });

        it('should return 404 if document is not found', (done) => {
            var newTestID = new ObjectID();
            // console.log('Test object ID:', newTestID);
            request(app)
                .get(`/todos/${newTestID}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object-ids', (done) => {
            request(app)
                .get(`/todos/123`)
                .expect(404)
                .end(done);
        });
    });

    describe('DELETE /todos/:id', () => {
        it('should delete to-do doc', (done) => {
            let idToDelete = initialTestTodos[1]._id.toHexString();
            request(app)
                .delete(`/todos/${idToDelete}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo._id).toBe(idToDelete);
                })
                .end((err, res) => { // eslint-disable-line no-unused-vars
                    if (err) {
                        return done(err);
                    }
                    Todo.findById(idToDelete).then((todo) => {
                        expect(todo).toNotExist();
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
                .delete(`/todos/${newTestID}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object-ids', (done) => {
            request(app)
                .delete(`/todos/123`)
                .expect(404)
                .end(done);
        });
    });

    describe('PATCH /todos/:id', () => {
        it('should update to-do doc', (done) => {
            var idToUpdate = initialTestTodos[1]._id.toHexString();
            var updatedText = "Updated";
            request(app)
                .patch(`/todos/${idToUpdate}`)
                .send({
                    "completed": true,
                    "text": updatedText
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.text).toBe(updatedText);
                    expect(res.body.completed).toBe(true);
                    expect(res.body.completedAt).toBeA('number');
                })
                .end((err, res) => { // eslint-disable-line no-unused-vars
                    if (err) {
                        return done(err);
                    }
                    Todo.findById(idToUpdate).then((todo) => {
                        expect(todo.text).toBe(updatedText);
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
                .patch(`/todos/${newTestID}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object-ids', (done) => {
            request(app)
                .patch(`/todos/123`)
                .expect(404)
                .end(done);
        });
    });
});