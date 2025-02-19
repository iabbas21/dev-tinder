const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://iirfanabbas1996:5u9SBwnyOa3kqihs@cluster0.cubn8.mongodb.net/devTinder');
}

module.exports = connectDB;