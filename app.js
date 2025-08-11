const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const app = express();

const methodOverride = require("method-override");

app.use(methodOverride("_method"));

const path = require("path");

app.use(express.urlencoded({extended:true}));


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

// index route
app.listen(3000, (req, res) => {
  console.log("listening to port 3000");
});

// root route
app.get("/", (req, res) => {
  res.send("Hi I am working");
});

// listings route
app.get("/listings", async (req, res) => {
  const allData = await Listing.find({});
  res.render("./listing/index.ejs", { allData });
});

// new list
app.get("/listings/new", (req, res) => {
  res.render("./listing/new.ejs");
});

// show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  res.render("./listing/show.ejs", { list });
});

// new post route to add new listing
app.post("/listings/new", (req, res) => {
  let newList = new Listing(req.body);
  newList.save();
  res.redirect("/listings");
});

//edit route 
app.get("/listings/:id/edit",async (req,res)=>{
  let {id }= req.params;
  let list =await Listing.findById(id);
  res.render("./listing/edit.ejs",{list});
})

// update route 
app.put("/listings/:id",async (req,res)=>{
  let {id} =req.params;
  await Listing.findByIdAndUpdate(id,{...req.body});
  res.redirect(`/listings/${id}`);
})

// delete route 
app.delete("/listings/:id",async (req,res)=>{
  let {id} =req.params;
  let deletedList = await Listing.findByIdAndDelete(id);
  console.log(deletedList);
  res.redirect("/listings");
})

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
