const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    age: {
        type: Number,
        required: [true, 'Age is required']
    },
    phone: Number,
    money: {
        type: Number,
        default: 0.0
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User