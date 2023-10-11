const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogCommentSchema = new Schema({

    blogid: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    mess: {
        type: String,
        require: true,
    }

}, { timestamps: true });

const blogcomments = mongoose.model('blogcomments', BlogCommentSchema);
blogcomments.createIndexes({ "closeOfferAt": 1 }, { expireAfterSeconds: 0 });

module.exports = blogcomments;