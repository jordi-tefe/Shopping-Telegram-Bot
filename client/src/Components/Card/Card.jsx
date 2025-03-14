import React, { useState,useEffect } from "react";
import Button from "../Button/Button";
import "./Card.css";


function Card({ products, onAdd, onRemove }) {
  // const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // const { id, title, price, image, ownerName, ownerContact } = food;

  // const handleIncrement = () => {
  //   setCount(count + 1);
  //   onAdd(food);
  // };

  // const handleDecrement = () => {
  //   setCount(count - 1);
  //   onRemove(food);
  // };
 

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <div className="card" >
        {/* <span className={`${count !== 0 ? "card_badge" : "card_badge--hidden"}`}>{count}</span> */}
        <div className="image_container" onClick={toggleModal}>
        {/* {products.img ? ( */}
             {/* <img src={products.img} alt={products.name} /> */}
            <img src={products.images[0]} alt={products.name} />


          {/* ) : (
            <p>Loadinggg image...</p> // Show loading text while the image is being processed
          )} */}
{/* {console.log( products.img)} */}

        </div>
        <h4 className="card_title">
          {products.name} <span className="card_price">${products.price}</span>
        </h4>
        {/* <div className="btn-container">
          <Button title={"+"} type={"add"} onClick={handleIncrement} />
          {count !== 0 && <Button title={"-"} type={"remove"} onClick={handleDecrement} />}
        </div> */}
      </div>

      {/* Styled Modal for Product Details */}
      {showModal && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={toggleModal}>&times;</span>
            <img src={products.images[0]} alt={products.name} className="modal-image" />
            <div className="modal-details">
              <h2>{products.title}</h2>
              <p className="modal-price">Price: <span>${products.price}</span></p>
              <div className="seller-info">
              <a href={`tel:${products.ownerphoneNo}`} target="_blank" rel="noopener noreferrer">
                             <button>Call Now</button>
                </a>
              <a href={`https://t.me/${products.ownername}`} target="_blank"> <button>Start Chat</button></a>
                <h3>Contact Seller</h3>
                <p><strong>Name:</strong> {products.ownername}</p>
                <p><strong>Phone:</strong> {products.ownerphoneNo}</p>
              </div>
            </div>
            <Button title="Close" type="remove" onClick={toggleModal} />
          </div>
        </div>
      )}
    </>
  );
}

export default Card;
