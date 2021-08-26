const Axios = require('axios')
const request = require('request')
const fs = require('fs')
const Path = require('path')
const Coin = require('../models/coin')
const axios = require('axios');

async function requester(){
    
    const options = {
        url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?sort=cmc_rank&limit=500',
        headers: {
          'HERE, THERE WAS MY API KEY'
        }
    }

    let response = await axios(options)

}


async function requesterr(){
    
    const options = {
        url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?sort=cmc_rank',
        headers: {
          'X-CMC_PRO_API_KEY': 'HERE, THERE WAS MY API KEY'
        }
    }

    let ree = await axios(options)


   
    
    return ree.data
    


}










module.exports=requesterr
