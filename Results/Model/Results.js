const mongooes = require('mongoose')
const { Schema } = mongooes

const Ressultschemas = new Schema({
    Standard:{
        type:String,
        required:true
    },
    Class_code:{
        type:String,
        require:true
    },
    
})