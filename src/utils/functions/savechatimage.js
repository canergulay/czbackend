var multer  = require('multer')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/utils/chatimages')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}.jpg`)
  }
})

var savechatimage = multer({ storage: storage })

module.exports=savechatimage