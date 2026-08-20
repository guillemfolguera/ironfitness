require("dotenv").config()
require("./src/lib/db");

const express = require('express');
const routes = require("./src/controllers");

const app = express()
const port = 3000

app.use(express.json());

app.use("/api/v1", routes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
