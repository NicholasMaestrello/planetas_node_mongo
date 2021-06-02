const mongoose = require('mongoose')

const PlanetaSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true
    },
    clima: {
        type: String,
        require: true  
    },
    terreno: {
        type: String,
        require: true  
    }
})

module.exports = mongoose.model('Planeta', PlanetaSchema)