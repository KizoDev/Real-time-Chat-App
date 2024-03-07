import express from "express";
import {Server} from "socket.io";
import  path  from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = process.env.PORT || 3500

const app = express()

app.use(express.static(path.join(__dirname, "Public")))

const expressServer = app.listen(port, () => {
    console.log(`listening on port ${port}`)

})
const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV ==="production" ? false :
         ["http://localhost:5500", "http://127.0.0.1:5500"]

    }
})

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`);
   // upon connection to user only
   socket.emit('message', 'welcome to chat app')

   //upon connection ... to other users
   socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)}}connected`)

    // listening to message event
    socket.on('message', data => {
        console.log(data);
        io.emit("message", `${socket.id.substring(0, 5) }:${data} `)
    })

    //when user disconnect.. to others
    socket.on('disconnect',() => {
        socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)}} 
        disconnected`)
    } )

    //listening for activity
    socket.on('activity', (name) => {
        socket.broadcast.emit('activity ', name)
    })
})

