import './App.css';
// import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductPage from './pages/ProductPage';
import CheckoutPage from "./pages/CheckoutPage";
import SellProduct from "./pages/SellProduct";
// import Card from './Components/Card/Card';
// import Cart from './Components/Cart/Cart';

// const { getData } = require("./db/db");
// const food = getData();

// const tele = window.Telegram.WebApp;
function App() {


  // useEffect(() => {
  //   tele.ready();

  // })

  // const [cartItems, setCartItems] = useState([]);

  // const onAdd = (food) => {
  //   const exist = cartItems.find((x) => x.id === food.id);
  //   if (exist) {
  //     setCartItems(
  //       cartItems.map((x) => {
  //         if (x.id === food.id) {
  //           return { ...exist, quantity: x.quantity + 1 }
  //         }
  //         return x;
  //       }))
  //   } else {
  //     setCartItems([...cartItems, { ...food, quantity: 1 }])
  //   }
  // }

  // const onRemove = (food) => {
  //   const exist = cartItems.find((x) => x.id === food.id)
  //   if (exist.quantity === 1) {
  //     setCartItems(cartItems.filter((x) => x.id !== food.id))

  //   } else {
  //     setCartItems(cartItems.map((x) => {
  //       if (x.id === food.id) {
  //         return { ...exist, quantity: exist.quantity - 1 }
  //       } return x;

  //     }))

  //   }
  // }

  // const onCheckout = () => {
  //   tele.MainButton.text = "Payyy :)"
  //   tele.MainButton.show();
  // };
  return (
    // <>
    //   <h1 >Products</h1>

    //   <Cart cartItems={cartItems} onCheckout={onCheckout} />
    //   {/* <Button title={'Add'} disable={false} type={'add'}/>
    //  <Button title={'Remove'} disable={false} type={'remove'}/>
    //  <Button title={'Checkout'} disable={false} type={'checkout'}/> */}
    //   <div className="card_container">
    //     {food.map(food => {
    //       return <Card food={food} key={food.id} onAdd={onAdd} onRemove={onRemove} />
    //     })}
    //   </div>
    // </>
    <Router>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/SellProduct" element={<SellProduct />} />
      </Routes>
    </Router>


  );
}

export default App;
// import React, { useState } from "react";
// import ProductList from "./Components/ProductList";
// import ProductForm from "./Components/ProductForm";
// import Navbar from "./Components/Navbar";
// import "./styles.css";

// const App = () => {
//   const [products, setProducts] = useState([
//     { id: 1, name: "Laptop", price: "$500", category: "Electronics" },
//     { id: 2, name: "Bicycle", price: "$150", category: "Sports" },
//   ]);

//   const addProduct = (newProduct) => {
//     setProducts([...products, { id: products.length + 1, ...newProduct }]);
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="container mx-auto p-4">
//         <ProductForm addProduct={addProduct} />
//         <ProductList products={products} />
//       </div>
//     </div>
//   );
// };

// export default App;