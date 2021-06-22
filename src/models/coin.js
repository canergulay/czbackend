const mongoose = require('mongoose')
const redis = require("redis");
const client = redis.createClient();


const coinScheme = mongoose.Schema({
    coinName:{
        type:String,
    },
    short:{
        type:String
    },
    coinPhoto:{
        type:String
    },
    coinid:{
        type:Number
    },
    watchlist:{
        type:Number,
        default:0
    },
    online:{
        type:Number,
        default:0
    },
    rank: {
        type:Number,
    }
})

coinScheme.methods.toObjectAsync = async function () {
    const coin = this.toObject(),
        reply = await client.get(coin.coinid);

    coin.online = reply === null ? 0 : reply;
    return coin;
};





const Coin = mongoose.model('Coin', coinScheme)

module.exports=Coin