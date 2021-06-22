const mongoose = require('mongoose')

const connectionURL = 'mongodb://127.0.0.1:27017/cointalkz'

mongoose.connect(connectionURL,{
    useNewUrlParser:true,
    useCreateIndex:true,

}).then(()=>console.log('şarılıba')).catch((e)=>console.log(e))

