require('./config');
const mongoose = require('mongoose');
const CartSchema = mongoose.Schema({
    product_id: {
        type: String,
        ref: "Product"
    },
    quantity: {
        type: Number
    },
    sold_price: {
        type: Number
    },
    user_id: {
        type: String,
        ref: "User"
    },

    isTouched: { type: Boolean, default: false },
    created_at: Date,
    Total_Price: {
        type: String
    },
    Bought_date: {
        type: String,
        default: Date
    },
    location: { lat: String, lng: String }
})

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;