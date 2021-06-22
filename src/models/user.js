
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const moment = require('../utils/momentformat')

const userScheme = mongoose.Schema({
    username:{
        type:String,
        trim:true,
    },
    usertag:{
        type:String,
        trim:true,
    },
    userpicture:{
        type:String,
    },
    usermail:{
        type:String,
        trim:true,
        unique:true,
        lowercase:true,
      /*  validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid!')
            }
        }*/
    },
    password:{
        type:String,
        required:true,
        trim:true,
       // minlength:7,
    },
    merit:{
        type:Number,
        default:0
    },
    about:{
        type:String,
    },
    lastActivity:{
        type:Date,
        default:Date.now()
    },
    post:{
        type:Number,
        default:0,
    },
    tokens: [{
        token:{
            type:String,
        }
    }],
},{timestamps:true})



userScheme.methods.generateAuthToken = async function(){
    const user = this
 
    const token = jwt.sign({_id:user._id},'cointalkzhdes')
    console.log(token)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}



userScheme.statics.findByCredentials = async (usermail,password) => {
    console.log(usermail,password)

    const user = await User.findOne({usermail})
    if(!user){
        
        throw new Error('Giriş yapılamadı!')
        
    }

    /*
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Şifre eşleşmedi!')
    }*/
   
    return user

}

userScheme.statics.updateLastActivity = async function(user){
   // console.log(user)
    user.lastActivity = Date.now()
    await user.save()

}

userScheme.statics.updateLastActivityByid = async function(userid){
    // console.log(user)
    let user = await User.findById(userid)
     user.lastActivity = Date.now()
     await user.save()
 
 }


userScheme.methods.toJSON = function (){

    const user = this
    const userObject = user.toObject()

    delete userObject.password // geri gönderirken o istemediğimiz kısımları siliyoruz. 
    delete userObject.usermail
    delete userObject.tokens
   // console.log(userObject)
    userObject.lastActivity = moment(userObject.lastActivity).fromNow()

    return userObject
}


const User = mongoose.model('User', userScheme)

module.exports=User