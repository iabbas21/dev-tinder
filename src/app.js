const express = require('express')
const connectDB = require('./config/database')
const app = express()
const User = require('./models/user')
const { validateSignUpData } = require('./utils/validation')
const bcrypt = require('bcrypt')
const validator = require('validator')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { userAuth } = require('./middlewares/auth')

// Middleware to parse the incoming request body
app.use(express.json())
app.use(cookieParser())

app.post('/signup', async (req, res) => {
    try {
        // Validation of request body
        validateSignUpData(req)

        const { firstName, lastName, emailId, password } = req.body

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Creating a new instance of User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword
        })

        await user.save(user)
        res.send("User created successfully...")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// POST /login
app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body

        if(!validator.isEmail(emailId)) {
            throw new Error('Invalid email address...')
        }

        const user = await User.findOne({
            emailId
        })

        if(!user) {
            throw new Error('Invalid credentials...')
        }

        const isPasswordMatched = await user.validatePassword(password)
        if (isPasswordMatched) {
            // Get JWT Token
            const token = await user.getJwtToken()
            
            // Add the token to the cookie and send the response to the user
            res.cookie("token", token, { expires: new Date(Date.now() + 7 * 86400000), httpOnly: true })
            res.send('Login successful...')
        } else {
            throw new Error('Invalid credentials...')
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// GET /profile
app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch(error) {
        res.status(400).send(error.message)
    }
})

// POST /sendConnectionRequest
app.post('/sendConnectionRequest', userAuth, (req, res) => {
    const user = req.user
    // Send connection request
    console.log('Send connection request')

    res.send(user.firstName + 'sent connection request')
})


const PORT = 3000;

// First connect to the database then start the server
connectDB()
    .then(() => {
        console.log('DB connected successfully...')
        app.listen(PORT, () => console.log('Server is running on PORT ' + PORT))
    })
    .catch(err => console.log('Cannot establish DB connection...'))