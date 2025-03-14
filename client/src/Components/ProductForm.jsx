import React, { useState } from "react";
const ProductForm = ({ addProduct }) => {
  const [product, setProduct] = useState({ name: "", price: "", category: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct(product);
    setProduct({ name: "", price: "", category: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <input type="text" placeholder="Name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} required />
      <input type="text" placeholder="Price" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} required />
      <input type="text" placeholder="Category" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} required />
      <button type="submit">Add Product</button>
    </form>
  );
};
export default ProductForm;