const mongoose = require('mongoose')

// Create model based on create order response from razorpay
const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },  
  paymentId: {
    type: String
  },  
  orderId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  receipt: {
    type: String,
    required: true
  },
  notes: {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    membershipType: {
      type: String
    },
    emailId: {
      type: String
    }
  },
  status: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Payment', paymentSchema)