import React from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Button from "../Button/Button";

function Cart({ cartItems }) {
  const navigate = useNavigate();
  const totalPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

  return (
    <div className="cart_container">
      {cartItems.length === 0 ? "No items in cart" : ""}
      <br />
      <span className="cart_price">Total Price: ${totalPrice.toFixed(2)}</span>

      <Button
        title={cartItems.length === 0 ? "Order!" : "Checkout"}
        type="checkout"
        disable={cartItems.length === 0}
        onClick={() => navigate("/checkout", { state: { cartItems } })}
      />
    </div>
  );
}

export default Cart;
