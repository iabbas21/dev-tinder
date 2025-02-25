const express = require('express')
const requestRouter = express.Router()
const { userAuth } = require('../middlewares/auth')

requestRouter.post('/sendConnectionRequest', userAuth, (req, res) => {
    const user = req.user
    // Send connection request
    console.log('Send connection request')

    res.send(user.firstName + 'sent connection request')
})

module.exports = requestRouter