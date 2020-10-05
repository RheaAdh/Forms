import * as mongoose from "mongoose";

const test = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
      type: String,
  }
});

export default mongoose.model("test", test);
