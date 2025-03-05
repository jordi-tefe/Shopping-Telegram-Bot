const mongoose =require('mongoose');
const productSchema = new mongoose.Schema({
    ownername: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    type: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    location: { type: String },
    images: [{ type: String }] // Ensure array for multiple images
  });
  

const Product=mongoose.model('products',productSchema);

module.exports = Product;