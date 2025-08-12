const cron = require('node-cron')
const ConnectionRequest = require('../models/connectionRequest')
const { subDays, startOfDay, endOfDay } = require('date-fns')
const { run } = require('./sendEmail')

cron.schedule('0 8 * * *', async () => {
    try {
      const yesterday = subDays(new Date(), 1)

      const yesterdayStart = startOfDay(yesterday)
      const yesterdayEnd = endOfDay(yesterday)

      const pendingRequests = await ConnectionRequest.find({
        status: 'interested',
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd
        }
      }).populate('fromUserId toUserId');

      const listOfEmails = [...new Set(pendingRequests.map(request => request.toUserId.emailId))]

      for(const emailId of listOfEmails) {
        try {
          const res = await run();
          console.log(res)
        } catch(err) {
          console.log(err)
        }
      }

    } catch(error) {
        console.error(error)
    }
})