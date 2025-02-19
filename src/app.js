const express = require('express')
const connectDB = require('./config/database')
const app = express()
const User = require('./models/user')

app.post('/signup', async (req, res) => {
    const userObj = {
        firstName: 'Raghu',
        lastName: 'Kumar',
        emailId: 'raghu@gmail.com',
        password: '123456',
        age: 26,
        gender: 'male'
    }
    const user = new User(userObj)
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