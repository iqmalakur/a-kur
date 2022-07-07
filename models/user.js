const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    links: [mongoose.Schema.ObjectId],
})
const User = mongoose.model('User', userSchema)

module.exports = User
