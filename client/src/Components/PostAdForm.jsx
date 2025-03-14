import React, { useState ,useEffect} from "react";
import axios from "axios";
import "./PostAdForm.css";
import {categories} from "../db/Jsonfiles"
// import "../db/categories.json"



const PostAd = (username,phoneNo) => {
  // const username="uziiiiii";
  // const phoneNo='0999999999';

  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  
  const [quantity, setQuantity] = useState("");
  const [bulkPriceEnabled, setBulkPriceEnabled] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [step, setStep] = useState(1);
  // const [categories, setCategories] = useState([]);
  // const [selectedOption, setSelectedOption] = useState("");

  // // Fetch categories from JSON
  // useEffect(() => {
  //   fetch("/categories.JSON") // Adjust path if needed
  //     .then((response) => response.json())
  //     .then((data) => setCategories(data))
  //     .catch((error) => console.error("Error fetching categories:", error));
  // }, []);
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  // const [selectedClassName, setSelectedClassName] = useState("");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory("");
    // setSelectedClassName("");
      setLocation(""); // Reset location when category changes
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
    // setSelectedClassName("");
  };

  const [formData, setFormData] = useState({
    name: "",
    // subcategory: "",
    type: "",
    description: "",
    price: "",
  });

  // ✅ Function to Clear Form
  const handleClear = () => {
    setCategory("");
    setSelectedSubcategory("");
    setSelectedCategory("");
    setLocation("");
    setQuantity("");
    setBulkPriceEnabled(false);
    setPhotos([]);
    setStep(1);
    setFormData({
      name: "",
      // subcategory: "",
      type: "",
      description: "",
      price: "",
    });
  };

  // const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
    setBulkPriceEnabled(e.target.value > 1);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos([...photos, ...files]);
  };

  const handleNext = () => {
    if (selectedCategory && location) {
      setStep(2);
    }
  };

  const handleBack = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form...");
  
    const productData = new FormData();
    productData.append("ownername", username);
    productData.append("ownerphoneNo", phoneNo);
    productData.append("name", formData.name);
    productData.append("category", selectedCategory);
    productData.append("subcategory", selectedSubcategory);
    productData.append("type", formData.type);
    productData.append("description", formData.description);
    productData.append("price", formData.price);
    productData.append("quantity", quantity);
    productData.append("Location", location);
  
    
    // Append photos
    photos.forEach((photo) => productData.append("images[]", photo));

  // 🚀 Debug: Log all FormData values
  // for (let pair of productData.entries()) {
  //   console.log(pair[0] + ": " + pair[1]);
  // }
  
    try {
      const response = await axios.post("http://localhost:3005/api/items", productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("Response Data:", response.data); // ✅ Log response correctly
      alert("Product Added Successfully!"); 
  
      handleClear(); // ✅ Clear form after success
    } catch (error) {
      console.error("Error adding product:", error);
  
      // ✅ Show error details in an alert
      alert("Failed to addd product. Error: " + (error.response?.data?.error || error.message));
    }
  };
  
  return (
    <div className="post-ad-container">
      <h2 className="post-ad-title">Post Ad</h2>
      <p>Posting as: {username},{phoneNo}</p>
      <button className="clear-button" onClick={handleClear}>Clear</button>

      {step === 1 && (
        <>
          {/* First Form */}
          {/* <div className="form-group">
            <input type="hidden" name="ownername" value={username} />
            <input type="hidden" name="ownerphoneNo" value={phoneNo} />
            <select className="input-field" value={category} onChange={handleCategoryChange}>
              <option value="">Select Category*</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
            </select>
          </div> */}
          {/* <div className="form-group">
      <select className="input-field" value={category} onChange={handleCategoryChange}>
        <option value="">Select Category or Subcategory*</option>
        {categories.map((category, index) => (
          <optgroup key={index} label={category.name}>
            {category.subcategories.map((sub, subIndex) => (
              <option key={subIndex} value={sub}>{sub}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div> */}
      <div className="form-group">
      {/* Category Dropdown */}
      {/* <label>Category:</label> */}
      <select className="input-field" value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.name} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Subcategory Dropdown (Shows only if a category is selected) */}
      {selectedCategory && (
        <>
          <label style={{color: "black" ,fontSize: "13px"}}> Subcategory</label>
          <select className="input-field" value={selectedSubcategory} onChange={handleSubcategoryChange}>
            <option value="">Select Subcategory</option>
            {categories
              .find((category) => category.name === selectedCategory)
              ?.subcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
          </select>
        </>
      )}

      {/* Class Name Dropdown (Shows only if a subcategory is selected) */}
     
    </div>

          <div className="form-group">
            <select className="input-field" value={location} onChange={handleLocationChange} disabled={!selectedCategory || !selectedSubcategory}>
              <option value="">Select Location*</option>
              <option value="addis-ababa">Addis Ababa</option>
              <option value="bahir-dar">Bahir Dar</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="photo-upload">
            <label className="photo-label">Add photo</label>
            <input
              type="file"
              className="file-input"
              onChange={handlePhotoUpload}
              multiple
              accept="image/png, image/jpeg"
              id="fileInput"
            />
            <div className="upload-box" onClick={() => document.getElementById("fileInput").click()}>
              {photos.length > 0 ? (
                photos.map((photo, index) => (
                  <img key={index} src={URL.createObjectURL(photo)} alt="Uploaded" className="preview-image" />
                ))
              ) : (
                <span className="plus">+</span>
              )}
            </div>
            <p>Supported formats are *.jpg and *.png</p>
          </div>

          <button className="next-button" onClick={handleNext} disabled={!selectedCategory || !photos || !location || !selectedSubcategory}>
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <button className="back-button" onClick={handleBack}>Back</button>
          <div className="form-group">
            <input type="text" className="input-field" placeholder="Title*" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="form-row">
            <select className="input-field" name="type" value={formData.type} onChange={handleInputChange} required>
              <option value="">Type*</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
            <input type="number" className="input-field" placeholder="Quantity*" value={quantity} onChange={handleQuantityChange} required />
          </div>
          <textarea className="textarea-field" placeholder="Description*" name="description" value={formData.description} onChange={handleInputChange} required />

          <div className="form-row">
            <div className="" style={{color: "black"}}>ETB</div>
            <input type="number" className="input-field" placeholder="Price*" name="price" value={formData.price} onChange={handleInputChange} required />
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default PostAd;



// {import React, { useState } from "react";
// import axios from "axios";
// import "./PostAdForm.css";

// const PostAd = () => {
//   const username = "uziiiiii";
//   const phoneNo = '0999999999';
//   const [category, setCategory] = useState("");
//   const [location, setLocation] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [bulkPriceEnabled, setBulkPriceEnabled] = useState(false);
//   const [photos, setPhotos] = useState([]);
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     name: "",
//     subcategory: "",
//     type: "",
//     description: "",
//     price: "",
//   });

//   // Locations mapped by category
//   const locations = {
//     electronics: {
//       "Addis Ababa": ["City1", "City2"],
//       "Bahir Dar": ["City3", "City4"],
//     },
//     furniture: {
//       "Addis Ababa": ["CityA", "CityB"],
//       "Gondar": ["CityC", "CityD"],
//     },
//   };

//   // ✅ Function to Clear Form
//   const handleClear = () => {
//     setCategory("");
//     setLocation("");
//     setQuantity("");
//     setBulkPriceEnabled(false);
//     setPhotos([]);
//     setStep(1);
//     setFormData({
//       name: "",
//       subcategory: "",
//       type: "",
//       description: "",
//       price: "",
//     });
//   };

//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//     setLocation(""); // Reset location when category changes
//   };

//   const handleLocationChange = (region, city) => {
//     setLocation(`${region}, ${city}`);
//   };

//   const handleQuantityChange = (e) => {
//     setQuantity(e.target.value);
//     setBulkPriceEnabled(e.target.value > 1);
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handlePhotoUpload = (e) => {
//     const files = Array.from(e.target.files);
//     setPhotos([...photos, ...files]);
//   };

//   const handleNext = () => {
//     if (category && location) {
//       setStep(2);
//     }
//   };

//   const handleBack = () => setStep(1);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Submitting form...");
  
//     const productData = new FormData();
//     productData.append("ownername", username);
//     productData.append("ownerphoneNo", phoneNo);
//     productData.append("name", formData.name);
//     productData.append("category", category);
//     productData.append("subcategory", formData.subcategory);
//     productData.append("type", formData.type);
//     productData.append("description", formData.description);
//     productData.append("price", formData.price);
//     productData.append("quantity", quantity);
//     productData.append("Location", location);
  
//     // Append photos
//     photos.forEach((photo) => productData.append("image", photo));

//     try {
//       const response = await axios.post("http://localhost:3005/api/items", productData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
  
//       console.log("Response Data:", response.data); // ✅ Log response correctly
//       alert("Product Added Successfully!"); 
  
//       handleClear(); // ✅ Clear form after success
//     } catch (error) {
//       console.error("Error adding product:", error);
  
//       // ✅ Show error details in an alert
//       alert("Failed to add product. Error: " + (error.response?.data?.error || error.message));
//     }
//   };

//   return (
//     <div className="post-ad-container">
//       <h2 className="post-ad-title">Post Ad</h2>
//       <p>Posting as: {username},{phoneNo}</p>
//       <button className="clear-button" onClick={handleClear}>Clear</button>

//       {step === 1 && (
//         <>
//           {/* First Form */}
//           <div className="form-group">
//             <input type="hidden" name="ownername" value={username} />
//             <input type="hidden" name="ownerphoneNo" value={phoneNo} />
//             <select className="input-field" value={category} onChange={handleCategoryChange}>
//               <option value="">Select Category*</option>
//               <option value="electronics">Electronics</option>
//               <option value="furniture">Furniture</option>
//             </select>
//           </div>

//           {/* Location Dropdown */}
//           <div className="form-group">
//             <select 
//               className="input-field" 
//               disabled={!category} // Disable until category is selected
//             >
//               <option value="">Select Location*</option>
//               {category &&
//                 Object.keys(locations[category]).map((region) => (
//                   <optgroup label={region} key={region}>
//                     {locations[category][region].map((city) => (
//                       <option 
//                         key={city} 
//                         value={`${region}, ${city}`}
//                         onClick={() => handleLocationChange(region, city)} // Set selected region, city
//                       >
//                         {`${region}, ${city}`}
//                       </option>
//                     ))}
//                   </optgroup>
//                 ))}
//             </select>
//           </div>

//           {/* Image Upload */}
//           <div className="photo-upload">
//             <label className="photo-label">Add photo</label>
//             <input
//               type="file"
//               className="file-input"
//               onChange={handlePhotoUpload}
//               multiple
//               accept="image/png, image/jpeg"
//               id="fileInput"
//             />
//             <div className="upload-box" onClick={() => document.getElementById("fileInput").click()}>
//               {photos.length > 0 ? (
//                 photos.map((photo, index) => (
//                   <img key={index} src={URL.createObjectURL(photo)} alt="Uploaded" className="preview-image" />
//                 ))
//               ) : (
//                 <span className="plus">+</span>
//               )}
//             </div>
//             <p>Supported formats are *.jpg and *.png</p>
//           </div>

//           <button className="next-button" onClick={handleNext} disabled={!category || !location}>
//             Next
//           </button>
//         </>
//       )}

//       {step === 2 && (
//         <form onSubmit={handleSubmit}>
//           <button className="back-button" onClick={handleBack}>Back</button>
//           <div className="form-group">
//             <input type="text" className="input-field" placeholder="Title*" name="name" value={formData.name} onChange={handleInputChange} required />
//           </div>
//           <div className="form-row">
//             <select className="input-field" name="type" value={formData.type} onChange={handleInputChange} required>
//               <option value="">Type*</option>
//               <option value="new">New</option>
//               <option value="used">Used</option>
//             </select>
//             <input type="number" className="input-field" placeholder="Quantity*" value={quantity} onChange={handleQuantityChange} required />
//           </div>
//           <textarea className="textarea-field" placeholder="Description*" name="description" value={formData.description} onChange={handleInputChange} required />

//           <div className="form-row">
//             <div className="input-field">ETB</div>
//             <input type="number" className="input-field" placeholder="Price*" name="price" value={formData.price} onChange={handleInputChange} required />
//           </div>

//           <button type="submit" className="submit-button">
//             Submit
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default PostAd;
// }