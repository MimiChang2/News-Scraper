var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = newSchema({
    title: String,
    body: String
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
