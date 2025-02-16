const express = require('express')

const app = express()

app.use('/', (req, res) => {
    res.send('Namasthe from the server')
})

app.use('/test', (req, res) => {
    res.send('Testing')
})

app.use('/home', (req, res) => {
    res.send('Hello from home')
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log('Server is running on PORT ' + PORT)
})