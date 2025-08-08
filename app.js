const express = require("express");
const mongoose = require("mongoose");

const app = express();

main()
  .then(console.log("connection successful"))
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

// index route 
app.listen(3000,(req,res)=>{
    console.log("listening to port 3000");
})

// root route 
app.get("/",(req,res)=>{
    res.send("Hi I am working");
})
