const mongoose =require('mongoose');
// const tryconnect= require('./Db/dbConnect')
// tryconnect();
//unique:true
const Userschema=new mongoose.Schema({
    Username:{type:String,required:true},
    Phonenumber:{type:String,required:true},  
    sessionId:{type:String,required:true}
})

const User=mongoose.model('User',Userschema);

module.exports = User;