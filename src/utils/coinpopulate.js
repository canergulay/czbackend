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
          'X-CMC_PRO_API_KEY': '83ae5966-d0d2-40ae-85ad-0a680b4b99b8'
        }
    }

    let response = await axios(options)

}


async function requesterr(){
    
    const options = {
        url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?sort=cmc_rank',
        headers: {
          'X-CMC_PRO_API_KEY': '83ae5966-d0d2-40ae-85ad-0a680b4b99b8'
        }
    }

    let ree = await axios(options)


   
    
    return ree.data
    


}










module.exports=requesterr