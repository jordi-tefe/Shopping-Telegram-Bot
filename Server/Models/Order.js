const mongoose = rquire('mongoose');

const OrderSchema = new mongoose.Schema({
    customerId:{type : String ,required : true},
    items :[
        {
            productId : {type : mongoose.Schema.types.ObjectId ,ref:'products'},
            quantity : {type : Number ,required : true},
            totalamount: {type : Number ,required : true},
            status :{type : String ,default : 'Pending'},
            createdate:{type : Date ,default : Date.now}

    }]
})
module.exports = mongoose.model('Order', OrderSchema);