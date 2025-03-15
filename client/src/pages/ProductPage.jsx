// import './App.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
// import Button from '../Components/Button/Button';
import Card from '../Components/Card/Card';
import Cart from '../Components/Cart/Cart';
import Header from '../Components/Header'
import axios from 'axios';
// import { cache } from 'react';



// const { getData } = require("../db/db");
// const food = getData();
const tele = window.Telegram.WebApp;

function ProductPage() {

  const [products,setProducts]=useState([]);
  const [categories, setCategories] = useState([]); // 🔹 Store unique categories
  const [selectedCategory, setSelectedCategory] = useState(""); // 🔹 Selected category filter
  const [subcategories, setSubcategories] = useState({}); // Store subcategories for each category
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // Selected subcategory filter



useEffect(()=>{

  const fetchProducts = async() => {
    try{
      const response=await axios.get("https://chic-enchantment-production.up.railway.app/api/items");
      setProducts(response.data);

       // 🔹 Extract unique categories from products
       const uniqueCategories = [...new Set(response.data.map((item) => item.category))];
       setCategories(uniqueCategories);

    // Extract subcategories
    const subcategoryMap = {};
    uniqueCategories.forEach((category) => {
      subcategoryMap[category] = [
        ...new Set(response.data
          .filter((item) => item.category === category)
          .map((item) => item.subcategory || "Other")) // Handle missing subcategories
      ];
    });
    setSubcategories(subcategoryMap);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};
  fetchProducts();
},[]);

  // useEffect(() => {
  //   tele.ready();

  // }, []);
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [phoneNo, setphoneNo] = useState("");
  useEffect(() => {
    const telegramUsername = searchParams.get("username");
    const telegramPhoneNo = searchParams.get("phone");

    console.log("Extracted username:", telegramUsername); // ✅ Debugging
    console.log("Extracted phoneNo:", telegramPhoneNo); // ✅ Debugging

    if (telegramUsername && telegramPhoneNo) {
      setUsername(telegramUsername);
      setphoneNo(telegramPhoneNo);
    } else {
      console.warn("No username found in search params!");
    }
  }, [searchParams]);

  const [cartItems, setCartItems] = useState([]);
  

  const onAdd = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) => {
          if (x.id === food.id) {
            return { ...exist, quantity: x.quantity + 1 }
          }
          return x;
        }))
    } else {
      setCartItems([...cartItems, { ...food, quantity: 1 }])
    }
  }

  const onRemove = (food) => {
    const exist = cartItems.find((x) => x.id === food.id)
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((x) => x.id !== food.id))

    } else {
      setCartItems(cartItems.map((x) => {
        if (x.id === food.id) {
          return { ...exist, quantity: exist.quantity - 1 }
        } return x;

      }))

    }
  }

  const onCheckout = () => {
    tele.MainButton.text = "Payyy :)"
    tele.MainButton.show();
  };

  // // 🔹 Filter products based on selected category
  // const filteredProducts = selectedCategory
  //   ? products.filter((product) => product.category === selectedCategory)
  //   : products;
  // Filter products based on selected category and subcategory
  const filteredProducts = products.filter((product) => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (selectedSubcategory && product.subcategory !== selectedSubcategory) return false;
    return true;
  });

  return (
    <>

      <h1 >Products</h1>
      <Header username={username} phoneNo={phoneNo} cartItemCount={cartItems.length} />

      {/* <Cart cartItems={cartItems} onCheckout={onCheckout} /> */}
      {/* <Button title={'Add'} disable={false} type={'add'}/>
     <Button title={'Remove'} disable={false} type={'remove'}/>
     <Button title={'Checkout'} disable={false} type={'checkout'}/> */}
       {/* ✅ Display only if username exists */}
       {/* {username ? <h1>Posting as: @{username}</h1> : <h1>No username found!</h1>} */}
       
     {/* Category Buttons with Subcategories */}
     <div className="category-buttons">
        <button
          className={selectedCategory === "" ? "active" : ""}
          onClick={() => {
            setSelectedCategory("");
            setSelectedSubcategory("");
          }}
        >
          All
        </button>

        {categories.map((category) => (
          <div key={category} className="category-container">
            <button
              className={selectedCategory === category ? "active" : ""}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedSubcategory(""); // Reset subcategory when switching categories
              }}
            >
              {category}
            </button>
            
            {subcategories[category] && (
              <div className="subcategory-dropdown">
                {subcategories[category].map((sub) => (
                  <button
                    key={sub}
                    className={selectedSubcategory === sub ? "active" : ""}
                    onClick={() => setSelectedSubcategory(sub)}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>


      <div className="card_container">
        {
        filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card products={product} key={product.id} onAdd={onAdd} onRemove={onRemove} username={username} />
          ))
        ) : (
          <p>Loading Products....</p>
        )}
      </div>
       {/* 🔹 Styles */}
       <style>
        {`
        h1{
        position:relative;
        left: 40%
        }
          .category-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 20px 0 20px 40%;
          }

          .category-buttons button {
            padding: 10px 15px;
            border: none;
            border-radius: 20px;
            background: #ddd;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
          }

          .category-buttons button.active {
            background: #007bff;
            color: white;
            font-weight: bold;
          }

          .category-buttons button:hover {
            background: #0056b3;
            color: white;
          }

         //hover for subcategory
          h1 {
            position: relative;
            left: 40%;
          }

          .category-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 20px 0 20px 40%;
            position: relative;
          }

          .category-container {
            position: relative;
          }

          .category-buttons button {
            padding: 10px 15px;
            border: none;
            border-radius: 20px;
            background: #ddd;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            position: relative;
          }

          .category-buttons button.active {
            background: #007bff;
            color: white;
            font-weight: bold;
          }

          .category-buttons button:hover {
            background: #0056b3;
            color: white;
          }

          .subcategory-dropdown {
            display: none;
            position: absolute;
            left: 0;
            top: 40px;
            background: white;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            padding: 5px;
            z-index: 100;
          }

          .category-container:hover .subcategory-dropdown {
            display: block;
          }

          .subcategory-dropdown button {
            display: block;
            width: 100%;
            text-align: left;
            padding: 8px 12px;
            background: none;
            border: none;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s ease;
          }

          .subcategory-dropdown button:hover {
            background: #007bff;
            color: white;
          }

          .subcategory-dropdown button.active {
            background: #0056b3;
            color: white;
          }
        
      
        `}
      </style>
    </>


  );
}

export default ProductPage;