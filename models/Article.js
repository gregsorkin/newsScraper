// Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },

    summary: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    },

    imageURL: {
        type: String,
        required: true
    },
    
    summary: {
        type: String
    },

    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
    
let Article = mongoose.model("Article", ArticleSchema);

// Export Model
module.exports = Article;