const jwt = require('jsonwebtoken')
const User = require('../../models/user.js')

const auth = async (req,res,next) => {
    try{
        const token = req.header('Authorizationcz')

        console.log(token)
        
        const decoded = jwt.verify(token,'cointalkzhdes')
       

        if(!decoded){
            throw new Error()
        }

       
        req.userobject = user
       
        next()
      
       
    }catch(a){
        res.status(401).send({error:'please authenticate...'})
    }

}

module.exports = auth
