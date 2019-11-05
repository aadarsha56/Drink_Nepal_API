// const config = require('mongoose');
const mongoose = require('mongoose');
//connecting with database using mongoose
mongoose.connect('mongodb://127.0.0.1:27017/DrinkNepal', {
 useNewUrlParser: true,
 useCreateIndex: true,
 useFindAndModify:false
}, function(err){
    if(err){
        console.log('db error');
        
    }else{
        console.log('db connected');     
    }
})
