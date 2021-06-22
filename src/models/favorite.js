const mongoose = require('mongoose')

const favoriteSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
})

const Favorite = mongoose.model('Favorite',favoriteSchema)

module.exports=Favorite