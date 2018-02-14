const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose.js');
const { Todo } = require('./models/todo.js');
const { User } = require('./models/user.js');


const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc) => {
        // console.log('Record saved', doc);
        res.send(doc);
    }, (err) => {
        console.log(err);
        res.status('400').send(err);
    });
    // console.log('POST', req.body);
});

app.get('/todos', (req, res) => {
    // console.log('GET', req.body);
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (err) => {
        res.status(400).send(err);
    });

});

app.get('/todos/:id', (req, res) => {
    // console.log('GET', req.body);
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({error: 'ID not valid!'});
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => {
        res.status(400).send(err);
    });

});

app.listen(port, () => {
    console.log(`Node server started on port ${port}`);
})

module.exports = { app };