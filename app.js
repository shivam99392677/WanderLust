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

const app = express();

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

// listings route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allData = await Listing.find({});
    res.render("listing/index.ejs", { allData });
  })
);

// new list
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});

// show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    res.render("listing/show.ejs", { list });
  })
);

// create route
app.post(
  "/listings",
  validateError,
  wrapAsync(async (req, res, next) => {
    let newList = new Listing(req.body);

    await newList.save();
    res.redirect("/listings");
  })
);

//edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    res.render("listing/edit.ejs", { list });
  })
);

// update route
app.put(
  "/listings/:id",
  validateError,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/listings/${id}`);
  })
);

// delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");
  })
);

// reviews route
app.post("/listings/:id/reviews", reviewValidator, async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);

  let newReview = new Review(req.body.review);

  listing.review.push(newReview);

  let result =await newReview.save();
  await listing.save();

  console.log(result);
  res.redirect(`/listings/${listing._id}`);
});

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
