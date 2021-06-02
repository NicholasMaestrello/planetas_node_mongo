const express = require('express')
const mongoose = require('mongoose')
const db = { uri: 'mongodb://localhost:27017/b2w' }

const routes = require('./routes')

class App {
    constructor() {
        this.express = express()

        this.database()
        this.middlewares()
        this.routes()

        this.express.listen(3000, () => {
            console.log('B2W api rest for Star Wars Planets')
        })
    }

    database() {
        mongoose.connect(db.uri, { useNewUrlParser: true, useUnifiedTopology: true })
    }

    middlewares() {
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: false }))
    }

    routes() {
        this.express.use(routes)
        this.express.use((req, res) => {
            res.status(404)
        })
    }
}

module.exports = new App().express