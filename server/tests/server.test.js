const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server.js');
const { Todo } = require('../models/todo.js');
const { User } = require('../models/user.js');

const initialTestTodos = [{
    _id: new ObjectID(),
    text: 'Test to-do 01'
}, {
    text: 'Test to-do 02'
}, {
    text: 'Test to-do 03'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(initialTestTodos);
    }).then(() => {
        done();
    });
})

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            }).end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text }).then((todos) => {
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
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(initialTestTodos.length);
                    done();
                }).catch((e) => done(e));
            });
    })
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
