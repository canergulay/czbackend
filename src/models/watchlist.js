const mongoose = require('mongoose')

const watchlistSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    coin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Coin',
    }
},{timestamps:true})

const Watchlist = mongoose.model('Watchlist',watchlistSchema)

module.exports=Watchlist
