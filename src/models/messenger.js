const mongoose = require('mongoose')
const moment = require('../utils/momentformat')

const messengerScheme = mongoose.Schema({ 
    conversationid:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Conversation'
    },
    from:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    message:{
        type:String,
    },
    hasImage:{
        type:Boolean,
    },
    image:{
        type:String
    }
},{timestamps:true})

const conversationScheme = mongoose.Schema({
    users:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    lastmessage:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Messenger'
    }
},{timestamps:true})


messengerScheme.methods.toJSON = function(){
    console.log('sasa12')
    const messenger = this
    const messengerObject = messenger.toObject()
    
    messengerObject.createdAt = {
        'createdAt':moment(messengerObject.createdAt).fromNow(),
        'nonParsed':messengerObject.createdAt
    }
    
    return messengerObject
}




const Conversation = mongoose.model('Conversation',conversationScheme)
const Messenger = mongoose.model('Messenger',messengerScheme)





module.exports={Messenger,Conversation}