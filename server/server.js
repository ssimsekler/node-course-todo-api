const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {
    ObjectID
} = require('mongodb');

const {
    config
} = require('./config/config.js');

const { mongoose } = require('./db/mongoose.js'); //eslint-disable-line no-unused-vars

const {
    Todo
} = require('./models/todo.js');
const {
    User
} = require('./models/user.js');


var app = express();
app.use(bodyParser.json());

//================================================================
//======== TODO routes ===========================================
//================================================================

//================================================================
//======== TODO:CREATE ===========================================
//================================================================
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt
    });
    todo.save().then((doc) => {
        // console.log('Record saved', doc);
        res.send(doc);
    }, (err) => {
        console.log(err);
        res.status('400').send(err);
    }).catch((err) => {
        res.status(400).send(err);
    });
    // console.log('POST', req.body);
});

//================================================================
//======== TODO:READ ALL =========================================
//================================================================
app.get('/todos', (req, res) => {
    // console.log('GET', req.body);
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (err) => {
        res.status(400).send(err);
    });

});

//================================================================
//======== TODO:READ =============================================
//================================================================
app.get('/todos/:id', (req, res) => {
    // console.log('GET', req.body);
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            error: 'ID not valid!'
        });
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({
            todo
        });
    }).catch((err) => {
        res.status(400).send(err);
    });

});

//================================================================
//======== TODO:DELETE ===========================================
//================================================================
app.delete('/todos/:id', (req, res) => {
    // console.log('GET', req.body);
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            error: 'ID not valid!'
        });
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({
            todo
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

//================================================================
//======== TODO:UPDATE ===========================================
//================================================================
app.patch('/todos/:id', (req, res) => {
    // console.log('GET', req.body);
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            error: 'ID not valid!'
        });
    }

    if (_.isBoolean(req.body.completed) && req.body.completed) {
        body.completed = req.body.completed;
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {
            $set: body
        }, {
            new: true
        })
        .then((todo) => {
            // console.log('Record saved', doc);
            if (!todo) {
                res.status('404').send();
            } else {
                res.send(todo);
            }
        }, (err) => {
            console.log(err);
            res.status('404').send(err);
        }).catch((err) => {
            res.status(404).send(err);
        });
});

//================================================================
//======== USER Routes ===========================================
//================================================================

//================================================================
//======== USER:CREATE ===========================================
//================================================================
app.post('/users', (req, res) => {

    var UserIn = _.pick(req.body, ['email', 'pwdhash', 'name']);
    var user = new User(UserIn);
    user.save().then(() => {
        // console.log('Record saved', doc);
        return user.generateAuthToken();
    }, (err) => {
        console.log(err);
        res.status('400').send(err);
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
    // console.log('POST', req.body);
});

//================================================================
//======== USER:READ ALL =========================================
//================================================================
app.get('/users', (req, res) => {
    // console.log('GET', req.body);
    User.find().then((users) => {
        res.send({
            users
        });
    }, (err) => {
        res.status(400).send(err);
    });

});

//================================================================
//======== USER:READ =============================================
//================================================================
app.get('/users/:id', (req, res) => {
    // console.log('GET', req.body);
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            error: 'ID not valid!'
        });
    }

    User.findById(id).then((user) => {
        if (!user) {
            return res.status(404).send();
        }
        res.send({
            user
        });
    }).catch((err) => {
        res.status(400).send(err);
    });

});

//================================================================
//======== USER:DELETE ===========================================
//================================================================
app.delete('/users/:id', (req, res) => {
    // console.log('GET', req.body);
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            error: 'ID not valid!'
        });
    }

    User.findByIdAndRemove(id).then((user) => {
        if (!user) {
            return res.status(404).send();
        }
        res.send({
            user
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

//================================================================
//======== USER:UPDATE ===========================================
//================================================================
app.patch('/users/:id', (req, res) => {
    // console.log('GET', req.body);
    var id = req.params.id;
    var body = _.pick(req.body, ['email', 'pwdhash', 'name']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            error: 'ID not valid!'
        });
    }

    User.findByIdAndUpdate(id, {
            $set: body
        }, {
            new: true
        })
        .then((user) => {
            // console.log('Record saved', doc);
            if (!user) {
                res.status('404').send();
            } else {
                res.send(user);
            }
        }, (err) => {
            console.log(err);
            res.status('404').send(err);
        }).catch((err) => {
            res.status(404).send(err);
        });
});

//================================================================
//======== Start the server ======================================
//================================================================
app.listen(config.port, () => {
    console.log(`Node server started on port ${config.port}`);
});

module.exports = {
    app
};