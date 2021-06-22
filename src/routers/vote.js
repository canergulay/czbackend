const { response } = require('express')
const express = require('express')
const moment = require('moment')
const router = new express.Router()
const Survey = require('../models/survey')
const Vote = require('../models/vote')

router.post('/vote',async (req,res)=>{
    const vote = new Vote({
        voter:req.body.voter,
        voted:req.body.voted
    })

    Survey.findOneAndUpdate({ id:req.body.surveyid }, { $inc: {  partipicate: 1 ,id:1} }).exec()

    try{
        await vote.save()
        res.send('succes')
        console.log('sucesqe')
    }catch(e){
        res.send('problem').status('400')
        console.log('kötü')
    }

})

router.get('/survey', async (req,res)=>{ // surveyi bununla çekiyoruz.
    console.log(moment.now())

    const mySurvey =  await Survey.findOne().populate('lastwinner').exec()
    res.send(mySurvey)
})


router.post('/lastvotes', async (req,res)=>{ // surveyi bununla çekiyoruz.
    const mySurvey =  await Vote.find({}).sort({createdAt:-1}).limit(20).populate('voter',{username:1,userpicture:1,_id:1}).populate('voted',{coinid:1,coinName:1})
    res.send(JSON.stringify(mySurvey))
})

router.post('/morevotes', async (req,res)=>{ // surveyi bununla çekiyoruz.
    console.log(req.body.updatedAt)
    const mySurvey =  await Vote.find({updatedAt:{$lt:req.body.updatedAt}}).sort({createdAt:-1}).limit(20).populate('voter',{username:1,userpicture:1,_id:1}).populate('voted',{coinid:1,coinName:1})
    res.send(JSON.stringify(mySurvey))
})

router.get('/opensurvey',async (req,res)=>{
    const mysurvey = new Survey({
        duration:1435,
        participate:0,
        lastwinner:"6085bd4beadcdf416883e7d8",
        id:1,
    })

    await mysurvey.save()

    res.send(mysurvey)
})

router.get('/updatethesurver',async (req,res)=>{
    let now = moment().unix()
    let nowPlusOneDay = now+86400
    let anan = (nowPlusOneDay-now)/60/60
    await Survey.updateMany({},{finishdate:nowPlusOneDay})
    res.send({now,nowPlusOneDay,anan})
})

module.exports=router