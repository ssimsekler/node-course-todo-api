const express = require('express');
const bodyParser = require('body-parser');

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
        console.log('Record saved', doc);
        res.send(doc);
    }, (err) => {
        console.log(err);
        res.status('400').send(err);
    });
    console.log('POST', req.body);
});

app.get('/todos', (req, res) => {
    console.log('GET', req.body);
});

app.listen(port, () => {
    console.log(`Node server started on port ${port}`);
})