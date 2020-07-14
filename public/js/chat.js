const socket = io()
//ELEMENTS
const $messageform=document.querySelector('#messageform')
const $messageforminput=$messageform.querySelector('input')
const $messageformbutton=$messageform.querySelector('button')
const $sendlocationbutton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')

//https://codepen.io/Jackthomsonn/pen/jWyGvX

//Templates
const messagetemplates=document.querySelector('#message-template').innerHTML
const locationmessagetemplate=document.querySelector('#location-message-template').innerHTML
const sidebartemplate=document.querySelector('#sidebar-template').innerHTML

//options

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
const autoscroll=()=>{
    //new message element
    const $newmessage=$messages.lastElementChild

    // height of new message
    const newmessagestyle=getComputedStyle($newmessage)
    const newmessagemargin=parseInt(newmessagestyle.marginBottom)
    const newmessageheight=$newmessage.offsetHeight +newmessagemargin

    //visible height
    const visibleHeight=$messages.offsetHeight

    //height of message container
    const containerheight=$messages.scrollHeight

    //how far have i scrolled?
    const scrolloffset=$messages.scrollTop + visibleHeight

    if(containerheight-newmessageheight<=scrolloffset)
    {
        $messages.scrollTop=$messages.scrollHeight
    }


    console.log(newmessagestyle)

}

socket.on('message', (message) => {
    console.log(message)
    const html=Mustache.render(messagetemplates,{
        username:message.username,
        message:message.text,
        createdat:moment(message.createdat).format('h:mm a') 
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationmessage',(message)=>{
    console.log(message)
    const html=Mustache.render(locationmessagetemplate,
    {
        username:message.username,
        url:message.url,
        createdat:moment(message.createdat).format('h:mm a')

     
    })
    $messages.insertAdjacentHTML('beforeend',html)
    console.log(url)
    autoscroll()
})

socket.on('roomdata',({room,users})=>{
    
    const html=Mustache.render(sidebartemplate,{
        room,
        users
    })
    console.log(room)
    console.log(users)
    document.querySelector('#sidebar').innerHTML=html
})

$messageform.addEventListener('submit', (e) => {
    e.preventDefault()
    //const message=document.querySelector('input').value
    //disable form
    $messageformbutton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value

    socket.emit('sendmessage', message,(error)=>{
        // enable form
        $messageformbutton.removeAttribute('disabled')
        $messageforminput.value=''
        $messageforminput.focus()//focus cursor on input

        if(error)
        {
            return console.log(error)
        }
        console.log('message delivered')

    })

})

$sendlocationbutton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is nt supported by the browser')
    }

    $sendlocationbutton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position)
        socket.emit('sendlocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude

        },()=>{
            $sendlocationbutton.removeAttribute('disabled')
            console.log('location shared')
        })
        
    })
})



socket.emit('join',{username,room},(error)=>{
if(error){
    alert(error)
    location.href='/'
}


})

// socket.on('countUpdated', (count) => {
//     console.log('the count has been updated', count)
// })
// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicked')
//     socket.emit('increment')
// })