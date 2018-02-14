const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017';
const dbName = 'ToDoApp';

mongoose.Promise = global.Promise;
mongoose.connect(`${url}/${dbName}`);

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

var newTodo = new Todo({
    text: 'Cook dinner'
});

newTodo.save().then((doc) => {
    console.log('Saved to-do:', doc);
}, (e) => {
    console.log(e);
});

var otherTodo = new Todo({
    text: 'Feed the cat',
    completed: true,
    completedAt: 123
});

otherTodo.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
    console.log(e);
});