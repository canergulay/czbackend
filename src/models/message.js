const mongoose = require('mongoose')
const moment = require('../utils/momentformat')

const messageScheme = mongoose.Schema({
    message:{
            message:{
                type:String,
            },
            image:{
                type:String,
            }
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    coinid:{
        type: mongoose.Schema.Types.ObjectId,
    },
    hasPicture:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

messageScheme.methods.toJSON = function(){
    const message=this
    const messageObject = message.toObject()
    messageObject.createdAt = {
        'createdAt':moment(messageObject.createdAt).fromNow(),
        'nonParsed':messageObject.createdAt
    }
    return messageObject
}

const Message = mongoose.model('Message',messageScheme)




module.exports=Message