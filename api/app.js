require("dotenv").config()
require("./src/lib/db");

const express = require('express');
const routes = require("./src/controllers");

const app = express()
const port = 3000

app.use(express.json());

app.use("/api/v1", routes);

app.use((error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "La imagen no puede superar 2 MB" });
  }

  if (error.message === "El archivo debe ser una imagen") {
    return res.status(400).json({ message: error.message });
  }

  console.error(error);
  res.status(500).json({ message: "Ha ocurrido un error" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
