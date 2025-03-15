const express = require("express");
const bodyParser =require("body-parser")
const cors= require('cors');
const app = express();
const mongoose =require('mongoose');
const tryconnect=require('./Db/dbConnect');
const User=require('./Models/Customer');
const Product=require('./Models/Product');
const iroutes=require('./routes/itemRoutes');
const startbot=require('./Bot');
const Adminstartbot=require('./AdminBot');
const password = encodeURIComponent( "1993");
    const dotenv = require("dotenv");


     dotenv.config(); // Load .env file
const portnum=process.env.PORT ;
// const TOKEN = process.env.TG_TOKEN;
app.use(cors({
    origin: ["https://l8n8n6b3-3000.uks1.devtunnels.ms/", "https://web.telegram.org"],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use('/api/items',iroutes);//requests starting with /api/items wil be directed to iroutes/itemsRoutes module


tryconnect();
startbot();
Adminstartbot();
// Step 1: Define a schema for your "table" (collection)
// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     age: Number
// });

// // Step 2: Create a model
// const User = mongoose.model("User", userSchema);

// Step 3: Insert data into the collection
// app.post('/add-user', async (req, res) => {
//     const { name, email, age } = req.body;

//     const newUser = new User({
//         name,
//         email,
//         age
//     });
//     try {
//         await newUser.save(); // Save the user to the database
//         res.status(201).send("User added successfully");
//     } catch (error) {
//         res.status(500).send("Error adding user");
//     }
// });

// Start server
app.listen(portnum, () => {
    console.log(`Server running on port ${portnum}`);
});
// app.use(bodyParser.json());
// app.use(cors({
//     origin: 'http://localhost:3000'
// }));

//   // Middleware


// // app.get('/', (req, res) => {
// //     res.send('Hello World'); // Or whatever response you want to send
// // });

// // Handle user signup endpoint
// app.post('/Register', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const user = new User({ name, email, password });
//     await user.save();
//     console.log('User registered:', user);
    
//     res.status(201).send('User registered successfully');
//   } catch (error) {
//     console.error('Error registering user:', error);
//     res.status(500).send('Error registering user');
//   }
// });

// // Handle user login endpoint
// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email, password });
//     if (user) {
//       console.log('User logged in:', user);
//       res.status(200).send('Logged in successfully');
//     } else {
     
//       console.log('Invalid email or password');
//       res.status(401).send('Invalid email or password');
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).send('Error logging in');
//   }
// });

// app.listen(portnum, () => {
//     console.log("server is running on port ",{portnum} );
// })
// // Customer Schema
// const customerSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//   });
  
//   // Customer Model
//   const Customer = mongoose.model('User', customerSchema);
  