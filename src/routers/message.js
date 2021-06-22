const express = require('express')
const Message = require('../models/message')
const router = new express.Router()
const Auth = require('../utils/middlewares/auth')
const Deleted = require('../models/deleted')

router.get('/createmessage',(req,res)=>{
const myMessage = new Message({
    message:'28',
    owner:'6084036ad4d4cd40a47afba4',
    coinid:'6086ebf870e4af0cfc35fac0'
})
    myMessage.save().then(()=>{
        res.send('ppk')
    })
})

router.get('/saribasli',async(req,res)=>{
    Message.findById("60cda0a7400d6616a4946860").then((post)=>{
      if(post){
        res.send(post)
      }else{
        res.send('there is no any!')
      }
    }).catch((e)=>res.send(e))
      
    })
router.post('/messagefirst',async (req,res)=>{
    const mesajlar = await Message.find({coinid:req.body.coinid}).sort({createdAt:-1}).populate('owner','merit , username , userpicture',).limit(15).exec()
    res.send(JSON.stringify(mesajlar))
})

router.post('/messagescroll',async (req,res)=>{
    const mesajlar = await Message.find({coinid:req.body.coinid,createdAt:{$lt:req.body.last}}).sort({createdAt:-1}).populate('owner','merit , username , userpicture',).limit(15).exec()
    res.send(JSON.stringify(mesajlar))
})

router.post('/deletecoinmessage', Auth ,async (req,res)=>{
try{

  let messageid = req.body.messageid
  let message = await Message.findById(messageid)
  let myuser = req.userobject._id
  let messageowner = message.owner.toString()

  console.log(myuser)
  console.log(messageowner)
  if(myuser==messageowner){
    res.send('basarili')
  }else{
    res.status(404).send('basarisiz')
    }

    const deleted = new Deleted({type:'coinchatmessage',item:message})
    await deleted.save()
  
    message.message= {
    'message':'This message was deleted.',
    'image':'deleted'
  }
   message.hasPicture = false

  


  await message.save()
  

  
  

}catch(e){
  console.log(e)
}
 
})




module.exports = router

