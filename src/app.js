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

const PORT = 3000;

// First connect to the database then start the server
connectDB()
    .then(() => {
        console.log('DB connected successfully...')
        app.listen(PORT, () => console.log('Server is running on PORT ' + PORT))
    })
    .catch(err => console.log('Cannot establish DB connection...'))