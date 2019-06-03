// Dependencies
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const logger = require("morgan");
// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");
// Initialize Port and Express
const express = require("express");
const app = express();
const PORT = process.env.PORT || 7890;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "../public"));
app.use(logger("dev"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.Promise = Promise;

const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/news";

mongoose.connect(dbURI, { useNewUrlParser: true});
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

// Import routes and give the server access to them.
const routes = require("./controller/controller.js");

app.use("/", routes);

// Start our server so that it can begin listening to client requests.
db.on("open", function() {
  console.log("Mongoose connection successful.");
  app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });
});