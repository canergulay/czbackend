const mongoose = require('mongoose')

const deletedSchema = mongoose.Schema({type:String},{timestamps:true,strict:false})

const Deleted = mongoose.model('Deleted',deletedSchema)

module.exports = Deleted