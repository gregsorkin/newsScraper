// Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        default: "Summary not available."
    },
    img : {
        type: String
    }
});

ArticleSchema.index({title: "text"});

const Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article