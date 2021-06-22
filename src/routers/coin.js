const express = require('express')
const router = new express.Router()
const Coin = require('../models/coin')
const request = require('request')
const Path = require('path')
const Axios = require('axios')
const fs = require('fs')


const requesterr = require('../utils/coinpopulate')

require('../utils/coinpopulate')

router.post('/surveycoin', async (req,res)=>{
  
  if(req.body.filter){
    const coins = await Coin.find({coinName: { $regex: req.body.filter,$options:'i' } }).limit(3).sort({rank:1})
    res.send(coins)
  }else{
    const coins = await Coin.find().limit(3).sort({rank:1})
    res.send(coins)
  }


})


router.get('/coindeneme', async (req,res)=>{
    const coin = new Coin({
        coinName:' ',
        coinPhoto:'https://i.hizliresim.com/4jjja3.png',
        
    })
    await coin.save()
    res.send(coin)
})

router.get('/lastpop', async (req,res)=>{
  const coins = await Coin.find({$or:[
    {coinid:1},
    {coinid:52},
    {coinid:6636},
    {coinid:2348},
    {coinid:2608},
  ]}).exec()
  res.send(JSON.stringify(coins))
})

router.post('/coin', async (req,res)=>{
  const coins = await Coin.find({}).limit(req.body.page*25).sort({rank:1})
  res.send(JSON.stringify(coins))
})


router.post('/coinarama',async (req,res)=>{
  const coins = await Coin.find({$or:[{coinName: { $regex: "^" + req.body.filter,$options:'i' },},{short:{$regex: "^"+req.body.filter,$options:'i'}}]}).sort({rank:1})
  res.send(JSON.stringify(coins)) 
  
})

router.get('/req',async (req,res)=>{

    /*  console.log('data gelecek')
     const liste = await requesterr() 
     console.log('data geldi')
    
     for(i=0;i<5000;i++){
     if(i!=2681){
        await getit(liste,i)
     }
    }
       console.log('HEPSİ TAMAM !')*/

    //res.send(liste)

    
})  

async function getit (liste,i) {

  const coinn = new Coin({
    coinName:liste['data'][i]['name'],
    coinPhoto:liste['data'][i]['id']+'.png',
    coinid:liste['data'][i]['id'],
    short:liste['data'][i]['symbol'],
    rank:liste['data'][i]['rank'],
})


await coinn.save()
await download(liste['data'][i]['id'])
console.log(i+' is over.')

}

async function download(number){
  const url = 'https://s2.coinmarketcap.com/static/img/coins/64x64/'+number+'.png'
  const path = Path.resolve(__dirname,'../utils/files',number+'.png')
  
  const response = await Axios({
      method: 'GET',
      url:url,
      responseType:'stream',
  })

  response.data.pipe(fs.createWriteStream(path)) // o streamdaki datanın her byte ını o patha yazacak.

  return new Promise((resolve,reject)=>{
      response.data.on('end',()=>{
          resolve()
      })

      response.data.on('error',()=>{
          reject(err)
      })
  })

}

router.get('/newpop',async (req,res)=>{

})

router.get('/coinchech', async (req,res)=>{
    const myCoins = await Coin.find({})
    res.send(myCoins)
 
})







module.exports=router