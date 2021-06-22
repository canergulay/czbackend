const Post = require('../../models/post')



async function savepostwimage (post,owner,hasImage,image,isCoin,coin){
    console.log(isCoin)
    const postum = new Post.Post({
        post,owner,hasImage,image,isCoin,coin
    })
    await postum.save()
}

async function savepost (post,owner,hasImage,isCoin,coin){
    console.log(isCoin)
    const postum = new Post.Post({
        post,owner,hasImage,isCoin,coin
    })

    await postum.save()
    }

module.exports={savepost,savepostwimage}