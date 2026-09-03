const User = require("../lib/models/user.model");
const bcrypt = require("bcrypt");
const Session = require("../lib/models/session.model");
const { serialize } = require("cookie");
const cloudinary = require("../lib/cloudinary");

function profilePayload(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    objective: user.objective,
    initialWeight: user.initialWeight,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

function uploadBuffer(file, userId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "iron-fitness/avatars",
        public_id: userId.toString(),
        overwrite: true,
        resource_type: "image",
        transformation: [
          { width: 500, height: 500, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(file.buffer);
  });
}

module.exports.create = async (req, res, next) => {
  try {
    const { name, email, password, objective, initialWeight } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !objective ||
      initialWeight === undefined
    ) {
      return res.status(400).json({
        message:
          "Faltan campos obligatorios: name, email, password, objective e initialWeight",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ message: "El email no tiene un formato válido" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    if (!["lose-weight", "gain-muscle", "maintain"].includes(objective)) {
      return res.status(400).json({
        message:
          "Objective debe ser uno de: lose-weight, gain-muscle, maintain",
      });
    }

    if (typeof initialWeight !== "number" || initialWeight < 0) {
      return res.status(400).json({
        message: "initialWeight debe ser un número mayor o igual a 0",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      objective,
      initialWeight,
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      objective: newUser.objective,
      initialWeight: newUser.initialWeight,
      avatarUrl: newUser.avatarUrl,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Este email ya está registrado" });
    }

    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // mismo mensaje genérico para no revelar qué campo falla
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      // idéntico mensaje: no decimos "email correcto, contraseña incorrecta"
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // identidad confirmada: creamos la sesión con caducidad a 24h
    const session = await Session.create({
      user: user._id,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    });

    // entregamos la "tarjeta-llave" en una cookie
    const sessionCookie = serialize("sessionId", session._id.toString(), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 172800,
      path: "/",
    });

    res.setHeader("Set-Cookie", sessionCookie);

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    next(error);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) return res.status(204).end();

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("=")),
    );

    const { sessionId } = cookies;

    if (!sessionId) return res.status(204).end();

    // eliminamos la sesión de la BD
    await Session.findByIdAndDelete(sessionId);

    // limpiamos la cookie en el cliente
    res.setHeader(
      "Set-Cookie",
      `sessionId=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`,
    );

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports.profile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const u = req.user;

    res.json(profilePayload(u));
  } catch (error) {
    next(error);
  }
};

module.exports.update = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { name, objective } = req.body;

    if (name !== undefined && typeof name !== "string") {
      return res.status(400).json({ message: "Invalid name" });
    }

    if (
      objective !== undefined &&
      !["lose-weight", "gain-muscle", "maintain"].includes(objective)
    ) {
      return res
        .status(400)
        .json({
          message: "Objective debe ser lose-weight, gain-muscle o maintain",
        });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name !== undefined) user.name = name;
    if (objective !== undefined) user.objective = objective;

    await user.save();

    res.status(200).json(profilePayload(user));
  } catch (error) {
    next(error);
  }
};

module.exports.avatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Selecciona una imagen" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const uploaded = await uploadBuffer(req.file, user._id);

    user.avatarUrl = uploaded.secure_url;
    user.avatarPublicId = uploaded.public_id;

    await user.save();

    res.status(200).json(profilePayload(user));
  } catch (error) {
    next(error);
  }
};
