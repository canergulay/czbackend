const mongoose = require('mongoose')

const contactScheme = mongoose.Schema({
    message:{
        type:String,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    contactpostid:{
        type:mongoose.Schema.Types.ObjectId,
    },
    type:{
        type:String,
    }
},{timestamps:true})

const Contact = mongoose.model('Contact',contactScheme)

module.exports = Contact