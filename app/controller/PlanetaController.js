const Planeta = require('../model/Planeta')
const axios = require('axios');
const ObjectId = require('mongodb').ObjectID;


const idError = 'Invalid id. Id must be a single String of 12 bytes or a string of 24 hex characters'
const swapiUri = 'https://swapi.dev/api/planets/'

class PlanetaService {
    constructor() {
    }

    _sendErrorsResponse(res, errors) {
        return res
            .status(400)
            .json({ errors: [...errors] })
    }

    createFilter(requestQuery) {
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
}

class SwaiapiService {
    async getQuantidadeAparicoesPlaneta(name) {
        const url = `${swapiUri}?search=${name}`
        const apiResponse = await axios.get(url)
        let quantidadeAparicoes = 0
        if (apiResponse.data.results.length == 1) {
            const planetaSearched = apiResponse.data.results[0]
            quantidadeAparicoes = planetaSearched.films.length ? planetaSearched.films.length : 0
        }
        return quantidadeAparicoes
    }

    createResponseJson(data, quantidadeAparicoes) {
        return {
            _id: data._id,
            nome: data.nome,
            clima: data.clima,
            terreno: data.terreno,
            quantidadeAparicoes: quantidadeAparicoes
        }
    }
}

const planetaService = new PlanetaService()
const swaiapiService = new SwaiapiService()

class PlanetaController {
    async list(req, res) {
        const filter = planetaService.createFilter(req.query)

        const data = await Planeta.find(filter)

        const resultArray = await Promise.all(data.map(async (i) => {
            const quantidadeAparicoesPlaneta = await swaiapiService.getQuantidadeAparicoesPlaneta(i.nome)
            return swaiapiService.createResponseJson(i, quantidadeAparicoesPlaneta)
        }));

        return res.json(resultArray)
    }

    async findOne(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            return planetaService._sendErrorsResponse(res, [idError])
        }

        const query = { "_id": ObjectId(id) }
        const data = await Planeta.findOne(query)

        const quantidadeAparicoesPlaneta = await swaiapiService.getQuantidadeAparicoesPlaneta(data.nome)

        return res.json(swaiapiService.createResponseJson(data, quantidadeAparicoesPlaneta))
    }

    async create(req, res) {
        const data = await Planeta.create(req.body)

        return res.json(data)
    }

    async update(req, res) {
        const id = req.params.id

        if (!ObjectId.isValid(id)) {
            return planetaService._sendErrorsResponse(res, [idError])
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
            return planetaService._sendErrorsResponse(res, [idError])
        }

        const query = { "_id": ObjectId(id) }
        const data = await Planeta.findOneAndDelete(query)
        return res.json(data)
    }
}

module.exports = new PlanetaController()