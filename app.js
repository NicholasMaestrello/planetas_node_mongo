const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const connectionString = 'mongodb://localhost:27017'

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const responseStatus = {
    success: 'success',
    error: 'error'
}

const idError = 'Invalid id. Id must be a single String of 12 bytes or a string of 24 hex characters'


// app.use('/api/planetas', require('./planetas/user-routes'))



MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')

        const db = client.db('local')
        const planetasCollection = db.collection('planetas')

        app.get('/api/planetas', (req, res) => {
            const filter = createFilter(req.query)

            planetasCollection.find(filter).toArray()
                .then(result => res.json(result))
        })

        app.get('/api/planetas/:id', (req, res) => {
            const id = req.params.id

            if (!ObjectId.isValid(id)) {
                responseError(res, [idError])
            } else {
                planetasCollection.findOne({ "_id": ObjectId(id) })
                    .then(result => res.json(result))
                    .catch(error => responseError(res, [error]))
            }
        })

        app.post('/api/planetas', (req, res) => {
            const errors = validatePlaneta(req.body, res)
            
            if (errors.length) {
                responseError(res, [errors])
            } else {
                planetasCollection
                    .insertOne(createPlanetaEnity(req.body))
                    .then(result => validateInsertPlaneta(result, res))
                    .catch(error => responseError(res, [error]))
            }
        })

        app.put('/api/planetas/:id', (req, res) => {
            const id = req.params.id
            const errors = validateIdAndPlaneta(id, req.body)

            if (errors.length) {
                responseError(res, [errors])
            } else {
                const query = { "_id": ObjectId(id) }
                const update = { $set: createPlanetaEnity(req.body) }
                const options = { upsert: true }

                planetasCollection.findOneAndUpdate(query, update, options)
                    .then(result => validateUpdatePlaneta(result.value, res))
                    .catch(error => responseError(res, [error]))
            }
        })

        app.delete('/api/planetas/:id', (req, res) => {
            const id = req.params.id

            if (!ObjectId.isValid(id)) {
                responseError(res, [idError])
            } else {
                const query = { "_id": ObjectId(id) }

                planetasCollection.findOneAndDelete(query)
                    .then(result => validateDeletePlaneta(res))
                    .catch(error => responseError(res, [error]))
            }
        })

        app.use((req, res) => {
            res.status(404)
        })

        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })
    .catch(err => console.log(err))


function validatePlaneta(body) {
    const errors = []

    if (!body.nome) {
        errors.push('Nome não especificado')
    }
    if (!body.clima) {
        errors.push('Clima não especificado')
    }
    if (!body.terreno) {
        errors.push('terreno não especificado')
    }
    return errors
}

function validateIdAndPlaneta(id, body) {
    const errors = [...validatePlaneta(body)]

    if (!ObjectId.isValid(id)) {
        errors.push(idError)
    }
    return errors
}

function createPlanetaEnity(body) {
    return {
        nome: body.nome,
        clima: body.clima,
        terreno: body.terreno
    }
}

function validateInsertPlaneta(result, response) {
    response.json({
        status: responseStatus.success,
        insertedId: result.insertedId
    })
}

function validateUpdatePlaneta(result, response) {
    response.json({
        status: responseStatus.success,
        data: result
    })
}

function validateDeletePlaneta(response) {
    response.json({
        status: responseStatus.success
    })
}

function responseError(response, errors) {
    console.log(errors)
    response
        .status(400)
        .json({
            status: responseStatus.error,
            errors: errors
        })
}

function createFilter(requestQuery) {
    const filter = {}
    if (requestQuery.nome) {
        filter.nome = requestQuery.nome
    }
    if (requestQuery.clima) {
        filter.clima = requestQuery.clima
    }
    if (requestQuery.terreno) {
        filter.terreno = requestQuery.terreno
    }
    return filter
}
