require("dotenv").config();
require("./src/lib/db");

const fs = require("fs");
const express = require("express");
const path = require("path");
const routes = require("./src/controllers");

const app = express();
const port = process.env.PORT || 3000;
const frontendDist = path.join(__dirname, "..", "vite-project", "dist");
const hasFrontendBuild = fs.existsSync(frontendDist);

app.use(express.json());
app.use("/api/v1", routes);

if (hasFrontendBuild) {
  app.use(express.static(frontendDist));

  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api/")) {
      return res.sendFile(path.join(frontendDist, "index.html"));
    }

    next();
  });
}

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

if (require.main === module) {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Listening on port ${port}`);
  });
}

module.exports = app;
