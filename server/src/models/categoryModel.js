const mongoose = require(`mongoose`);

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A category must have a name!"],
  },
  gender: {
    type: String,
  },
  des: {
    type: String
  }
});

module.exports = mongoose.model("Category", categorySchema);
