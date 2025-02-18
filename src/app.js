const express = require('express')

const app = express()

app.use(
    '/user', 
    (req, res, next) => {
        console.log('Route Handler 1');
        next()
    },
   (req, res, next) => {
        console.log('Route Handler 2');
        next()
    },
    (req, res, next) => {
        console.log('Route Handler 3');
        next()
    },
    (req, res, next) => {
        console.log('Route Handler 4');
        res.send('Response sent from Route Handler 4')
    }
)

const PORT = 3000;

app.listen(PORT, () => console.log('Server is running on PORT ' + PORT))