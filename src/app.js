const express = require('express')

const app = express()

// /user?name=John&password=123
app.get('/user', (req, res) => {
    console.log(req.query)
    res.send({ firstName: 'John', lastName: 'Doe' })
})

// /user/1/John/123
app.get('/user/:id/:name/:password', (req, res) => {
    console.log(req.params)
    res.send({ firstName: 'John', lastName: 'Doe' })
})

const PORT = 3000;

app.listen(PORT, () => console.log('Server is running on PORT ' + PORT))