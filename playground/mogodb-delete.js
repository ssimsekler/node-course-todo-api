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

    collection.deleteMany({text: 'Eat lunch'}).then((result) => {
        console.log(result);
    });

    //client.close();

});