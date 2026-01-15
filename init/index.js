const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
main()
  .then(console.log("connection successful"))
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

const initDb = async () => {
  await Listing.deleteMany({});

  const listingsWithReviews = initData.data.map((obj) => ({
    ...obj,
    reviews: [], // ✅ force schema consistency
  }));

  await Listing.insertMany(listingsWithReviews);

  console.log("data was initialized");
};

initDb();
