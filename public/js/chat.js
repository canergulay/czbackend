const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')




socket.on('message',(message)=>{
  console.log(message)
})

$messageForm.addEventListener('submit',(e)=>{
  e.preventDefault()
  $messageFormButton.setAttribute('disabled','disabled')


  const message = e.target.elements.message.value

  socket.emit('sendMessage',message,(error)=>{ // sona koyduğumuz callback mesaj karşı socket tarafına ulaştığında tetiklenecek.
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value=''
    $messageFormInput.focus()

    if(error){
      return console.log(error)
    }
    console.log('Message delivered')
    
  })

})


document.querySelector('#send-location').addEventListener('click',()=>{
  if(!navigator.geolocation){
    return alert('YOUR BROWSER DOESNT SUPPORT!')
  }


  navigator.geolocation.getCurrentPosition((position)=>{
    socket.emit('sendLocation',{
      lat:position.coords.latitude,
      long:position.coords.longitude
    },()=>{
      console.log("We've delivered you message beach!")
    })
    console.log(position)
  })

})

