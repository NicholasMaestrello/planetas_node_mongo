const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb://localhost:27017'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('local')
        const planetasCollection = db.collection('planetas')
        const planetas = planetasCollection.find().toArray().then(res => console.log(res))
    })
    .catch(err => console.log(err))

module.exports = MongoClient