const express = require('express')
const router = new express.Router()
const Watchlist = require('../models/watchlist')
const Coin = require('../models/coin')
const Auth = require('../utils/middlewares/auth')


router.post('/watchlist',Auth,async (req,res)=>{
  
    const user = req.body.userid
    const coin = req.body.coinid

    try{
        const watchlist = new Watchlist({user,coin}) 
        await watchlist.save()    
        await Coin.findByIdAndUpdate(coin,{$inc:{watchlist:1}})
        res.send('basarili')
    }catch(e){
        res.send(e)
    }
})

router.delete('/watchlist',Auth ,async (req,res)=>{
    const user = req.body.userid
    const coin = req.body.coinid
    try{
        await Watchlist.findOneAndDelete({user,coin})
        await Coin.findByIdAndUpdate(coin,{$inc:{watchlist:-1}})
        res.send('basarili')
    }catch(e){
        res.send(e)
    }
})

router.post('/watchlistcheck', Auth ,async (req,res)=>{
    const user = req.body.userid
    const watchlist = await Watchlist.find({user}).sort({createdAt:-1}).limit(15).populate('coin')
    res.send(JSON.stringify(watchlist))
  //  console.log(watchlist)
})


module.exports=router
