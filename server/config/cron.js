const cron = require("node-cron");
const TelegramBot = require("node-telegram-bot-api");
const User = require("../models/user.model.js");
const Order = require("../models/order.model.js");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

cron.schedule("35 10 * * *", async () => {
  try {
    const users = await User.find({});

    for (let user of users) {
      const lastOrder = await Order.findOne({ user_id: user._id })
        .sort({ created_date: -1 })
        .exec();

      if (!lastOrder) continue;

      const today = new Date();
      const diffDays = Math.floor(
        (today - new Date(lastOrder.created_date)) / (1000 * 60 * 60 * 24)
      );

      if (diffDays > 0 && diffDays % 5 === 0) {
        await bot.sendMessage(
          user.telegram_id,
          `Assalomu alaykum!😊 Siz anchadan beri buyurtma bermadingiz. Sizni sog'indik🙃. Bizning mahsulotlarimizni ko'rib chiqishni xohlaysizmi?`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Albatta🚀",
                    web_app: {
                      url: `https://bimwebapp.richman.uz?start=${user.telegram_id}`,
                    },
                  },
                ],
              ],
            },
          }
        );
      }
    }

    console.log("Cron job tugadi: eslatmalar yuborildi");
  } catch (err) {
    console.error("Cron jobda xato:", err);
  }
});
