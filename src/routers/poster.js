const express = require('express')
const router = new express.Router()
const Post = require('../models/post')
const Contact = require('../models/contact')
const User = require('../models/user')
const Auth = require('../utils/middlewares/auth')
const saver = require('../utils/functions/savepost')
const Deleted = require('../models/deleted')
const savechatimage = require('../utils/functions/savechatimage')
var multer  = require('multer')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/utils/images')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${req.body.userid}.jpg`)
  }
})

var upload = multer({ storage: storage })



router.post('/posterwimage',Auth,upload.single('file'),async (req,res,)=>{
      console.log(req.body)
        
    await saver.savepostwimage(req.body.post,req.body.userid,true,req.file.filename,req.body.iscoin,req.body.coinid)
    await User.findByIdAndUpdate(req.body.userid,{$inc:{post:1}})
    await User.updateLastActivity(req.userobject)
    res.send({
      'status':'basarili'
  })
})



router.post('/poster',Auth,async (req,res)=> {
  console.log(req.body)

    const user = req.userobject
  
    await saver.savepost(req.body.post,req.body.userid,false,req.body.iscoin,req.body.coinid)
    await User.findByIdAndUpdate(req.body.userid,{$inc:{post:1}})
   
    await User.updateLastActivity(user)
    res.send({
      'status':'basarili'
  })
})


router.post('/messageimage',savechatimage.single('file'),async (req,res,)=>{ 

  setTimeout(function(){  res.send({
    'status':'basarili',
    'image':req.file.filename
  }) }, 3000);
})

router.post('/like',Auth,async (req,res)=>{
  const user = req.userobject
  await User.findByIdAndUpdate(req.body.ownerid,{$inc:{merit : 1}})
  var post=  await Post.Post.findByIdAndUpdate(req.body.postid,{$inc : {numberOfLikes : 1}},)
  await post.likeThePost(req.body.userid,req.body.isCoin)
     
  await User.updateLastActivity(user)
  res.send('basarili')
})

router.post('/dislike',Auth,async (req,res)=>{
  const user = req.userobject
  await User.findByIdAndUpdate(req.body.ownerid,{$inc:{merit : -1}})
  var post=  await Post.Post.findByIdAndUpdate(req.body.postid,{$inc : {numberOfLikes : -1}},)
   await post.disLikeThePost(req.body.userid,req.body.isCoin)
   await User.updateLastActivity(user)
   res.send('basarili')
 })
 

router.post('/getlikes',async (req,res)=>{

  const post = await Post.Post.findById(req.body.postid)
  console.log(post)

  const ifliked = post.likes.includes(req.body.userid)
  res.send({
      'ifliked':ifliked,
      'numberOfLikes':post.numberOfLikes,
  })
 
 })

 router.post('/postdelete',Auth,async (req,res)=>{
   let postid = req.body.postid
  
   const myuserid = req.userobject._id
   
   const postToDelete = await Post.Post.findById(postid)

   if(postToDelete.owner.toString()==myuserid){
        postToDelete.remove()
      }

   res.send('basarili')
   
   let newDeleted = new Deleted({type:'Post',item:postToDelete})
   newDeleted.save()

 })
 

router.post('/contact',Auth,async (req,res) => {

  let message = req.body.message
  let sender = req.userobject._id
  let contactpostid = req.body.contactpostid
  let type = req.body.type


  const user = req.userobject
  await User.updateLastActivity(user)

  const myContactte = new Contact({
    message:message,
    sender:sender,
    contactpostid:contactpostid,
    type:type,
  })

  await myContactte.save()

  res.send('basarili')



})




module.exports=router