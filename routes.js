const express = require('express')
const routes = express.Router()

const PlanetaController = require('./app/controller/PlanetaController')

routes.get('/api/planeta', PlanetaController.list)
routes.get('/api/planeta/:id', PlanetaController.findOne)
routes.post('/api/planeta', PlanetaController.create)
routes.put('/api/planeta/:id', PlanetaController.update)
routes.delete('/api/planeta/:id', PlanetaController.delete)

module.exports = routes