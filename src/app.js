const express = require('express')
const cors = require('cors')
const connectDB = require('./config/database')
const app = express()
const cookieParser = require('cookie-parser')
require('dotenv').config()
require('./utils/cronJob')
const http = require('http')

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user')
const paymentRouter = require('./routes/payment')
const courseRouter = require('./routes/course')
const initializeSocket = require('./utils/socket')
const chatRouter = require('./routes/chat')

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)
app.use('/', paymentRouter)
app.use('/', courseRouter)
app.use('/', chatRouter)

const server = http.createServer(app)
initializeSocket(server)

const PORT = process.env.PORT;
// First connect to the database then start the server
connectDB()
    .then(() => {
        console.log('DB connected successfully...')
        server.listen(PORT, () => console.log('Server is running on PORT ' + PORT))
    })
    .catch(err => console.log('Cannot establish DB connection...'))