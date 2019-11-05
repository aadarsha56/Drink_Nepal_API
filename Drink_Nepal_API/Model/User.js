 require('./config');
const mongoose = require('mongoose');

const jwt=require('jsonwebtoken');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    dob:{
        type:String,
    },
    address:{
    type:String,
    },
    type:{
        type:String,
        default:"user"
    },
    tokens:[{
        token:{
            type:String,
        }
    }],
    password:{
        type:String,
    },
    createddate:{
        type:String,
        default:Date
    }
   
    })

   userSchema.statics.checkCrediantialsDb = async (user22, pass) =>{

        const user1 = await User.findOne({phone : user22, password : pass})
         return user1;
    }


    userSchema.methods.generateAuthToken = async function () {
        const user = this
         const token = jwt.sign({ _id: user._id.toString() }, 'auth')
         
         console.log(token);
          user.tokens = user.tokens.concat({ token :token })
          await user.save()
          return token
         }  
const User=mongoose.model('User',userSchema);
module.exports=User;


