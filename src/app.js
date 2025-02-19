const express = require('express')
const { adminAuth, userAuth } = require('./middlewares/auth')

const app = express()

app.use('/admin', adminAuth)

app.get('/admin/getAllUser', (req, res) => {
    res.send('List of all users')
})

app.get('/admin/deleteUser', (req, res) => {
    res.send('User deleted successfully')
})

app.get('/user/login', (req, res, next) => {
    res.send('Login user')
})

app.get('/user/getProfile', userAuth, (req, res) => {
    res.send('User profile')
})


const PORT = 3000;

app.listen(PORT, () => console.log('Server is running on PORT ' + PORT))