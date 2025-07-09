const mongoose = require('mongoose');
const order = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books',
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
        ref: 'books', 
    },
    
}, {timestamps: true})
module.exports = mongoose.model('order', order);