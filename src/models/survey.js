const mongoose = require('mongoose')
const moment = require('moment')


const surveyScheme = mongoose.Schema({
    duration:{
        type:Number,
    },
    partipicate:{
        type:Number,
        default:0,
    },
    finishdate:{
        type:Number,
    },
    lastwinner:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Coin'
    },
    id:{
        type:Number,
    }
})

surveyScheme.methods.toJSON= function (){
    const survey = this
    const surveyObject = survey.toObject()
    const now = moment().unix()
    const newtoreturn = surveyObject.finishdate-now

    surveyObject.duration = (newtoreturn)

    return surveyObject
}


const Survey = mongoose.model('Survey', surveyScheme)

module.exports=Survey
