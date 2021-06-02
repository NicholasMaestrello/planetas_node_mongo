const Planeta = require('../model/Planeta')
const ObjectId = require('mongodb').ObjectID;


const idError = 'Invalid id. Id must be a single String of 12 bytes or a string of 24 hex characters'

function _sendErrorsResponse(res, errors) {
    return res
        .status(400)
        .json({ errors: [...errors] })
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

class PlanetaController {
    async list(req, res) {
        const filter = createFilter(req.query)

        const data = await Planeta.find(filter)

        return res.json(data)
    }

    async findOne(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            return _sendErrorsResponse(res, [idError])
        }

        const query = { "_id": ObjectId(id) }
        const data = await Planeta.findOne(query)

        return res.json(data)
    }

    async create(req, res) {
        const data = await Planeta.create(req.body)

        return res.json(data)
    }

    async update(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            return _sendErrorsResponse(res, [idError])
        }

        const query = { "_id": ObjectId(id) }
        const update = { $set: req.body }
        const options = { upsert: true }

        const data = await Planeta.findOneAndUpdate(query, update, options)

        return res.json(data)
    }

    async delete(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            return _sendErrorsResponse(res, [idError])
        }

        const query = { "_id": ObjectId(id) }
        const data = await Planeta.findOneAndDelete(query)
        return res.json(data)
    }
}

module.exports = new PlanetaController()