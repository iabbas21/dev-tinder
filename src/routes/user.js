const express = require('express')
const userRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

const USER_SAFE_DATA = "firstName lastName gender age photoUrl about skills"

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', USER_SAFE_DATA)

        res.send(connectionRequests)
    } catch(error) {
        res.status(400).send(error.message)
    }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate('fromUserId', USER_SAFE_DATA).populate('toUserId', USER_SAFE_DATA)

        const data = connectionRequests.map(connection => {
            if(connection.fromUserId._id.equals(loggedInUser._id)) {
                return connection.toUserId
            } else {
                return connection.fromUserId
            }
        })

        res.send(data)
    } catch(error) {
        res.status(400).send(error.message)
    }
})

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit
        const skip = (page - 1) * limit

        const loggedInUser = req.user

        // Find all the connections (sent + received)
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select('fromUserId toUserId')

        const blockedUsersFromFeed = new Set()
        connectionRequests.forEach(connection => {
            blockedUsersFromFeed.add(connection.fromUserId.toString())
            blockedUsersFromFeed.add(connection.toUserId.toString())
        })

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(blockedUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)

        res.send(users)
    } catch(error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = userRouter