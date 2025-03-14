import React from "react";
import { useLocation } from "react-router-dom";
import Button from "../Components/Button/Button";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          <ul className="checkout-list">
            {cartItems.map((item) => (
              <li key={item.id} className="checkout-item">
                {item.title} - {item.quantity} x ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="checkout-total">Total Price: ${totalPrice.toFixed(2)}</p>
          <Button title="Pay Now" type="checkout" onClick={() => alert("Payment Process Initiated!")} />
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
