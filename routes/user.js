const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authToken = require("./userAuth");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    // Check if email already exists
    const existingEmail = await User.find({ email });
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    // ✅ Generate token
    const token = jwt.sign({ id: user._id, role:user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true if using HTTPS
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // ✅ Send response ONLY ONCE
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
  
});


router.get("/get-user-information", authToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // hide password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error getting user info:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/update-address", authToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    user.address = address;
    await user.save();

    res.status(200).json({
      message: "Address updated successfully",
      user
    });
  } catch (err) {
    console.error("Error updating address:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token"); // Make sure the cookie name matches what you used when setting it
  res.status(200).json({ message: "Logged out successfully" });
});


router.get('/profile', authToken, (req, res) => {
  res.status(200).json({ user: req.user }); // user was set in your middleware
});



module.exports = router;
