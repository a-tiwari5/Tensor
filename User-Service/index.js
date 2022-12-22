const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./model/User");
const axios = require("axios");

dotenv.config({ path: "./config/config.env" });
connectDB();
app.use(express.json());
app.use(cors());

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(404).json({ err });
  }
});

app.post("/users/add", async (req, res, next) => {
  //   const users = await User.insertMany([...req.body]);
  try {
    const users = await User.insertMany([...req.body]);
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(400).json({ err });
  }
});

app.post("/users/edit/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    const data = await axios.post("http://localhost:3003/users/edit", req.body);

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
});

app.listen(3002, () => {
  console.log("User Service running on port 3002");
});
