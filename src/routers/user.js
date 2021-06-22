const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const SaveMessenger = require('../utils/functions/savemessanger')
const Messenger = require('../models/messenger')
const Watchlist = require('../models/watchlist')
const Auth = require('../utils/middlewares/auth')
const sharp = require('sharp')
const Jimp = require('jimp')
/*const path = require('path');
const fs = require('fs');*/
const multer = require('multer')

//TO BE DONE --> ŞU EKLEDİĞİN GEREKSİZ ŞEYLERİ SİL!
router.get('/userr', async (req,res)=>{
    let users = ["a","b","d","f","f","g","k","j","l","m","n","p",,"r","z","s"]
    let myid = "60b7e9522205d10e38ca01f1"
    var sayi = 0;

    users.forEach(async (a)=> {
        sayi++
        console.log(sayi)
        let user = await User.findOne({usermail:a})
        let tosendid = user._id

        const conv = await convstarter(myid,tosendid)
        let messageid = await SaveMessenger.savemessenger(myid,tosendid,conv._id,a)
        await convLastMessageUpdater(messageid,conv)
/*
        const myUser = new User({
            username:"Caner Gülay",
            password:"c",
            usermail:"gly",
            merit:51,
            userpicture:'https://news.mit.edu/sites/default/files/images/201802/MIT-Habit-Chunking.jpg',
            about:'mc satoshi is said to be the founder of Bitcoin',
            })
            await myUser.save()*/

        
    })
    /*
    const myUser = new User({
        username:"s",
        password:"a",
        usermail:"b",
        merit:51,
        userpicture:'https://greekcitytimes.com/wp-content/uploads/2021/05/satoshi-cyborg-1024x877.jpg',
        about:'mc satoshi is said to be the founder of Bitcoin',
        })*/
        
    try{
       // await myUser.save()
    res.send('succes')
    }catch(e){
        res.send(e)
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

router.get('/bestusers',async(req,res)=>{
    try{
        const bests = await User.find({}).sort({merit:-1,_id:1}).limit(10)
        res.send(JSON.stringify(bests))
    }catch(e){
        res.send(e)
    }
})

router.post('/searchusers',async(req,res)=>{
  
   
    try{
        const searchedOnes = await User.find({ username:{ $regex: "^" + req.body.filter,$options:'i' }}).limit(5)
        console.log(searchedOnes)

        setTimeout(function(){    res.send(JSON.stringify(searchedOnes)) }, 2000);
     
    }catch(e){
        res.send(e)
    }
})

router.post('/login', async (req,res)=> {

    try{
        const user = await User.findByCredentials(req.body.mail,req.body.pass)
       
        const token = await user.generateAuthToken()

      
        const watchlist = await Watchlist.find({user:user._id}).sort({createdAt:1}).populate('coin','coinid')

        res.send({
            'status':'basarili',
            'user':{
                '_id':user._id,
                'name':user.username,
                'picture':user.userpicture,
                'about':user.about},
            'watchlist':watchlist,
            'token':token    
        })
    }catch(e){
        console.log(e)
        res.status(401).send('We have a problem.')
    }

  
    
    
    /*
    const user = await User.findOneAndUpdate({usermail:req.body.mail,password:req.body.pass},{lastActivity:Date.now()})
    const watchlist = await Watchlist.find({user:user._id}).sort({createdAt:1}).populate('coin','coinid')
    
    if(user){
        res.send({
            'status':'basarili',
            'user':{
                '_id':user._id,
                'name':user.username,
                'picture':user.userpicture},
            'watchlist':watchlist    
        })
    }else{
        res.send('sorry , we could not find what you told us to so!')
    }*/
})

router.post('/profile', async (req,res)=>{
    console.log('^sasa')
    try{
        const myUser = await User.findById(req.body.userid)
    res.send(myUser)
    }catch(e){
        res.send(e)
    }
})

router.post('/getuwl', async (req,res)=>{
    
    const user = req.body.userid
    try{
        const watchlist = await Watchlist.find({user}).sort({createdAt:-1}).limit(15).populate('coin')
    console.log(watchlist)
        res.send(JSON.stringify(watchlist))
    }catch(e){
        res.send(e)
    }
})

router.post('/editinfo',Auth,async (req,res)=>{
    let userim = req.userobject
    userim.about = req.body.about
    userim.save()
    res.send('basarili')
    console.log(userim)
})

router.post('/resetphoto',Auth,async (req,res)=>{
    let dephoto = 'http://192.168.1.198:3000/images/defaultprofile.png';
    let userim = req.userobject
    userim.userpicture = dephoto
    userim.save()
    res.send(dephoto)
    console.log(userim)
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/utils/profilimages')
    },
    filename: (req, file, cb) => {
  
        let userid = req.userobject._id
        let date = Date.now()
        let random = Math.floor(Math.random() * 100)

        let uzanti = `${date}-${userid}-${random}.jpg`

        req.uzanti = uzanti

      cb(null, uzanti)

    }
  })

  var upload = multer({ storage: storage })


router.post('/changephoto',Auth,upload.single('file'),async (req,res)=>{
    let newphoto = 'http://192.168.1.198:3000/profilimages/'+req.uzanti
    let userim = req.userobject
    userim.userpicture = newphoto
    userim.save()
    setTimeout(function(){   res.send(newphoto)}, 3000);
    console.log('file geliyor')
    console.log(req.file)

    Jimp.read(req.file.path, (err, lenna) => {
        if (err) throw err;
        lenna
          .scale(0.4)// resize
          .quality(50) // set JPEG quality
          .write(req.file.path); // save
      });
   
   

})

router.post('/deleteaccount',Auth,async(req,res)=>{
 
    let userim = req.userobject
    let userPassword = userim.password
    console.log('req body felan is '+req.body.password)
    console.log('userpassword is '+userPassword)
    if(req.body.password==userPassword){
        // normalde böyle olmucak bcyrpt leyince geri gelicem.
        res.send('basarili')   
        userim.password = userim.username+' - '+Date.now()
        userim.username = 'Deleted Account'
        
        userim.userpicture = 'http://192.168.1.198:3000/images/defaultprofile.png'
        
        userim.save()
             
    }else{
        res.send('problematic')
    }
})

router.post('/changepassword',Auth,async(req,res)=>{
    
    let newpassword = req.body.newpassword
    let oldpassword = req.body.oldpassword

    console.log('eski şifre : '+oldpassword)
    console.log('yeni sifre : '+newpassword)
   

    let userim = req.userobject

    console.log('userin databasadeki şifresi : '+userim.password)

    if(userim.password == oldpassword){
        userim.password = newpassword
       
        res.send('basarili')
        userim.save()
    }else{
        res.send('sifreyanlis')
    }
})










module.exports=router