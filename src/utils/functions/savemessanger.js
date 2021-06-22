var multer  = require('multer')
const Messenger = require('../../models/messenger') 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/utils/chatimages')
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}.jpg`)
    }
  })

  var upload = multer({ storage: storage })


async function savemessenger (from,to,convid,message) {

    const mesaj = new Messenger.Messenger({
        conversationid:convid,
        from:from,
        users:[from,to],
        message:message,
        hasImage:false,
        })

     await mesaj.save()   

     
     return mesaj._id
}

async function savemessengerWimage (from,to,convid,message,image) {

    const mesaj = new Messenger.Messenger({
        conversationid:convid,
        from:from,
        message:message,
        image:image,
        users:[from,to],
        hasImage:true,
        })
        
     await mesaj.save()
     
     return mesaj._id   
}

module.exports={savemessenger,savemessengerWimage,upload}