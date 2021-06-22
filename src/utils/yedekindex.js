const http = require('http')
const path = require('path')
const express = require('express')
const User = require('./models/user')
const Coin = require('./models/coin')
const Messenger = require('./models/messenger')
const ChatRoom = require('./models/chatroom')
const postRouter = require('./routers/post.js')
const messengerRouter = require('./routers/messenger.js')
const userRouter = require('./routers/user.js')
const coinRouter = require('./routers/coin.js')
const voteRouter = require('./routers/vote.js')
const wlRouter = require('./routers/watchlist')
const posterRouter = require('./routers/poster.js')
const messageRouter = require('./routers/message.js')
const chatroomRouter = require('./routers/chatroom.js')
const commentRouter = require('./routers/comment.js')

const { response } = require('express');
const { isPrimitive } = require('util')
const Message = require('./models/message')
require('./config/db')




// Socket.io ile çalışırken bunu yapmamız lazım mış :D

//yukarıda kullandığım http serverını aşağıda kullanıyorum./
//Bunu yapınca bizim server WebSocket protokülüyle çalıabilir hala geliyor.  
//const io = socketio(server)// Bu şekilde initialise ediyoruz socket modülünü, daha sonra kullanabilmek üzere
const app = express()
const server  = http.createServer(app) 
const io = require('socket.io')(server)

io.on('connection',(socket)=>{

    console.log('we got someone')
    
   
    socket.on('coinjoin',(chatid)=>{
       
       var type = chatid.type
       var chatid=chatid.coinid
        console.log(type)
        socket.join(chatid)
        
        io.to(chatid).emit('onlinestatus',io.sockets.adapter.rooms.get(chatid).size-1)

        io.to(chatid).emit('enter','someonehascome')

        if(type == 'coin'){
            Coin.findOneAndUpdate({_id:chatid},{$inc:{online:1}}).exec();
        }else{
            ChatRoom.findOneAndUpdate({_id:chatid},{$inc:{online:1}}).exec();
        }
       
        

        console.log(chatid)
        socket.emit('message','welcome to the room '+chatid)
        socket.on('chatmessage', async (data)=>{
            console.log(data);

            const user = await User.findById(data['sender'])
            
           

            io.to(chatid).emit('chatmessage',{
                'username':user.username,
                'userpicture':user.userpicture,
                'userid':user._id,
                'createdAt':' ',//to be edited
                'hasPicture':data['hasPicture'],
                'message':data['message']
            })
            
     
            const message = new Message({
                message:data['message'],
                owner:data['sender'],
                coinid:data['coinid'],
                hasPicture:data['hasPicture']
            })

            message.save()



            
        })

        socket.on('disconnect',()=>{ // bunu io.on('connection') içine yazıyoruz ve dispose görevi görüyor.
            
            if(type=='coin'){
                Coin.findOneAndUpdate({_id:chatid},{$inc:{online:-1}},{useFindAndModify:false}).exec();
            }else{
                ChatRoom.findOneAndUpdate({_id:chatid},{$inc:{online:-1}},{useFindAndModify:false}).exec();
            }

            io.to(chatid).emit('exit','someonehasgone')
            socket.leave(chatid);
            
            console.log('someone gone from the chat : '+chatid+' and the socketid is '+socket.id)
         })

    })

   socket.on('messengerjoin',(baglan)=>{
     //  console.log('Your conversationid is '+data.conversationid)
       let conversationid = baglan.conversationid
       socket.join(conversationid)
       console.log('Your bilmemne id conver '+conversationid)
       
       socket.on('chatmessage', async (data)=>{
        console.log(data);
 
        const user = await User.findById(data['from'])
      //  console.log(user)
     
        io.to(conversationid).emit('chatmessage',{
            conversationid:data.conversationid,
            users:[data.from,data.conversationid],
            from:{
                _id:data.from,
                username:user.username,
                userpicture:user.userpicture
            },
            message:data.message,
            hasPicture:data.hasPicture,
            image:data.image,
        })


        const messenger = new Messenger.Messenger({
            conversationid:data.conversationid,
            from:data.from,
            message:data.message,
            hasImage:data.hasPicture,
            image:data.image,
        })

        messenger.save()

        await Messenger.Conversation.findByIdAndUpdate(data.conversationid,{lastmessage:messenger._id})
        await User.updateLastActivity(user)


        
    })
    socket.on('disconnect',()=>{ // bunu io.on('connection') içine yazıyoruz ve dispose görevi görüyor.
        console.log('sasa')
        io.to(conversationid).emit('exit','someonehasgone')
        socket.leave(conversationid);
        
        console.log('someone gone from the chat : '+conversationid+' and the socketid is '+socket.id)
     })


   })

   socket.on('newvote',(vote)=>{
    console.log(vote)
       io.emit('newvote',vote)


      
   })
socket.on('disconnect',()=>{
           console.log('BİRİLERİ GİDİYOR.')
       })

})



const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

//app.use(express.static(__dirname + '/utils/files')); // o folderdaki dosyaları direkt olarak / erişilebilir yapıyor.
//

app.use('/coinicons', express.static(__dirname + '/utils/files/')); // bu o dizini /coinicons olarak kullanmamızı sağlıyor.

app.use('/images', express.static(__dirname + '/utils/images/')); // bu o dizini /coinicons olarak kullanmamızı sağlıyor.

app.use('/chatimages', express.static(__dirname + '/utils/chatimages/')); // bu o dizini /coinicons olarak kullanmamızı sağlıyor.

app.use('/commentimages', express.static(__dirname + '/utils/commentimages/')); // bu o dizini /coinicons olarak kullanmamızı sağlıyor.

app.use(express.json())

app.use(postRouter)
app.use(userRouter)
app.use(coinRouter)
app.use(voteRouter)
app.use(wlRouter)
app.use(messengerRouter)
app.use(posterRouter)
app.use(commentRouter)
app.use(chatroomRouter)
app.use(messageRouter)

app.use(express.static(publicDirectoryPath))





server.listen(port, ()=>{
    
    console.log(`Server is up on port ${port}!!`)
})