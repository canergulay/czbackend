const Comment = require('../../models/comment')
const Post = require('../../models/post')
var multer  = require('multer')
      

    
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/utils/commentimages')
    },
    filename: (req, file, cb) => {
      console.log(req.body)
      console.log('req meq aqq')
      cb(null, `${Date.now()}-${file.originalname}.jpg`)
    }
  })

  var upload = multer({ storage: storage })



  async function savecomment(comment,postid,owner,key){
    const mycomment = new Comment({
        comment:comment,
        post:postid,
        owner:owner,
        image:' '
    })

    await mycomment.save()
    
    const post = await Post.Post.findByIdAndUpdate(postid,{$inc:{numberOfReply:1}})
    return post

  }

  
  async function savecommentWimage(comment,postid,owner,key,image){
    const mycomment = new Comment({
        comment:comment,
        post:postid,
        owner:owner,
        hasImage:true,
        image:image
    })
   // await key==1?Post.PostCoin.findByIdAndUpdate(postid,{$inc:{numberOfReply:1}}):Post.Post.findByIdAndUpdate(postid,{$inc:{numberOfReply:1}}) 
    
   await mycomment.save()
   
   const post = await Post.Post.findByIdAndUpdate(postid,{$inc:{numberOfReply:1}})
   return post

    
  }


  module.exports= {upload,savecomment,savecommentWimage}