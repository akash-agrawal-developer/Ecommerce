const mongoose = require('mongoose');
const type = require('nodash/lib/type');

const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
});

module.exports = mongoose.model('user',userSchema);