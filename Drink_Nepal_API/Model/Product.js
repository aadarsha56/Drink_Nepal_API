require('./config');
const mongoose = require('mongoose');
const ProductSchema =mongoose.Schema({
    product_name:{
        type:String
    },
    product_price:{
        type:String
    },
    product_quantity:{
        type:String
    },
    product_photo:{
        type:String
    },
    product_description:{
        type:String
    },
    createddate:{
        type:String,
        default:Date
    },
    type:{
        type:String,
        default:'Alcohol'
    }
     })

const Product=mongoose.model('Product',ProductSchema);
module.exports=Product;

