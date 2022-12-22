const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./model/User");
const { json } = require("express");
const data_exporter = require("json2csv").Parser;

dotenv.config({ path: "./config/config.env" });
connectDB();
app.use(express.json());
app.use(cors());

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, data: users });
});

app.post("/users/add", async (req, res, next) => {
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

app.post("/users/edit", async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOneAndUpdate({ id: req.body.id }, req.body);
    console.log(user);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(404), json({ success: false, err });
  }
});

app.get("/users/export", async (req, res) => {
  try {
    const users = await User.find();
    const data = JSON.parse(JSON.stringify(users));
    var fileHeader = ["id", "Name", "Email", "Gender", "Status"];
    var json_data = new data_exporter({ fileHeader });
    var csv_data = json_data.parse(data);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Desposition", "attachment; filename=user_data.csv");
    res.status(200).end(csv_data);
  } catch (err) {}
});

app.listen(3003, () => {
  console.log("User Service running on port 3003");
});
