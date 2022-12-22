const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    id: {
      type: Number,
      required: [true, "Please add an id"],
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
    },
    gender: {
      type: String,
    },
    status: {
      type: String,
      required: [true, "Please add a status"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
