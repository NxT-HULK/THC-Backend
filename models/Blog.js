const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogSchema = new Schema({

    postTitle: {
        type: String,
        require: true
    },
    profileImage: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png",
    },
    uploadedBy: {
        type: String,
        default: 'Arywar Aashriwad'
    },
    designation: {
        type: String,
        default: 'Entrepreneur',
    },
    postImage: {
        type: String,
        default: ""
    },
    totalLikes: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        require: true,        
    }
    
}, { timestamps: true });

const blog = mongoose.model('blogs', BlogSchema);
blog.createIndexes();

module.exports = blog;