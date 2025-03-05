const mongoose =require('mongoose');

//Loginnnnn
async  function tryconnect() {
    try{
    await mongoose.connect("mongodb+srv://jordi:123@bot.6wyux.mongodb.net/TGBOT");
    console.log( "connected to the database");
} catch  (error) {
    console.log("Didn't connected to the database",error);
}
}
// tryconnect();mongodb+srv://jordi:1993@bot.6wyux.mongodb.net/

module.exports = tryconnect;