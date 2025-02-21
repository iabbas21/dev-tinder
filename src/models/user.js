const mongoose = require('mongoose')
const { Schema } = mongoose

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
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        validate(value) {
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Invalid gender")
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    photoUrl: {
        type: String,
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

module.exports = mongoose.model('User', userSchema)