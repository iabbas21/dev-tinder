const express = require('express')
const profileRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const { validateProfileEditData } = require('../utils/validation')
const validator = require('validator')
const bcrypt = require('bcrypt')
const User = require('../models/user')


profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch(error) {
        res.status(400).send(error.message)
    }
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if(!validateProfileEditData(req)) {
            throw new Error("Invalid fields for update...")
        }
        const loggedInUser = req.user
        Object.keys(req.body).forEach((field) => loggedInUser[field] = req.body[field])
        await loggedInUser.save()
        res.send(loggedInUser)
    } catch(error) {
        res.status(400).send(error.message)
    }
})

profileRouter.patch('/profile/password', async (req, res) => {
    try {
        const { emailId, password } = req.body

        if(!validator.isEmail(emailId)) {
            throw new Error('Invalid email address...')
        }

        const user = await User.findOne({ emailId })

        if(!user) {
            throw new Error('Invalid credentials...')
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        await user.save()
        res.send('Password updated successfully')
    } catch(error) {
        res.status(400).send(error.message)
    }
})

module.exports = profileRouter