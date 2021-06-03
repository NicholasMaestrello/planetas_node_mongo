const mongoose = require('mongoose')

const dbHandler = require('./db-handler')
const planetaController = require('../app/controller/PlanetaController')
const planetaModel = require('../app/model/Planeta')

const axios = require('axios')

jest.mock('axios')

beforeAll(async () => await dbHandler.connect())

afterEach(async () => await dbHandler.clearDatabase())

afterAll(async () => await dbHandler.closeDatabase())

describe('planeta', () => {
    it('Can be created', async () => {
        expect(async () => planetaController.create(plantaRequestMock, responseCallMocked))
            .not
            .toThrow()
    })

    fit('Should give correct element', async () => {
        axios.get.mockImplementationOnce(() => Promise.resolve(swaiApiMock))

        const createdPlaneta = await planetaController.create(plantaRequestMock, responseCallMocked)
        const request = { params: { id: createdPlaneta._id } }

        const foundPlaneta = await planetaController.findOne(request, responseCallMocked)

        expect(foundPlaneta._id).toStrictEqual(createdPlaneta._id)
        expect(foundPlaneta.nome).toStrictEqual(createdPlaneta.nome)
        expect(foundPlaneta.clima).toStrictEqual(createdPlaneta.clima)
        expect(foundPlaneta.terreno).toStrictEqual(createdPlaneta.terreno)
        expect(foundPlaneta.quantidadeAparicoes).toStrictEqual(1)
    })

    it('Should list all elements', async () => {
        axios.get.mockImplementationOnce(() => Promise.resolve(swaiApiMock))

        await planetaController.create(plantaRequestMock, responseCallMocked)

        const request = { query: {} }
        const response = await planetaController.list(request, responseCallMocked)

        expect(response.length).toStrictEqual(1)
    })


    it('Should return null if nothing is found', async () => {
        const request = { params: { id: mongoose.Types.ObjectId() } }
        const response = await planetaController.findOne(request, responseCallMocked)
        expect(response).toBeNull()
    })

    it('Should delete', async () => {
        axios.get.mockImplementationOnce(() => Promise.resolve(swaiApiMock))

        const createdPlanet = await planetaController.create(plantaRequestMock, responseCallMocked)

        let request = { params: { id: createdPlanet._id } }
        await planetaController.delete(request, responseCallMocked)

        request = { query: {} }
        const listedPlanets = await planetaController.list(request, responseCallMocked)

        expect(listedPlanets.length).toStrictEqual(0)
    })

    it('Should update', async () => {
        axios.get.mockImplementationOnce(() => Promise.resolve(swaiApiMock))

        const createdPlaneta = await planetaController.create(plantaRequestMock, responseCallMocked)

        const modifiedNome = 'Nome 2'
        createdPlaneta.nome = modifiedNome
        let request = { params: { id: createdPlaneta._id }, body: createdPlaneta }
        await planetaController.update(request, responseCallMocked)

        request = { params: { id: createdPlaneta._id } }
        const foundPlaneta = await planetaController.findOne(request, responseCallMocked)

        expect(foundPlaneta._id).toStrictEqual(createdPlaneta._id)
        expect(foundPlaneta.nome).toStrictEqual(createdPlaneta.nome)
        expect(foundPlaneta.clima).toStrictEqual(createdPlaneta.clima)
        expect(foundPlaneta.terreno).toStrictEqual(createdPlaneta.terreno)
        expect(foundPlaneta.quantidadeAparicoes).toStrictEqual(1)
    })
})


const plantaRequestMock = {
    nome: 'nome1',
    clima: 'clima1',
    terreno: 'terreno1'
}

const responseCallMocked = { json: r => r }

const swaiApiMock = {
    data: {
        results: [
            {
                films: [
                    'mock'
                ]
            }
        ]
    }
}