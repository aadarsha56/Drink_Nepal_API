require('./config');
const mongoose = require('mongoose');
const BuySchema = mongoose.Schema({
    product: { type: String, ref: 'Cart' },
    date: Date,
    status: { type: Boolean }
})
const Buy = mongoose.model('Buy', BuySchema);
module.exports = Buy;