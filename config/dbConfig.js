const mongoose = require("mongoose");
const Console = require("Console");

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
console.log(db);

db.once("connected", () => {
  Console.success(`🐸 -> Connected to MongoDB on ${db.host}: ${db.port} <- 🐸`);
});
