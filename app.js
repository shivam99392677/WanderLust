const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);



main()
  .then(console.log("connection successful"))
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

// root route
app.get(
  "/",
  wrapAsync(async (req, res) => {
    const allData = await Listing.find({});
    res.render("listing/index.ejs", { allData });
  })
);

// for wrong route error
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listing/error.ejs", { message });
});

// index route
app.listen(3000, (req, res) => {
  console.log("listening to port 3000");
});

// // test route
// app.get("/test", async (req, res) => {
//   let sample = new Listing({
//     title: "My new villa",
//     description: "hi paisa hai na warna room nii milega",
//     price: 6000,
//     loacation: "Siwan",
//     country: "India",
//   });

//   await sample
//     .save()
//     .then((res) => console.log(res))
//     .catch((err) => {
//       console.log(err);
//     });

//   res.send("working test model");
// });
