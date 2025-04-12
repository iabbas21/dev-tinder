const express = require('express')
const requestRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

requestRouter.post('/send/request/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowedStatus = ["interested", "ignored"]
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({ message: 'Invalid status: ' + status })
        }

        const userToSendRequest = await User.findById(toUserId)
        if(!userToSendRequest) {
            return res.status(404).json({ message: 'User not found' })
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })

        if(existingConnectionRequest) {
            return res.status(400).json({ message: 'Connection request already exists' })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()

        res.json({
            message: req.user.firstName + `${status === 'interested' ? " is " : " "}` + status + `${status === 'interested' ? " in " : " "}` + userToSendRequest.firstName,
            data
        })
    } catch(error) {
        res.status(400).send(error.message)
    }
})

requestRouter.post('/send/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const { status, requestId } = req.params

        const allowedStatus = ["accepted", "rejected"]
        if(!allowedStatus.includes(status)) {
            return res.status(400).send("status not allowed")
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if(!connectionRequest) {
            return res.status(404).send("connection is not valid")
        }

        connectionRequest.status = status
        const data = await connectionRequest.save()
        res.json({ 
            message: `Connection is ${status}`,
            data
        })
    } catch(error) {
        res.status(400).send(error.message)
    }
})

module.exports = requestRouter