const express = require('express')
const connectDB = require('./config/database')
const app = express()
const cookieParser = require('cookie-parser')

// Middleware to parse the incoming request body
app.use(express.json())
app.use(cookieParser())

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)

const PORT = 3000;

// First connect to the database then start the server
connectDB()
    .then(() => {
        console.log('DB connected successfully...')
        app.listen(PORT, () => console.log('Server is running on PORT ' + PORT))
    })
    .catch(err => console.log('Cannot establish DB connection...'))