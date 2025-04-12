const express = require('express')
const bcrypt = require('bcrypt')
const validator = require('validator')
const authRouter = express.Router()
const { validateSignUpData } = require('../utils/validation')
const User = require('../models/user')

authRouter.post('/signup', async (req, res) => {
    try {
        // Validation of request body
        validateSignUpData(req)

        const { firstName, lastName, emailId, password } = req.body

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Creating a new instance of User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword
        })

        const userSaved = await user.save(user)

        const token = await userSaved.getJwtToken()
        // Add the token to the cookie and send the response to the user
        res.cookie("token", token, { expires: new Date(Date.now() + 7 * 86400000), httpOnly: true })
        res.send(userSaved)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body

        if(!validator.isEmail(emailId)) {
            throw new Error('Invalid email address...')
        }

        const user = await User.findOne({
            emailId
        })

        if(!user) {
            throw new Error('Invalid credentials...')
        }

        const isPasswordMatched = await user.validatePassword(password)
        if (isPasswordMatched) {
            // Get JWT Token
            const token = await user.getJwtToken()
            
            // Add the token to the cookie and send the response to the user
            res.cookie("token", token, { expires: new Date(Date.now() + 7 * 86400000), httpOnly: true })
            res.send(user)
        } else {
            throw new Error('Invalid credentials...')
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})

authRouter.post('/logout', async (req, res) => {
    res.clearCookie('token')
    res.send('Logged out successfully...')
})

module.exports = authRouter