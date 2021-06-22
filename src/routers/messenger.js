const express = require('express')
const router = new express.Router()
const Messenger = require('../models/messenger')
const User = require('../models/user')
const Deleted = require('../models/deleted')
const Auth = require('../utils/middlewares/auth')
const mongoose = require('mongoose')
var ObjectId = require('mongoose').ObjectID;
const SaveMessenger = require('../utils/functions/savemessanger')
const moment = require('../utils/momentformat')

/*
router.post('/firstmessage',async (req,res)=>{
    const newConverSation = new Messenger.Conversation(
        {
            users:[req.body.from,req.body.tosendid]
        }
    )
    await newConverSation.save()
    res.send({
        'status':'basarili'
    })
})*/

router.post('/getconversations',Auth,async (req,res)=>{
   
    let userid = req.userobject._id
    console.log(userid+' is the current user.!')

  if(req.body.last==0){
    let newConverSation = await Messenger.Conversation.find({users:userid}).sort({updatedAt:-1}).limit(11).populate('lastmessage','message , createdAt')
  await User.populate(newConverSation,{path:'users',select:['username','userpicture'], match: { '_id': { $ne: userid } }})
  res.send(
    JSON.stringify(newConverSation)
) 


}else{
    
    let newConverSation = await Messenger.Conversation.find({users:userid,updatedAt:{$lt:req.body.last}}).sort({updatedAt:-1}).limit(11).populate('lastmessage','message , createdAt')
    console.log(req.body.last)
    await User.populate(newConverSation,{path:'users',select:['username','userpicture'], match: { '_id': { $ne: userid } }})
    res.send(
        JSON.stringify(newConverSation)
    ) 
    
}


   /*const newConverSation = await Messenger.Messenger.aggregate([
        { $match: {
            users: mongoose.Types.ObjectId(req.body.userid)}
        },
        { 
            $sort: { 'updatedAt': -1,} 
        },
            {
          $group: {
            _id: { $setUnion: "$users" },
            message: { $first: "$$ROOT" },
          },
        },
        { 
            $sort: { 'message.createdAt':-1 } 
        },
      ])
       await User.populate(newConverSation,{path:'message.users',select:['username','userpicture'], match: { '_id': { $ne: req.body.userid } }})
      */

})

router.post('/messengerfirst',Auth,async (req,res)=>{

    let user = req.userobject

   // console.log(req.body.userid,' d ene ',req.body.tosendid)
    const checkconv = await Messenger.Conversation.findOne({users:[req.body.userid,req.body.tosendid]}) 
    if(checkconv){
        let convid = checkconv._id
        console.log(checkconv)
        console.log('VAR')
       let messageid = await SaveMessenger.savemessenger(req.body.userid,req.body.tosendid,convid,req.body.message)
        await convLastMessageUpdater(messageid,checkconv)
        res.send({
            'status':'basarili'
        })
   
        User.updateLastActivity(user)

    }else{
        console.log('YOK')

        const conv = await convstarter(req.body.userid,req.body.tosendid)
        let messageid = await SaveMessenger.savemessenger(req.body.userid,req.body.tosendid,conv._id,req.body.message)
        await convLastMessageUpdater(messageid,conv)
        res.send({
            'status':'basarili'
        })
  
        User.updateLastActivity(user)
    }
    
})

router.post('/messengerfirstwimage',SaveMessenger.upload.single('file'),async (req,res)=>{
    const checkconv = await Messenger.Conversation.findOne({users:[req.body.userid,req.body.tosendid]}) 
    
    if(checkconv){
        let convid = checkconv._id
        console.log(checkconv)
        console.log('VAR')
       let messageid = await SaveMessenger.savemessengerWimage(req.body.userid,req.body.tosendid,convid,req.body.message,req.file.filename)
       await convLastMessageUpdater(messageid,checkconv)
       res.send({
            'status':'basarili'
        })
    
    }else{
        console.log('YOK')
        const conv = await convstarter(req.body.userid,req.body.tosendid)
        let messageid = await SaveMessenger.savemessengerWimage(req.body.userid,req.body.tosendid,conv,req.body.message,req.file.filename)
        await convLastMessageUpdater(messageid,conv)
        res.send({
            'status':'basarili'
        })
      
    }
    
})



router.post('/loadmessenger',async(req,res)=>{

    console.log(req.body.conversationid)
    const messages = await Messenger.Messenger.find({conversationid:req.body.conversationid})
    .sort({createdAt:-1}).limit(15)
    .populate('from',{'_id':1,'username':1,'userpicture':1})
    res.send(JSON.stringify(messages))
})

router.post('/loadmessengerscroll',async(req,res)=>{
    const messages = await Messenger.Messenger.find({conversationid:req.body.conversationid,createdAt:{$lt:req.body.last}})
    .sort({createdAt:-1}).limit(15)
    .populate('from',{'_id':1,'username':1,'userpicture':1})
    res.send(JSON.stringify(messages))
})




router.post('/messenger',async (req,res)=>{
    console.log(req.body.userid,' d ene ',req.body.tosendid)
    await SaveMessenger.savemessenger(req.body.userid,req.body.tosendid,req.body.message)
    res.send({
        'status':'basarili'
    })
})


router.post('/messengerwimage',SaveMessenger.upload.single('file'),async (req,res)=>{

    await SaveMessenger.savemessengerWimage(req.body.userid,req.body.tosendid,req.body.message,req.file.filename)
    res.send({
        'status':'basarili'
    })
})

router.post('/checkmessage',async (req,res)=>{
const messages = await Messenger.find({users:{"$in":[req.body.from]}})
res.send(messages)
})

router.post('/deletemesmessage', Auth ,async (req,res)=>{
    try{
    
      let messageid = req.body.messageid
      let message = await Messenger.Messenger.findById(messageid)
      let myuser = req.userobject._id
      let messageowner = message.from.toString()
    
      console.log(myuser)
      console.log(messageowner)
      if(myuser==messageowner){
        res.send('basarili')
      }else{
        res.status(404).send('basarisiz')
        }
    
        const deleted = new Deleted({type:'messengerchatmessage',item:message})
        await deleted.save()
      
        message.message = 'This message was deleted.'
        message.image = 'deleted'
        message.hasImage = false
    
      await message.save()
      
    }catch(e){
      console.log(e)
    }
     
    })

async function convstarter (from,tosendid){
    const newConverSation = new Messenger.Conversation(
        {
            users:[from,tosendid]
        }
    )
    const myconv = await newConverSation.save()
    return myconv
}


async function convLastMessageUpdater (lastMessageId,conv){
   var myConvToBeUpdated = conv
   myConvToBeUpdated.lastmessage=lastMessageId
    await myConvToBeUpdated.save()
}

module.exports=router