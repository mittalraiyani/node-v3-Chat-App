const express = require('express')
const http = require('http')
const path = require('path')
const Filter = require('bad-words')
const socketio = require('socket.io')
const { generatemessage, generatelocationmessage } = require('./utils/messages')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const { getuser, removeuser, adduser, getuserinroom } = require('./utils/users')
const port = process.env.PORT || 3000
const publicdDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicdDirectoryPath))
//let count = 0
io.on('connection', (socket) => {
    console.log('new web socket connection')


    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = adduser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('message', generatemessage('Admin', 'welcome'))
        socket.broadcast.to(user.room).emit('message', generatemessage('Admin', `${user.username} has joined`))
        io.to(user.room).emit('roomdata', {
            room: user.room,
            users: getuserinroom(user.room)
        })

        callback()
    })


    socket.on('sendmessage', (message, callback) => {
        const user = getuser(socket.id)

        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('profanity is not allowed')
        }
        //console.log(user.room)
        io.to(user.room).emit('message', generatemessage(user.username, message))
        callback()
    })

    socket.on('sendlocation', (coords, callback) => {
        const user = getuser(socket.id)
        console.log(user.room)
        io.to(user.room).emit('locationmessage', generatelocationmessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeuser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generatemessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomdata',{
                room:user.room,
                users:getuserinroom(user.room)
            })
        }

    })
    // socket.emit('countUpdated', count)
    // socket.on('increment', () => {
    //     count++
    //    // socket.emit('countUpdated', count)
    //     io.emit('countUpdated', count)

    // })

})

server.listen(port, () => {
    console.log(`server is on up port${port}!`)
})