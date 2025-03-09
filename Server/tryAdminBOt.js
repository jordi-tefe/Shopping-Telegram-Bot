const { Telegraf, Markup } = require("telegraf");
const { v4: uuidv4 } = require("uuid");
const User = require("./Models/Customer");
const Product = require("./Models/Product");
const Admin = require("./Models/Admin");

const TOKEN = "7676624103:AAEZIVQPKCHZn9ardi9cIczFxv5w-_potKA";
const bot = new Telegraf(TOKEN);

// Define Admin Username (Change this to your real admin username)
const ADMIN_USERNAME = "Username0910"; 


function startbot() {
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
            ["➕ Add Admin", "📦 Manage Products"],
            ["🛒 View Orders", "📊 Sales Report"]
        ]).resize()
    );
  });

   // 📌 Handle "📦 Manage Products" Button Click
   bot.hears("📦 Manage Products", (ctx) => {
    ctx.reply("🔹 Select an action:",
        Markup.keyboard([
            ["➕ Add Product", "✏️ Edit Product"],
            ["🗑 Delete Product", "📦 View Products"],
            ["⬅️ Back"]
        ]).resize()
    );
});

 // 📌 Handle "⬅️ Back" Button to Return to Main Menu
 bot.hears("⬅️ Back", (ctx) => {
  ctx.reply("🔹 Returning to main menu...",
      Markup.keyboard([
          ["➕ Add Admin", "📦 Manage Products"],
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


// 📌 Delete Product
// bot.hears("🗑 Delete Product", (ctx) => {
//   ctx.reply("🔹 Send the **product name** you want to delete.");
//   bot.on("text", (ctx) => {
//       const productName = ctx.message.text.trim();
//       Product.findOneAndDelete({ name: productName })
//           .then((deletedProduct) => {
//               if (!deletedProduct) {
//                   return ctx.reply(`❌ No product found with name: **${productName}**`);
//               }
//               ctx.reply(`✅ Product **${productName}** deleted successfully!`);
//           })
//           .catch((err) => {
//               console.error("Error deleting product:", err);
//               ctx.reply("❌ Failed to delete product.");
//           });
//   });
// });

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

// // 📌 Edit Product
// bot.hears("✏️ Edit Product", (ctx) => {
//     const adminId = ctx.from.id; // Identify the admin using Telegram ID
//     ctx.reply("🔹 Send the **product name** you want to edit.");

//     // Store the admin state as "waiting for product name"
//     editingProduct[adminId] = { step: "waiting_for_product" };
// });

// // Listen for the product name
// bot.on("text", async (ctx) => {
//     const adminId = ctx.from.id;
//     if (!editingProduct[adminId]) return; // Ignore if no active state

//     if (editingProduct[adminId].step === "waiting_for_product") {
//         const productName = ctx.message.text.trim();
//         try {
//             const product = await Product.findOne({ name: productName });
//             if (!product) {
//                 delete editingProduct[adminId]; // Clear state
//                 return ctx.reply(`❌ No product found with name: **${productName}**`);
//             }

//             ctx.reply("🔹 Send the new details:\n\n`Name | Category | Description | Price | ImageURL`");
//             editingProduct[adminId] = { step: "waiting_for_details", product }; // Update state
//         } catch (error) {
//             console.error("Error finding product:", error);
//             ctx.reply("❌ Failed to find product.");
//         }
//     } else if (editingProduct[adminId].step === "waiting_for_details") {
//         const parts = ctx.message.text.split("|").map(p => p.trim());
//         if (parts.length !== 5) {
//             return ctx.reply("⚠️ Incorrect format! Use: `Name | Category | Description | Price | ImageURL`");
//         }

//         const [newName, category, description, price, imageUrl] = parts;
//         if (isNaN(price)) {
//             return ctx.reply("⚠️ Price must be a number!");
//         }

//         try {
//             await Product.updateOne(
//                 { _id: editingProduct[adminId].product._id },
//                 { name: newName, category, description, price: Number(price), imageUrl }
//             );
//             ctx.reply(`✅ Product **${editingProduct[adminId].product.name}** updated successfully!`);
//             delete editingProduct[adminId]; // Clear state after update
//         } catch (error) {
//             console.error("Error updating product:", error);
//             ctx.reply("❌ Failed to update product.");
//         }
//     }
// });

const adminState = {}; // Store states for each admin (edit & delete)

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

    } else if (state.action === "edit_step1") {
        // Step 1: Find the product before editing
        try {
            const product = await Product.findOne({ name: productName });

            if (!product) {
                delete adminState[adminId]; // Clear state
                return ctx.reply(`❌ No product found with name: **${productName}**`);
            }

            adminState[adminId] = { action: "edit_step2", product }; // Move to step 2
            ctx.reply("🔹 Send the new details in format:\n`Name | Category | Description | Price | ImageURL`");
        } catch (error) {
            console.error("Error finding product:", error);
            ctx.reply("❌ Failed to find product.");
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

  bot.command("addadmin", async (ctx) => {
    try {
        const TGUsername = ctx.from.username;

        // Check if user is an admin
        const admin = await Admin.findOne({ username: TGUsername });
        if (!admin) {
            return ctx.reply("❌ You do not have permission to add admins.");
        }else{
          return ctx.reply(" You do  have permission to add admins.");
        }

        // Extract new admin username
        const messageParts = ctx.message.text.split(" ");
        if (messageParts.length < 2) {
            return ctx.reply("⚠️ Please provide a username. Example: `/addadmin @newadmin`");
        }

        const newAdminUsername = messageParts[1].replace("@", "").trim();

        // Check if the username is valid
        if (!newAdminUsername.match(/^[a-zA-Z0-9_]+$/)) {
            return ctx.reply("⚠️ Invalid username format. Use only letters, numbers, or underscores.");
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username: newAdminUsername });
        if (existingAdmin) {
            return ctx.reply(`⚠️ @${newAdminUsername} is already an admin.`);
        }

        // Add new admin to database
        const newAdmin = new Admin({ username: newAdminUsername });
        await newAdmin.save();

        ctx.reply(`✅ @${newAdminUsername} has been added as an admin.`);
    } catch (error) {
        console.error("Error adding admin:", error);
        ctx.reply("⚠️ An error occurred while adding the admin.");
    }
});

  // Start bot with error handling
  bot.launch()
    .then(() => console.log("🚀 Admin Bot Started Successfully!"))
    .catch((err) => console.error("❌ Failed to start bot:", err));
}

// Export function
module.exports = startbot;


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
