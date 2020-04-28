const socket = io()
//Elements
const form = document.querySelector('#form-message')
const formInput = document.querySelector('input')
const formButton = document.querySelector('button')
const locationButton = document.querySelector('#send-location')
const messages = document.querySelector('#messages')
const sidebar = document.querySelector("#sidebar")

//Template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    //new Message element
    const newMessage = messages.lastElementChild

    //height of new Message
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    //visible Height
    const visibleHeight = messages.offsetHeight

    //Height of content container
    const contentContainerHeight = messages.scrollHeight

    //how far have i scrolled?
    const scrollOffset = messages.scrollTop + visibleHeight

    if(contentContainerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight
    }
}


//printing message to the console and on the display
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

//print location message
socket.on('locationMessage', (url) => {
    console.log(url)
    const html = Mustache.render(locationMessageTemplate, {
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format('h:mm a')
    })

    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    sidebar.innerHTML = html
})

form.addEventListener('submit', (e) => {
    e.preventDefault()

    formButton.setAttribute('disabled', 'disabled')

    const msg = e.target.elements.message.value
    socket.emit('sendMessage', msg, () => {
        formButton.removeAttribute('disabled')

        formInput.value = ''
        formInput.focus()
        console.log('Message Delivered!')
    })
})

locationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Your browser doesnot support Geolocation')
    }

    locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }

        socket.emit('sendLocation', location, () => {
            locationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })

})

socket.emit('join', { username, room }, (error) => {
    if(error){
        alert(error)
    }
    location.href = '/'
})