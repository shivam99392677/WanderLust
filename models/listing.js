const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    type: String,
    default:
      "https://pixabay.com/photos/ka%C3%A7kar-mountains-wilderness-summit-9655200/",
    set: (v) => (v === "" ? "default link" : v),
  },
  price:Number,
  location:String,
  country:String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
