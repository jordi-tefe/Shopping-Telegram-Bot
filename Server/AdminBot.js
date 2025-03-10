const { Telegraf, Markup } = require("telegraf");
const { v4: uuidv4 } = require("uuid");
const User = require("./Models/Customer");
const Product = require("./Models/Product");
const Admin = require("./Models/Admin");
const dotenv = require("dotenv");

dotenv.config(); // Load .env file

const TOKEN = process.env.TGAdminBot_TOKEN;
const bot = new Telegraf(TOKEN);

// Define Admin Username (Change this to your real admin username)
const ADMIN_USERNAME = "Username0910"; 


function Adminstartbot() {
  bot.start((ctx) => {
    const TGUsername = ctx.from.username;
    Admin.findOne({ username: TGUsername }).then((admin) => {
      if (!admin) {
          return ctx.reply("❌ Unauthorized Access! This bot is for admin use only.");
      }
    })
    // Check if user is the admin
    // if (ctx.from.username !== admin) {
    //   return ctx.reply("❌ Unauthorized Access! This bot is for admin use only.");
    // }

    // const TGUsername = ctx.from.username;
    const TGfirstname = ctx.from.first_name;

    ctx.reply(`✅ Welcome, Admin ${TGfirstname} (@${TGUsername})!`,
        Markup.keyboard([
            ["➕ Manage Admins 🗑", "📦 Manage Products"],
            ["🛒 View Orders", "📊 Sales Report"]
        ]).resize()
    );
  });

   // 📌 Handle "📦 Manage Products" Button Click
   bot.hears("📦 Manage Products", (ctx) => {
    ctx.reply("🔹 Select an action:",
        Markup.keyboard([
          
            ["🗑 Delete Product", "📦 View Products"],
            ["⬅️ Back"]
        ]).resize()
    );
});
 // 📌 Handle "📦 Manage Products" Button Click
 bot.hears("➕ Manage Admins 🗑", (ctx) => {
    ctx.reply("🔹 Select an action:",
        Markup.keyboard([
            ["➕ Add Admin"],
            ["🗑 Delete Admin", "📦 View Admins"],
            ["⬅️ Back"]
        ]).resize()
    );
});


 // 📌 Handle "⬅️ Back" Button to Return to Main Menu
 bot.hears("⬅️ Back", (ctx) => {
  ctx.reply("🔹 Returning to main menu...",
      Markup.keyboard([
          ["➕ Manage Admins 🗑", "📦 Manage Products"],
          ["🛒 View Orders", "📊 Sales Report"]
      ]).resize()
  );
});

// 📌 Add Product
bot.hears("➕ Add Product", (ctx) => {
  ctx.reply("🔹 Send product details in this format:\n\n`Name | Category | Description | Price | ImageURL`");
  bot.on("text", (ctx) => {
      const parts = ctx.message.text.split("|").map(p => p.trim());
      if (parts.length !== 5) {
          return ctx.reply("⚠️ Incorrect format! Use: `Name | Category | Description | Price | ImageURL`");
      }

      const [name, category, description, price, imageUrl] = parts;
      if (isNaN(price)) {
          return ctx.reply("⚠️ Price must be a number!");
      }

      const newProduct = new Product({ name, category, description, price: Number(price), imageUrl });
      newProduct.save()
          .then(() => ctx.reply(`✅ Product **${name}** added successfully!`))
          .catch((err) => {
              console.error("Error adding product:", err);
              ctx.reply("❌ Failed to add product.");
          });
  });
});

// 📌 View Admins
bot.hears("📦 View Admins", async (ctx) => {
    const TGUsername = ctx.from.username;
    const admin = await Admin.findOne({ username: TGUsername });

    if (!admin) {
        return ctx.reply("❌ You do not have permission to view admins.");
    }

    // Fetch all admins from the database
    Admin.find()
        .then((admins) => {
            if (admins.length === 0) {
                return ctx.reply("📦 No admins found.");
            }

            let message = "📦 **Admin List:**\n\n";
            admins.forEach((a) => {
                message += `🛠 Admin: @${a.username}\n\n`;
            });

            ctx.reply(message);
        })
        .catch((err) => {
            console.error("Error fetching admins:", err);
            ctx.reply("❌ Failed to fetch admins.");
        });
});

// 📌 View Products
bot.hears("📦 View Products", (ctx) => {
  Product.find()
      .then((products) => {
          if (products.length === 0) {
              return ctx.reply("📦 No products available.");
          }

          let message = "📦 **Available Products:**\n\n";
          products.forEach((p) => {
              message += `🛍 **${p.name}**\n📂 Category: ${p.category}\n💲 Price: ${p.price}\n📜 ${p.description}\n🖼 [Image](${p.imageUrl})\n\n`;
          });

          ctx.replyWithMarkdown(message);
      })
      .catch((err) => {
          console.error("Error fetching products:", err);
          ctx.reply("❌ Failed to fetch products.");
      });
});

const editingProduct = {}; // Stores user states for editing


const adminState = {}; // Store states for each admin (edit & delete)
// 📌 Handle "🗑 Delete Admin" Button
bot.hears("🗑 Delete Admin", (ctx) => {
    const adminId = ctx.from.id;
    adminState[adminId] = { action: "Admin_deletion" }; // Set state for deleting an admin
    ctx.reply("🔹 Send the **username** without *@* of the admin you want to delete.");
});

// 📌 Handle "🗑 Delete Product" Button
bot.hears("🗑 Delete Product", (ctx) => {
    const adminId = ctx.from.id;
    adminState[adminId] = { action: "delete" }; // Set state for delete
    ctx.reply("🔹 Send the **product name** you want to delete.");
});

// 📌 Handle "✏️ Edit Product" Button
bot.hears("✏️ Edit Product", (ctx) => {
    const adminId = ctx.from.id;
    adminState[adminId] = { action: "edit_step1" }; // Step 1: waiting for product name
    ctx.reply("🔹 Send the **product name** you want to edit.");
});


// 📌 Handle Text Input for Both Delete & Edit
bot.on("text", async (ctx) => {
    const adminId = ctx.from.id;
    const state = adminState[adminId];

    if (!state) return; // No active state, ignore message

    const productName = ctx.message.text.trim();
    const username = ctx.message.text.trim(); // Username of admin to be deleted

    if (state.action === "delete") {
        // Handle Delete Product
        try {
            const deletedProduct = await Product.findOneAndDelete({ name: productName });

            if (!deletedProduct) {
                delete adminState[adminId]; // Clear state
                return ctx.reply(`❌ No product found with name: **${productName}**`);
            }

            ctx.reply(`✅ Product **${productName}** deleted successfully!`);
        } catch (error) {
            console.error("Error deleting product:", error);
            ctx.reply("❌ Failed to delete product.");
        }

    } else if (state.action === "Admin_deletion") {
       // Step 1: Handle Admin Deletion
       try {
        // Check if admin exists in the database
        const deletedAdmin = await Admin.findOneAndDelete({ username });

        if (!deletedAdmin) {
            delete adminState[adminId]; // Clear state
            return ctx.reply(`❌ No admin found with username: **${username}**`);
        }

        ctx.reply(`✅ Admin **${username}** has been deleted successfully!`);
    } catch (error) {
        console.error("Error deleting admin:", error);
        ctx.reply("❌ Failed to delete admin.");
    }
        
    } else if (state.action === "edit_step2") {
        // Step 2: Update Product
        const parts = ctx.message.text.split("|").map(p => p.trim());
        if (parts.length !== 5) {
            return ctx.reply("⚠️ Incorrect format! Use: `Name | Category | Description | Price | ImageURL`");
        }

        const [newName, category, description, price, imageUrl] = parts;
        if (isNaN(price)) {
            return ctx.reply("⚠️ Price must be a number!");
        }

        try {
            await Product.updateOne(
                { _id: state.product._id },
                { name: newName, category, description, price: Number(price), imageUrl }
            );
            ctx.reply(`✅ Product **${state.product.name}** updated successfully!`);
        } catch (error) {
            console.error("Error updating product:", error);
            ctx.reply("❌ Failed to update product.");
        }
    } else if (state.action === "Add_admin"){
        
    }

    delete adminState[adminId]; // Clear state after action is completed
});



  bot.hears("➕ Add Admin", async (ctx) => {
    const TGUsername = ctx.from.username;
    const admin = await Admin.findOne({ username: TGUsername });

    if (!admin) {
        return ctx.reply("❌ You do not have permission to add admins.");
    }

    ctx.reply("🔹 Send the new admin's username as a reply. Example: `@newadmin`.");

    // Wait for the next message (new admin username)
    bot.on("text", async (ctx) => {
        const newAdminUsername = ctx.message.text.replace("@", "").trim();

        if (!newAdminUsername.match(/^[a-zA-Z0-9_]+$/)) {
            return ctx.reply("⚠️ Invalid username format. Use only letters, numbers, or underscores.");
        }

        const existingAdmin = await Admin.findOne({ username: newAdminUsername });
        if (existingAdmin) {
            return ctx.reply(`⚠️ @${newAdminUsername} is already an admin.`);
        }

        const newAdmin = new Admin({ username: newAdminUsername });
        await newAdmin.save();

        ctx.reply(`✅ @${newAdminUsername} has been added as an admin.`);
    });
});


  // Start bot with error handling
  bot.launch()
    .then(() => console.log("🚀 Admin Bot Started Successfully!"))
    .catch((err) => console.error("❌ Failed to start bot:", err));
}

// Export function
module.exports = Adminstartbot;


// bot.hears("➕ Add Admin", async (ctx) => {
//   const TGUsername = ctx.from.username;
//   const admin = await Admin.findOne({ username: TGUsername });

//   if (!admin) {
//       return ctx.reply("❌ You do not have permission to add admins.");
//   }

//   ctx.reply("🔹 Send the new admin's username as a message. Example: `@newadmin`.");

//   bot.on("text", async (ctx) => {
//       const newAdminUsername = ctx.message.text.replace("@", "").trim();
//       if (!newAdminUsername) {
//           return ctx.reply("⚠️ Invalid username. Try again.");
//       }

//       const existingAdmin = await Admin.findOne({ username: newAdminUsername });
//       if (existingAdmin) {
//           return ctx.reply(`⚠️ @${newAdminUsername} is already an admin.`);
//       }

//       const newAdmin = new Admin({ username: newAdminUsername });
//       await newAdmin.save();

//       ctx.reply(`✅ @${newAdminUsername} has been added as an admin.`);
//   });
// });
