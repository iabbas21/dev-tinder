const express = require('express')

const app = express()

app.get('/user', (req, res) => {
    res.send({ firstName: 'John', lastName: 'Doe' })
})

app.post('/user', (req, res) => {
    console.log('Data created successfully')
    res.send('Data created successfully')
})

app.delete('/user', (req, res) => {
    console.log('Data deleted successfully')
    res.send('Data deleted successfully')
})

// This will handle all http method requests to /test
app.use('/test', (req, res) => {
    res.send('Testing Server')
})

const PORT = 3000;

app.listen(PORT, () => console.log('Server is running on PORT ' + PORT))