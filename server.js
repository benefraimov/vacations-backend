import express from 'express'
import { Server } from 'socket.io'

import path from 'path'
import connectDB from './config/db.js'
import cors from 'cors'
import 'colors'
import dotenv from 'dotenv'

dotenv.config()

// Import Routers
import usersRouter from './routes/users.js'
import vacationsRouter from './routes/vacations.js'
import uploadsRouter from './routes/uploads.js'
import socketsRouter from './routes/sockets.js'

// Connect mongoDB
connectDB()

const App = express()

// We can mimic this by usuing path.resolve
const __dirname = path.resolve()

// Making our uploads folder static
// join - so we can join different segments of a file
// __dirname - point to the current directory,
// however, this is not available if we are using es modules,
// it is only available if we use common js wich is the require syntax
App.use('/uploads', express.static(path.join(__dirname, '/uploads')))

App.use(express.json())

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

App.use(cors(corsOptions))

App.use('/api/socket', socketsRouter)
App.use('/api/users', usersRouter)
App.use('/api/vacations', vacationsRouter)
App.use('/api/uploads', uploadsRouter)

const PORT = 4000

const server = App.listen(PORT, console.log(`Server is running on port ${PORT}`.yellow.bold))

const io = new Server(server)

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on('follow', (data) => {
        io.emit('got follow', data)
        console.log("new follow")
    })

    socket.on('unfollow', (data) => {
        io.emit('got unfollow', data)
        console.log("new unfollow")
    })

    socket.on('newVacation', (data) => {
        io.emit('got follow', data)
        console.log("new vacation added")
    })

    socket.on('editVacation', (data) => {
        io.emit('got follow', data)
        console.log("vacation edited")
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});