const mongoose =require('mongoose');
 const dotenv = require("dotenv");

    dotenv.config(); // Load .env file

//Loginnnnn
async  function tryconnect() {
    try{
    await mongoose.connect(process.env.DB_URL);
    console.log( "connected to the database");
} catch  (error) {
    console.log("Didn't connected to the database",error);
}
}


module.exports = tryconnect;