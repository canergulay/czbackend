const express = require('express')
const router = new express.Router()
const Comment = require('../models/comment')
const Post = require('../models/post')
const User = require('../models/user')
const Auth = require('../utils/middlewares/auth')
const CommentSaver = require('../utils/functions/savecomment')

router.post('/comment', async (req,res)=>{
    const comment = new Comment({
        comment:req.body.comment,
        post:req.body.post,
        owner:req.body.owner,
    })
    await comment.save()
    res.send('succes')
})

router.post('/getcomment',Auth,async (req,res)=>{
    
    const comments = await Comment.find({post:req.body.post}).skip(req.body.skip).limit(10).populate('owner').exec()
    res.send(JSON.stringify(comments)) 
})

router.post('/makecomment',Auth,async (req,res)=>{

    let user = req.userobject

    const saved = await CommentSaver.savecomment(req.body.comment,req.body.postid,req.body.owner,req.body.key)
   
  res.send({
      "status":"basarili",
      "numberofreply":saved.numberOfReply+1})

      await User.updateLastActivity(user)
})

router.post('/makecommenti',Auth,CommentSaver.upload.single('file'),async (req,res)=>{
    
    let user = req.userobject

    const saved = await CommentSaver.savecommentWimage(req.body.comment,req.body.postid,req.body.owner,req.body.key,req.file.filename)
  
    res.send({
        "status":"basarili",
        "numberofreply":saved.numberOfReply+1})
        await User.updateLastActivity(user)
  
  })

  
router.post('/deletecomment',Auth,async(req,res)=>{
    let commentid = req.body.commentid
    let myuserid = req.userobject._id

    let comment = await Comment.findById(commentid);

    let commentpostid = comment.post

   

    let commentOwnerId = comment.owner.toString()

        console.log(myuserid)
        console.log(commentOwnerId)
    if(myuserid==commentOwnerId){
        console.log('they are equal')
        res.send('basarili')
    }

    await comment.remove()
    await Post.Post.findByIdAndUpdate(commentpostid,({$inc:{numberOfReply:-1}}))

})




module.exports=router