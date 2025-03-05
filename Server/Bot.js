const { Telegraf, Markup } = require("telegraf");
const { v4: uuidv4 } = require("uuid");
const User = require("./Models/Customer");

const TOKEN = "7517198367:AAFmuA-P80SUOePtg5xq5b6AuMXdnWgFzr0";
const bot = new Telegraf(TOKEN);

// Your live React website URL (Replace this with your actual link)
const WEBSITE_URL = "https://l8n8n6b3-3000.uks1.devtunnels.ms/"; 
const WEBSITE_Checkoutpage_URL = "https://l8n8n6b3-3000.uks1.devtunnels.ms/checkout";

function startbot() {
  console.log("🚀 Bot is starting...");
    bot.start((ctx) => {
        const TGUsername = ctx.from.username;
        const TGfirstname = ctx.from.first_name;
        ctx.reply(`👋 Hello ${TGfirstname} (@${TGUsername}), we need your phone number to proceed.`,
            Markup.keyboard([[Markup.button.contactRequest("📱 Send My Phone Number")]]).resize()
        );
    });

    

    bot.on("contact", async (ctx) => {
        const TGUsername = ctx.from.username;
        const TGfirstname = ctx.from.first_name;
        const PhoneNo = ctx.message.contact.phone_number;
        const SessionId = uuidv4(); // Generate unique session ID

        const newUser = new User({
            Username: TGUsername,
            Phonenumber: PhoneNo,
            sessionId: SessionId
        });

        await newUser.save();

        ctx.reply(`✅ Welcome ${TGfirstname}, your phone number **${PhoneNo}** has been saved successfully!`);
        ctx.reply(
            "What would you like to do next?",
            Markup.keyboard([
                ["🛍️ View Product"], // This will now launch the website
                ["🛒 View Cart"]
            ]).resize()
        );
    });

    bot.hears("🛍️ View Product", async (ctx) => {
        const TGUsername = ctx.from.username;
        const user = await User.findOne({ Username: TGUsername });

        if (!user) {
            return ctx.reply("❌ You need to register first. Please restart the bot using /start.");
        }

        // Generate a unique session link for the user
        const sessionLink = `${WEBSITE_URL}?username=${user.Username}`;
    
        console.log("Generated URL for user:", sessionLink); // ✅ Debugging step

        ctx.reply(
            "🛍️ Click the button below to **Open Store in Telegram**:",
            Markup.inlineKeyboard([
                [Markup.button.webApp("🛒 Open Store", sessionLink)]
            ])
        );
    });

    
  //   bot.hears("🛒 View Cart", async (ctx) => {
  //     const TGUsername = ctx.from.username;
  //     const user = await User.findOne({ Username: TGUsername });

  //     if (!user) {
  //         return ctx.reply("❌ You need to register first. Please restart the bot using /start.");
  //     }

  //     // Generate a unique session link for the user
  //     const sessionLink = `${WEBSITE_Checkoutpage_URL}?session=${user.sessionId}`;

  //     ctx.reply(
  //         "🛍️ Click the button below to **View Cart in Telegram**:",
  //         Markup.inlineKeyboard([
  //             [Markup.button.webApp("🛒 View Cart", sessionLink)]
  //         ])
  //     );
  // });


    bot.launch();
}

module.exports = startbot;
