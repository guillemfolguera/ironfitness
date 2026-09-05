const mongoose = require("mongoose");

if (!process.env.MONGODB_URI) {
  console.warn(
    "MONGODB_URI not set: database connection skipped. Set it to enable persistent storage.",
  );
} else {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.info("Suuuuuuu se ha conectado a la bbdd bien"))
    .catch((error) => {
      console.error(
        "An error ocurred connecting to the database",
        error.message,
      );
    });
}
