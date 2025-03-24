// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// App Initialization
const app = express();
const MONGODB_COMPASS =
  "mongodb+srv://hrtsainirman:<hrtsainirman>@apartment-management.hvndh.mongodb.net/?retryWrites=true&w=majority&appName=apartment-management";
// "mongodb+srv://hrtsainirman:<hrtsainirman>@apartment-management.hvndh.mongodb.net/";
const MONGO_URL = "mongodb://localhost:27017/auth-demo";

const corsOptions = {
  origin: "*", // Allow only this domain
  methods: "GET,POST,PUT,DELETE", // Allow only specific HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allow specific headers
};

app.use(express.json());
app.use(cors(corsOptions));
// MongoDB Connection
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// User Schema & Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Register Endpoint
app.post("/v1/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: error.message });
  }
});

// Login Endpoint
app.post("/v1/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    // Validate Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid username or password" });

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
