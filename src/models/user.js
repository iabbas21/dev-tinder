const mongoose = require('mongoose')
const { Schema } = mongoose
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Password is too weak")
            }
        }
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Invalid gender")
            }
        }
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    membershipType: {
        type: String
    },
    age: {
        type: Number,
        min: 18,
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png"
    },
    about: {
        type: String,
        default: "Hey there! I am a web developer"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true,
})

userSchema.methods.getJwtToken = async function() {
    const user = this
    return await jwt.sign({ _id: user._id }, 'Dev@Tinder$2025', { expiresIn: '7d' })
}

userSchema.methods.validatePassword = async function(password) {
    const user = this
    return await bcrypt.compare(password, user.password)
}

module.exports = mongoose.model('User', userSchema)