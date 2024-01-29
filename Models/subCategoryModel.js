const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  },
  name: {
    type: String,
  },
  image: {
    type: String
},
})

module.exports = mongoose.model("Subcategory", SubcategorySchema);