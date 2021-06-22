const express = require('express')

const ChatRoom = require('../models/chatroom')
const router = new express.Router()


router.get('/rooms',async (req,res)=>{
const rooms = await ChatRoom.find({})
var totalonline = 0;
rooms.forEach((room)=>{
    totalonline = totalonline + room.online
})
res.send({'totalonline':totalonline,'rooms':rooms})
})

router.post('/roomscreate',(req,res)=>{
    const myRoom = new ChatRoom({
        name:req.body.name,
        chatid:req.body.roomid
    })
    myRoom.save().then((myRoom)=>{
        res.send(myRoom)
    }).catch((e)=>{
        res.send(e)
    })
})






module.exports=router