// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const logger = require("morgan");
const path = require("path");

// Set up Express and serve static content for the app from the Public directory
const app = express();
app.use(logger("dev"));
app.use(express.static(path.join(__dirname + "./public")));
const router = express.Router();

//Initialize Port
const PORT = process.env.PORT || 7890;

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handlebars Setup
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Mongoose Setup
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/news", { useNewUrlParser: true });
// const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/news";
// mongoose.connect(dbURI { useNewUrlParser: true });
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

// Import routes and give the server access to them
const routes = require("./controller/news_controller");

app.use("/", routes);

// Start our server so that it can begin listening to client requests.
db.on("open", function() {
    console.log("Mongoose connection successful.");
    app.listen(PORT, function() {
      // Log (server-side) when our server has started
      console.log("Server listening on: http://localhost:" + PORT);
    });
  });