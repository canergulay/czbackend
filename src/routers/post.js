const express = require('express')
const router = new express.Router()
const Post = require('../models/post')
const User= require('../models/user')
const Favorite = require('../models/favorite')
const Coin = require('../models/coin')





router.get('/',(req,res)=>{
    res.send('IT WİLL BE A LEGACY ')
})


router.get('/deletebitches',async (req,res)=>{
    await Post.Post.deleteMany({isCoin:true})
    res.send('reis ül kitatbını')
})

router.get('/denemepost',(req,res)=>{
    try{
        const post = new Post({
            post:'REPERTUARI GENİŞLETELİM Mİ !19',
            numberOfReply:2,
            hasImage:true,
            image:'https://i.pinimg.com/280x280_RS/6d/14/85/6d1485278f9cef918a790ae813e997f8.jpg',
            owner:'6082e39b38eec707c8ed3c59',
            isCoin:true,
            coin:'60836e81e22798263c27e2cd'})
        post.save()
        res.send('we got it')
    }catch(e){
        res.send('houstunwegotaproblem',e)
       
    }
})

router.post('/findme',async (req,res) => {
    try{  
        console.log("last is "+req.body.last)
    await req.body.key=='1'?Post.Post.find({isCoin:true,updatedAt:{$lt:req.body.last}}).sort({'updatedAt': -1}).limit(10).populate('owner').populate('coin').exec(function (err, posts) {
        console.log(posts)
        res.send(posts)
     }):Post.Post.find({isCoin:false,updatedAt:{$lt:req.body.last}}).sort({'updatedAt': -1}).limit(10).populate('owner').populate('coin').exec(function (err, posts) {
        console.log(posts)
        res.send(posts)
    })
    }catch(e){
        res.send(e) 
    }
})

router.post('/findmefirst',async (req,res) => {
    try{  
      
    await req.body.key=='1'?Post.Post.find({isCoin:true}).sort({'updatedAt': -1}).limit(10).populate('owner').populate('coin').exec(function (err, posts) {
     
        res.send(posts)
     }):Post.Post.find({isCoin:false}).sort({'updatedAt': -1}).limit(10).populate('owner').populate('coin').exec(function (err, posts) {

        res.send(posts)
    })
    }catch(e){
        res.send(e) 
    }
})

router.post('/getupost',async(req,res) => {
   
const postlar= await Post.Post.find({owner:req.body.userid}).sort({_id:-1}).limit(10).populate('owner').populate('coin')
res.send(JSON.stringify(postlar))
})

router.post('/getupostscroll',async(req,res) => {
    console.log('sasa')
    const postlar= await Post.Post.find({owner:req.body.userid,_id:{$lt:req.body.createdAt}}).sort({createdAt:-1}).limit(10).populate('owner').populate('coin')
    res.send(JSON.stringify(postlar))
    })

router.post('/getufavors',async(req,res) => {
    const user = req.body.userid
    const query = [
        {
            path:'owner'
        }, 
        {
            path:'coin' 
        }
    ];
    console.log(req.body.userid)
    const postlar = await Favorite.find({user}).sort({_id:-1}).limit(10).populate({path:'post',model:'Post',populate:{
        path:'coin',
        model:'Coin',
    }}).populate({path:'post',populate:{
        path:'owner',
        model:'User'
    }})
  
    console.log(postlar)
    res.send(JSON.stringify(postlar))
    })

    router.post('/getufavorscroll',async(req,res) => {
        console.log('1 2 2 3 ')
        const user = req.body.userid
        const query = [
            {
                path:'owner'
            }, 
            {
                path:'coin' 
            }
        ];
        console.log(req.body.userid)
        const postlar = await Favorite.find({user,_id:{$lt:req.body.last}}).sort({_id:-1}).limit(10).populate({path:'post',model:'Post',populate:{
            path:'coin',
            model:'Coin',
        }}).populate({path:'post',populate:{
            path:'owner',
            model:'User'
        }})
      
        console.log(postlar)
        res.send(JSON.stringify(postlar))
        })
    
    router.post('/getnreplies',async (req,res)=>{
        try{
            const post = await Post.Post.findById(req.body.postid);
            res.send({
                'status':'basarili',
                'numberofreplies':post.numberOfReply
            })
        }catch(e){
            res.status(404).send('Problematic')
        }
        
    })    

    router.post('/getcoinposts',async (req,res) => {
        const postlar= await Post.Post.find({coin:req.body.coinid}).sort({'updatedAt': -1}).limit(req.body.page*10).populate('owner').populate('coin')
        res.send(JSON.stringify(postlar))
        })


module.exports=router