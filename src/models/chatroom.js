const mongoose = require('mongoose')

const chatRoomScheme = mongoose.Schema({
    name:{
     type:String,   
    },
    online:{
        type:Number,
        default:0
    }
})

const ChatRoom = mongoose.model('ChatRoom',chatRoomScheme)

module.exports = ChatRoom