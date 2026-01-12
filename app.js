const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const validateError = require("./utils/schemaValidator.js");
const reviewValidator = require("./utils/reviewValidator.js");
const listings = require("./routes/listing.js");
const app = express();

app.use("/listings", listings);

app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

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

// REVIEWS
// reviews create route
app.post(
  "/listings/:id/reviews",
  reviewValidator,
  wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);

    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

//review delete route
app.delete(
  "/listing/:id/reviews/:reviewId",
  wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });

    res.redirect(`/listings/${id}`);
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
