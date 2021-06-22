const mongoose = require('mongoose')
const moment = require('../utils/momentformat')


const voteScheme = mongoose.Schema({
    voter:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    voted:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Coin'
    },
},{timestamps:true})

voteScheme.methods.toJSON = function(){
    const vote = this
    const voteObject = vote.toObject()
    voteObject.createdAt = moment(voteObject.createdAt).fromNow()
    return voteObject
}


const Vote = mongoose.model('Vote',voteScheme)

module.exports=Vote