// Dependencies
const express = require("express");
const path = require("path");
const cheerio = require("cheerio");
const axios = require("axios");
const router = express.Router();

// Import the models
const Note = require("../models/Note.js");
const Artcle = require("../models/Article.js");

// Index Route
router.get("/", (req, res) => res.redirect("/scrape"));

// Article Route
router.get("/articles", (req, res) => {
    Article.find().sort({ _id: -1 }).populate("notes").exec(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            let hbsObject = { articles: doc }
            res.resnder("index", hbsObject);
        }
    });
});

// Scrape Route
router.get("/scrape", (req, res) => {
    axios.get("http://www.theonion.com").then(response => {
        const $ = cheerio.load(response.data);
        let titleArray = [];

        $("article .inner").each((i, element) => {
            let result = {};
            // Capture the headline, title, summary and image, converting to string to ensure no empty scrapes occur
            result.title = $(element).children("headline").children("h2").text().trim() + "";
            result.link = "http://www.theonion.com" + $(element).children("headline").children("h2").children("a").attr("href").trim();
            result.summary = $(element).children("div").text().trim() + "";
            result.image = $(element).children("image").children(".imagegrab").children("a").children("img").attr("src");

            // Checking for empty results
            if (result.title !== "" && result.summary !== "") {
                if (titleArray.indexOf(result.title) == -1) {
                    // Checking for duplicate articles
                    titleArray.push(result.title);
                    Article.count({ title: result.title }, function(err, test) {
                        if (test == 0) {
                            let entry = new Article (result);
                            entry.save(function(err, doc) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(doc);
                                }
                            });
                        }
                        else{
                          console.log("Duplicate article not saved to the database.");
                        }
                    });
                    }
                    else{
                        console.log("Article was missing information and not saved to the database.")
                    }
            }
            else{
                console.log("Empty article was not saved to the database.")
            }
        
            // Send it and the user back to the articles page to close out the call
            res.redirect("/articles");
        });
    });
});

// Comment post Route
router.post("/add/note/:id", (req, res) => {
    // Capture data into variables
    let articleId = req.params.id;
    let noteAuthor = req.body.name;
    let noteContent = req.body.comment;

    // Drop the above into an object
    let result = {
        author: noteAuthor,
        content: noteContent
    }
    
    // Create a new comment via the model
    let entry = new Note(result);

    entry.save(function(err, doc) {
        if (err) {
            throw err;
        } else {
            // Push the new comment to the list by the article
            Article.findOneAndUpdate({ "_id": articleId }, {$push: { "notes": doc._id }}, {new: true})
            // Execute the above query
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

// Delete Comment Route
router.post("/remove/note/:id", (req, res) => {
    let noteId = req.params.id;

    Note.findByIdAndRemove(commentId, function(err, todo) {
        if (err) {
            console.log(err);
        } else {
            res.sendStatus(200);
        }
    });
});

// Export Router
module.exports = router;