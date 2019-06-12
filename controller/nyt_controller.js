// Dependencies
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const router = express.Router();

// Import the models
const Note = require("../models/Note.js");
const Article = require("../models/Article.js");

// Index Route
router.get("/", (req, res) => {
    Article.find({}, null, {sort: {created: -1}}, function(err, data) {
        if (data.length === 0) {
            res.render("filler", {message: "No articles yet; Click 'Scrape New Articles' to load them."})
        } else {
            res.render("index", {articles: data});
        }
    });
});

// Scrape Route
router.get("/scrape", (req, res) => {
    axios.get("http://www.nytimes.com").then(function(response) {
        const $ = cheerio.load(response.data);
        const result = {};
        console.log("scrape route active")
        
        $("div.css-1b72evd").each(function(i, element) {
            const link = $(element).find("a").attr("href");
            const title = $(element).find("h2").first().text().trim();
            const summary = $(element).find("li").text().trim();
            // const image = $(element).parent().find("figure.media").find("img").attr("src");
            result.link = link;
            result.title = title;
            if (summary) {
                result.summary = summary;
            };
            // if (image) {
            //     result.image = image;
            // } else {
            //     result.image = $(element).find(".wide-thumb").find("img").attr("src");
            // };
            
            if (result.title && result.summary) {
                console.log(result);
                const entry = new Article(result);
                Article.find({title: result.title}, (err, data) => {
                    if (data.length === 0) {
                        entry.save(function(err, data) {
                            if (err) throw err;
                        });
                    }
                });
                console.log("Successful article scrape.")
                console.log(result);
            } else {
                console.log("Skipping invalid result.")
                console.log(result);
            }
        });
        res.redirect("/");
    });
});

// Saved Articles Route
router.get("/saved", (req, res) => {
    Article.find({isSaved: true}, null, {sort: {created: -1}}, (err, data) => {
        if (data.length === 0) {
            res.render("filler", {message: "You have no saved articles :( Save some by clicking the 'Save Article' button."});
        } else {
            res.render("saved", {saved: data});
        }
    });
});

// Article by ID Route
router.get("/:id", (req, res) => {
    Article.findById(req.params.id, (err, data) => {
        res.json(data);
    });
});

// Save an Article Route
router.post("/save/:id", (req, res) => {
    Article.findById(req.params.id, (err, data) => {
        if (data.isSaved) {
            Article.findByIdAndUpdate(req.params.id, {$set: {isSaved: false, status: "Save Article"}}, {new: true}, (err, data) => {
                res.redirect("/");
            });
        } else (
            Article.findByIdAndUpdate(req.params.id, {$set: {isSaved: true, status: "Article Saved"}}, {new: true}, (err, data) => {
                res.redirect("/saved");
            })
        );
    });
});

// Comment Post Route
router.post("/note/:id", (req, res) => {
    const note = new Note(req.body);
    note.save(function(err, doc) {
        if (err) throw err;
        Article.findByIdAndUpdate(req.params.id, {$set: {"note": doc._id}}, {new: true}, (err, newDoc) => {
            if (err) throw err;
            else {
                res.send(newDoc);
            }
        });
    });
});

// Find comment by ID Route
router.get("/note/:id", (req, res) => {
    Article.findById(req.params.id).populate("note").exec((err, data) => {
        res.send(data.note);
    });
});

module.exports = router;