const mongoose = require('mongoose')

const linkSchema = new mongoose.Schema({
    original: String,
    short: String,
})
const Link = mongoose.model('Link', linkSchema)

module.exports = Link
