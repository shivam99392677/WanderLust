const express = require("express");
const router = express.Router({ mergeParams: true });
const methodOverride = require("method-override");

const wrapAsync = require("../utils/wrapAsync.js");
const reviewValidator = require("../utils/reviewValidator.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

express().use(methodOverride("_method"));

// REVIEWS
// reviews create route
router.post(
  "/",
  reviewValidator,
  wrapAsync(async (req, res, next) => {

    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      console.log("LISTING IS UNDEFINED", req.params);
      return res.send("Listing not found");
    }

    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview._id);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

//review delete route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
