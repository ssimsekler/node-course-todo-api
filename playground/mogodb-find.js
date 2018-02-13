// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'ToDoApp';

MongoClient.connect(url, (err, client) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Connected to MongoDB server.');

    var collection = client.db(dbName).collection('Todos')

    collection.find({
        completed: false
    }).toArray().then((docs) => {
        console.log('To-Dos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log(err);
    });

    //client.close();

});