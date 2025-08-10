const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    try {
        // Extract token from cookies
        const { token } = req.cookies
        if(!token) {
            return res.status(401).send('Please login')
        }

        // Validate token by extracting hidden secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Fetch user with _id from DB
        const user = await User.findById(decoded._id)
        if(!user) {
            throw new Error('User not found')
        }
        req.user = user
        next()
    } catch(error) {
        res.status(400).send(error.message)
    }
}

module.exports = {
    userAuth
}