const express = require('express')
const connectDB = require('./config/database')
const app = express()
const User = require('./models/user')

// Middleware to parse the incoming request body
app.use(express.json())

app.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.send("User created successfully...")
    } catch (error) {
        res.status(400).send("Error saving data...")
    }
})

// GET /user - get a user from DB
app.get('/user', async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId })
        if(user) {
            res.send(user)
        } else {
            res.status(404).send("User not found...")
        }
        // const users = await User.find({ emailId: req.body.emailId })
        // if(users.length > 0) {
        //     res.send(users)
        // } else {
        //     res.status(404).send("User not found...")
        // }
    } catch(error) {
        console.log(error)
        res.status(500).send("Error fetching user...")
    }
})

// GET /feed - get all the users from DB
app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch(error) {
        console.log(error)
        res.status(500).send("Error fetching users...")
    }
})

const PORT = 3000;

// First connect to the database then start the server
connectDB()
    .then(() => {
        console.log('DB connected successfully...')
        app.listen(PORT, () => console.log('Server is running on PORT ' + PORT))
    })
    .catch(err => console.log('Cannot establish DB connection...'))