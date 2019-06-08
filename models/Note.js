// Dependencies
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Build Model
const commentSchema = new Schema({
    title: {
        type: String
    }, 
    body: {
        type: String
    }
});

let Note = mongoose.model("Note", commentSchema);

// Export Model
module.exports = Note;