// Dependencies
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Build Model
const commentSchema = new Schema({
    body: String
});

let Comment = mongoose.model("Comment", commentSchema);

// Export Model
module.exports = Comment;