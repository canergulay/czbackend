const mongoose = require('mongoose')
const moment = require('../utils/momentformat')

const commentScheme = mongoose.Schema({
    comment:{
        type:String,
    },
    post:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post'
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    image:{
        type:String
    },
    hasImage:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

commentScheme.methods.toJSON = function () {
    
    const comment = this
    const commentObject = comment.toObject()
    commentObject.createdAt = moment(commentObject.createdAt).fromNow()
    console.log(commentObject.createdAt)
    return commentObject
    
    }

const Comment = mongoose.model('Comment',commentScheme)

module.exports=Comment