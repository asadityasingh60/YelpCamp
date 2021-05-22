var mongoose = require("mongoose");

//Schema Setup
var commentSchema=new mongoose.Schema({
    text: String, 
    author: {
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

var Comment = mongoose.model("Comment",commentSchema); // Validating Schema
module.exports = Comment;