// Dependencies
const express = require("express");
const router = express.Router();
const path = require("path");

// Cheerio + Axios Require
//const request = require("request");
const cheerio = require("cheerio");
const axios = require("axios");

// Models
const article = require("../models/articles");

// Home/Default Route
router.get("/", (req, res) => res.render("articles"));

// GET request to scrape Medium.com
router.get("/api/scrape", (req, res) => {
    // Get the request started...
    axios.get("http://www.medium.com/topic/technology").then(response => {
        // Shorthand the Cheerio pull
        const $ = cheerio.load(response.data);

        // Create an empty object to store results
        let handlebarsObject = {
            data: []
        }

        // Pull all the articles
        $("article").each((i, element) => {
            // Plug into an empty results object
            let imageLink = $(element).children(".item-image").children(".imagewrap").children("a").children("img").attr("src");

            if (imageLink) {
                let imageLength = imageLink.length;
                let hiResImage = imageLink.substr(0, imageLength - 11) + "800-c100.jpg"

                handlebarsObject.data.push({
                    headline: $(element).children(".item-info").children(".title").children("a").text(),
                    summary: $(element).children(".item-info").children(".summary").children("a").text(),
                    url: $(element).children(".item-info").children(".title").children("a").attr("href"),
                    imageURL: hiResImage,
                    comments: null
                });
            }
        });
    });
});

// Saved Articles Route
router.get("/api/saved", (req, res) => {
    db.Articles.find({}).then(function(dbArticle) {
        res.json(dbArticle)
    }).catch(function(err) {
        res.json(err);
    });
});

// Post Route
router.post("/api/post", (req, res) => {
    let articleObject = req.body;
    // Save the article to the db + look for an existing article based on URL
    db.Articles.findOne({ url: articleObject.url }).then(function(response) {
        // Creates an article if it doesn't already exist
        if (response === null) {
            db.Articles.create(articleObject).then((response) => console.log(" ")).catch(err => res.json(err));
        }
        // Alert the user if their article was successfully saved
        res.send("Article saved!");
    }).catch(function(err) {
        res.json(err);
    });
});

// Delete Article Route
router.post("/api/delete", (req, res) => {
    let article = req.body;
    // Look for the article by ID and remove it
    db.Articles.findByIdAndRemove(article["_id"]).then(response => {
        if (response) {
            res.send("Successfully deleted.")
        }
    });
});

// Delete Comment Route
router.post("/api/deleteComment", (req, res) => {
    let comment = req.body;
    // Look for the article by ID and remove it
    db.Articles.findByIdAndRemove(comment["_id"]).then(response => {
        if (response) {
            res.send("Successfully deleted.")
        }
    });
});

// Create Comment Route
router.post("/api/createComment", (req, res) => {
    article = req.body;
    db.Comments.create(article.body).then(function(dbComment) {
        return db.Articles.findOneAndUpdate({
            _id: article.articleID.articleID
        }, {
            $push: {
                comment: dbComment._id
            }
        }).then(function(dbArticle) {
            res.json(dbArticle);
        }).catch(function(err) {
            res.json(err);
        });
    })
});

// Grab a specific article by ID and populate with the associated comment route
router.post("/api/populateComment", function(req, res) {
    db.Articles.findOne({ _id: req.body.articleID }).populate("Comment").then((response) => {
        if (response.comment.length == 1) {
            db.Comments.findOne({ "_id": response.comment}).then((comment) => {
                comment = [comment];
                res.json(comment);
            });
        } else {
            db.Comments.find({
                "_id": {
                    "$in": response.comment
                }
            }).then((comments) => {
                res.json(comments);
            });
        }
    }).catch(function(err) {
        res.json(err);
    });
});

module.exports = router;