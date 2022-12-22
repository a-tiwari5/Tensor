const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cron = require("node-cron");
const axios = require("axios");
const User = require("./model/User");

dotenv.config({ path: "./config/config.env" });
connectDB();
app.use(express.json());
app.use(cors());

cron.schedule("* * * */20 * *", async () => {
  try {
    const res = await axios.get("https://gorest.co.in/public/v2/users", {
      headers: {
        "Accept-Encoding": "gzip,deflate,compress",
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Bearer b158cb922a8544bd5643a791b06e134cae1accf2e1dfb0c165742c0d184d7bdf",
      },
    });

    let existingUsers = [];

    for (let user of res.data) {
      const exists = await User.find({ id: user.id });
      console.log(exists.length);
      if (exists.length == 0) {
        existingUsers.push(user);
        await User.create(user);
      }
    }
    const callUsersAPI = await axios.post(
      "http://localhost:3002/users/add",
      existingUsers
    );
    const callExportAPI = await axios.post(
      "http://localhost:3003/users/add",
      existingUsers
    );
    console.log("api called");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(3001, () => {
  console.log("Fetch Service running on port 3001");
});
