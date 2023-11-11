const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    // required: true
    // user_id is not applied to the model find reasons
  },
  name: {
    type: String,
    required: [true, "Please enter product Name"],
    trime: true,
  },
  description: {
    type: String,
    required: [true, "Please eter product Description"],
  },
  price: {
    type: Number,
    required: [true, "Please eter product Price"],
    maxLegth: [8, "Price cannot exceed 8 Figure"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter product Category"],
  },
  Stock: {
    type: Number,
    required: [true, "please enter product Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
