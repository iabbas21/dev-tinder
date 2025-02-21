const express = require('express')
const bcrypt = require('bcrypt')
const validator = require('validator')
const connectDB = require('./config/database')
const app = express()
const User = require('./models/user')
const { validateSignUpData } = require('./utils/validation')

// Middleware to parse the incoming request body
app.use(express.json())

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

        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (isPasswordMatched) {
            res.send('Login successful...')
        } else {
            throw new Error('Invalid credentials...')
        }

        res.send(user)
    } catch (error) {
        res.status(400).send(error.message)
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

// DELETE /user - Delete a user from DB
app.delete('/user', async (req, res) => {
    const userId = req.body.userId
    try {
        // await User.findByIdAndDelete(userId)
        await User.findOneAndDelete({ _id: userId })
        res.send("User deleted successfully...")
    } catch(error) {
        res.status(500).send("Error deleting user...")
    }
})

// PATCH /user - Update a user document in DB
app.patch('/user/:userId', async (req, res) => {
    const userId = req.params.userId
    const dataToUpdate = req.body
    try {
        const ALLOWED_UPDATES = ['gender', 'age', 'photoUrl', 'about', 'skills']
        const isAllowed = Object.keys(dataToUpdate).every(update => ALLOWED_UPDATES.includes(update))
        if(!isAllowed) {
            return res.status(400).send("Update not allowed...")
        }
        if(dataToUpdate?.skills && dataToUpdate.skills.length > 10) {
            return res.status(400).send("Skills limit exceeded...")
        }
        await User.findByIdAndUpdate(userId, dataToUpdate, {
            runValidators: true,
        })
        res.send("User updated successfully...")
    } catch(error) {
        res.status(500).send("Error updating user...")
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