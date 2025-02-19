const express = require('express')
const { adminAuth, userAuth } = require('./middlewares/auth')

const app = express()

app.get('/user', (req, res) => {
    try {
        throw new Error('Broken down')
        res.send('User Details!')
    } catch (err) {
        res.status(500).send('Something went wrong!!')
    }
})

app.use('/', (err, req, res, next) => {
    if(err) {
        // Log the error
        res.status(500).send('Something went wrong!')
    }
})

const PORT = 3000;

app.listen(PORT, () => console.log('Server is running on PORT ' + PORT))