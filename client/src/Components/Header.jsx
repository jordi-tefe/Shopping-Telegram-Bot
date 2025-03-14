import React from "react";
import { ShoppingCart } from "lucide-react"; // For a cart icon
import { Link } from "react-router-dom"; // Import Link from react-router-dom for navigation
import './Header.css'; // Import the CSS file

const Header = ({ username,phoneNo, cartItemCount }) => {
  return (
    <header className="header">
      {/* Left Side: Logo */}

      <div className="logo">🛒 My Store
      {/* <p>Posting as: {username},{phoneNo}</p> */}
      </div>

      {/* Center: User Info */}
      {/* <div className="user-info">
        {username ? `Posting as: @${username}` : "Guest User"}
      </div> */}

      {/* Right Side: Cart */}
      {/* <div className="cart">
        <ShoppingCart size={28} />
        {cartItemCount > 0 && (
          <span className="cart-badge">
            {cartItemCount}
          </span>
        )}
      </div> */}

      {/* Navbar (Navigation Links) */}
      {/* <p>Posting as: {username},{phoneNo}</p> */}
      <nav className="nav">
        <Link className="nav-link" to="/">Home</Link>

        <Link className="nav-link" to="/SellProduct"  state={{ username,phoneNo }}>Sell</Link> {/* Redirect to SellPage */}
        <Link className="nav-link" to="/about">About</Link>
      </nav>
    </header>
  );
};

export default Header;
