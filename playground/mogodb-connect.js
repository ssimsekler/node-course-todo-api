// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'ToDoApp';

MongoClient.connect(url, (err, client) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Connected to MongoDB server.');

    // var collection = client.db(dbName).collection('Todos')
    
    // collection.insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log(err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // var collection = client.db(dbName).collection('Users')
    
    // collection.insertOne({
    //     name: 'Serdar',
    //     age: 36,
    //     location: 'London'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log(err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    client.close();

});