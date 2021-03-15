const express = require("express");
const knex = require("knex");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const knexfile = require("../knexfile.js");
const mutler = require("multer");
const path = require("path");
const database = require("knex")(knexfile.development);
const authenticate = require("./auth.middleware");

const router = express.Router();

const storage = mutler.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = mutler({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// create user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const [existingUser] = await database
    .select("name")
    .from("users")
    .where({ name: username });
  if (existingUser) {
    res.status(400).json({ err: "User already esists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 5);

  try {
    await database("users").insert({
      name: username,
      password: hashedPassword,
    });
    res.status(201).send();
  } catch {
    res.status(500);
  }
});

// login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const [existingUser] = await database
    .select("name", "password")
    .from("users")
    .where({ name: username });

  if (
    !existingUser ||
    bcrypt.compare(password, existingUser.password) === false
  ) {
    res.status(400).json({ err: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({ username }, "secret");
  res.status(200).json({ token });
});

// upload image
router.patch(
  "/profile",
  authenticate,
  upload.single("image"),
  async (req, res) => {
    const { path } = req.file;
    try {
      await database("users")
        .where("name", req.user.username)
        .update({ image: path });
      res.status(200).send();
    } catch {
      res.status(500).send();
    }
  }
);

//get profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const profile = await database
      .select("name", "image")
      .from("users")
      .where({ name: req.user.username });
    res.status(200).json(profile[0]);
  } catch {
    res.status(404).send();
  }
});

router.use("/upload", express.static(path.join(__dirname, "../upload")));

module.exports = router;
