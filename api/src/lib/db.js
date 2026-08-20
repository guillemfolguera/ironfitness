const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.info("Suuuuuuu se ha conectado a la bbdd bien"))
    .catch((error) => {
        console.error("An error ocurred connecting to the database", error);
        process.exit(0);
    });
