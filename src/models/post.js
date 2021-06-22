const mongoose = require('mongoose')
const User = require('../models/user')
const Favorite = require('../models/favorite')
const moment = require('../utils/momentformat')

const postScheme = mongoose.Schema({
    post:{
        type:String,
        trim:true,
    },
    numberOfReply:{
        type:Number,
        default:0
    },
    numberOfLikes:{
        type:Number,
        default:0
    },
    likes:[{
        type:String,
    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    hasImage:{
        type:Boolean,
    },
    image:{
        type:String,
        trim:true
    },
    popularity:{
        type:String,
        default:0
    },
    isNews:{
        type:Boolean,
        default:false,
    },
    isCoin:{
        type:Boolean
    },
    coin:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Coin' 
    }
},{timestamps:true})


postScheme.methods.likeThePost = async function(userid,isCoin){
    const post = this
    
    const addFaw = new Favorite({
        user:userid,
        post:post._id
    })

    await addFaw.save()

    post.likes = post.likes.concat(userid)
    await post.save()
}

postScheme.methods.disLikeThePost = async function(userid,isCoin){
    const post = this
    await Favorite.findOneAndDelete({user:userid,post:post._id})
    post.likes = arrayRemove(post.likes,userid)
    await post.save()
}

postScheme.methods.toJSON = function () {
const post = this
const postObject = post.toObject()
postObject.createdAt = moment(postObject.createdAt).fromNow()
return postObject
}

function arrayRemove(arr, value) { 
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}


const Post = mongoose.model('Post', postScheme)
const PostCoin = mongoose.model('PostCoin', postScheme)

module.exports={Post,PostCoin}