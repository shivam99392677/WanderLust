const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/wrapAsync.js");
const validateError = require("../utils/schemaValidator.js");
// listings route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allData = await Listing.find({});
    res.render("listing/index.ejs", { allData });
  })
);

// new list
router.get("/new", (req, res) => {
  res.render("listing/new.ejs");
});

// show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id).populate("review");
    res.render("listing/show.ejs", { list });
  })
);

// create route
router.post(
  "/",
  validateError,
  wrapAsync(async (req, res, next) => {
    let newList = new Listing(req.body);

    await newList.save();
    res.redirect("/listings");
  })
);

//edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    res.render("listing/edit.ejs", { list });
  })
);

// update route
router.put(
  "/:id",
  validateError,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/listings/${id}`);
  })
);

// delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");
  })
);

module.exports = router;
