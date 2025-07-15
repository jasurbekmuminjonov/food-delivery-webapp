const mongoose = require("mongoose");
exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB ishlamoqda");
  } catch (e) {
    console.error(`MongoDB xatosi: ${e.message}`);
    process.exit(1);
  }
};
