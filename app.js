'use strict'
const fetch = require("node-fetch");

const express = require("express")
const app = express()

// use the express-static middleware
app.use(express.static("public"))

// define the first route
app.get("/", function (req, res) {
  res.send("<h1>app is running</h1>")
})

// start the server listening for requests
app.listen(process.env.PORT || 8081, 
	() => console.log("Server is running..."));


