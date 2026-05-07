const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hashed
    });

    await user.save();

    res.send("User Registered");

  } catch (err) {
    res.status(500).send(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {

    const user = await User.findOne({
      email: req.body.email
    });

    if (!user) {
      return res.status(400).send("User not found");
    }

    const valid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!valid) {
      return res.status(400).send("Wrong Password");
    }

    const token = jwt.sign(
      { id: user._id },
      "secretkey"
    );

    res.json({ token });

  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;