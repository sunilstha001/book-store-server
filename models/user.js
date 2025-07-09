const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    email: {
        type : String,
        required : true,
        unique : true
    },
    password: {
        type : String,
        required : true,
        unique : true
    },
    address: {
        type : String,
        required : true
    },
    avatar: {
        type : String,
        default : 'https://www.gravatar.com/avatar/'
    },
    role: {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    favourite:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }], 
    cart:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books'
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order'
    }],

}, {timestamps: true});

module.exports = mongoose.model('users', userSchema);