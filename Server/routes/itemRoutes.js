const express = require("express");
const router = express.Router();
const Item = require("../Models/Product");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// // Ensure uploads folder exists
// const uploadDir = "uploads/";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // 🛠 Setup Multer for file storage on disk
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Save files in 'uploads' folder
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage: storage });

// Configure multer to store files in memory (not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// 🟢 GET: Fetch all products
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();

    const itemsWithImages = items.map((item) => ({
      _id: item._id,
      ownername: item.ownername,
      ownerphoneNo: item.ownerphoneNo,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      type: item.type,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
      location: item.location,
      images: item.images.map((img) =>
        img.data
          ? `data:${img.contentType};base64,${img.data.toString("base64")}`
          : null
      ),
    }));

    res.json(itemsWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// module.exports = router; // ✅ Ensure the router is exported correctly


// 🟢 POST: Add a new product with image upload
router.post("/", upload.array("images[]", 5), async (req, res) => {
  try {
    const { ownername,ownerphoneNo, name, category, subcategory, type, description, price, quantity, Location } = req.body;

    console.log("🟢 Received Data:", req.body);
    console.log("🟢 Uploaded Files:", req.files);

    if (!ownername || !name || !category || !type || !description || !price || !quantity || !Location) {
      console.log("❌ Missing required fields!");
      return res.status(400).json({ error: "Missing required fields" });
    }
     // ✅ Extract filenames and store them in the "images" array
    //  const imageUrls = req.files.length > 0 ? req.files.map((file) => `uploads/${file.filename}`) : [];
      // Convert uploaded images to Buffers
    const images = req.files.map((file) => ({
      data: file.buffer, // Store the binary data
      contentType: file.mimetype, // Store file type
    }));

    console.log("Product Image Data:", images);


    const newItem = new Item({
      ownername,
      ownerphoneNo,
      name,
      category,
      subcategory,
      type,
      description,
      price: parseFloat(price), // Convert to number
      quantity: parseInt(quantity),
      Location,
      images,
    });

    const savedItem = await newItem.save();
    console.log("✅ Product Saved:", savedItem);

    res.status(201).json(savedItem);
  } catch (error) {
    console.error("❌ Error saving product:", error);
    res.status(500).json({ error: "Failed to add product", details: error.message });
  }
});

// 🟢 PUT: Update product by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ error: "Product not found" });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// 🟢 DELETE: Delete product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Item Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
