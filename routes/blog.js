const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const BlogSchema = require('../models/Blog');
const BlogComments = require('../models/BlogComments');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const fetchuser = require('../middleware/authentication');
const multer = require('multer');
const { default: mongoose } = require('mongoose');
const fs = require('fs')

// Route 1 -> For post new blog || Admin Login Require
router.post('/create', fetchuser, jsonParser, [

    body("postTitle", "Post title not found").isLength({ min: 3 }),
    body("description", "Post description not found").isLength({ min: 10 })

], async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(req.form);
            return res.status(400).json({ errors: errors.array() });
        }

        const { postTitle, description } = req.body
        await BlogSchema.create({

            postTitle: postTitle,
            description: description

        }).then(async (data) => {

            return res.status(201).json(data._id)

        }).catch((err) => {
            return res.json(err)
        })

    } catch (error) {
        res.json(error.message)
    }
})

//  Route 2 -> Get all blog data
router.get('/getall', async (req, res) => {
    try {

        await BlogSchema.find().then(async (data) => {
            res.status(200).json(data)
        })

    } catch (error) {
        return res.json(error.message)
    }
})

// Route 3 -> Delete all blog data || Admin Login Require
router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {

        await BlogSchema.findById({ _id: req.params.id }).then(async (data) => {
            let path = `uploads/${data.postImage}`
            fs.unlinkSync(path);
        }).then(async () => {
            await BlogSchema.findByIdAndDelete(req.params.id)
        }).catch((err) => {
            return res.json(err.message)
        }).then(() => {
            return res.json("Post deleted")
        })

    } catch (error) {
        return res.json(error.message)
    }
})

// Route 4 -> Post Comment for a blog
router.post('/comment', jsonParser, [

    body("mess", "Comment not found").exists(),
    body("postid", "Post id not found").exists()

], async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        await BlogComments.create({
            mess: req.body.mess,
            blogid: req.body.postid
        })

        return res.status(200).json("Comments success")

    } catch (error) {
        return res.json(error.message)
    }
})

// Route 5 -> get all comment for particular blog id
router.get('/comment/:blogid', async (req, res) => {
    try {

        await BlogComments.find({ blogid: req.params.blogid }).then((data) => {
            return res.status(200).json(data)
        })

    } catch (error) {
        return res.json(error.message)
    }
})

// Route 6 -> Delete comment of a blog || Admin Login Require
router.delete('/comment/', fetchuser, jsonParser, [

    body("blogid", "Post id not found").exists(),
    body("commentid", "Comment id not found").exists()

], async (req, res) => {
    try {

        await BlogComments.findOneAndDelete({ _id: req.body.commentid, blogid: req.body.blogid })
        return res.status(200).json("Comment delete success")

    } catch (error) {
        return res.json(error.message)
    }
})

// Route 7 -> Like a Blog
router.put('/like/:blogid', async (req, res) => {
    try {

        await BlogSchema.findByIdAndUpdate(req.params.blogid, { $inc: { totalLikes: 1 } }).then(() => {
            return res.status(200).json("Post Liked")
        })

    } catch (error) {
        return res.json(error.message)
    }
})

// Route 8 -> Dislike a Blog
router.put('/dislike/:blogid', async (req, res) => {
    try {

        await BlogSchema.findByIdAndUpdate(req.params.blogid, { $inc: { totalLikes: -1 } }).then(() => {
            return res.status(200).json("Post Disliked")
        })

    } catch (error) {
        return res.json(error.message)
    }
})

// Route 9 -> Upload blog image route
router.post('/upload/image/:fileName', async (req, res) => {

    const limit = 1024 * 200;
    var fileExtention = ""

    multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads/');
            },
            filename: (req, file, cb) => {
                fileExtention = file.originalname.split('.')[1]
                cb(null, `thc-blog-image-${req.params.fileName}.${fileExtention}`);
            },
        }),
        limits: { fileSize: limit },
    }).single('image')(req, res, async (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ error: `File size exceeds the limit (${Math.floor(limit / 1000)} KB)` });
            }
            return res.status(500).json({ error: 'Something went wrong' });
        }

        let id = new mongoose.Types.ObjectId(req.params.fileName);
        await BlogSchema.findByIdAndUpdate(
            { _id: id },
            {
                $set: { postImage: `thc-blog-image-${req.params.fileName}.${fileExtention}` }
            }).then(() => {
                return res.status(200).json("File Uploaded")
            })
    });
});

// Route 10 -> get uploaded image
router.get('/get/uploadimg/:fileName', (req, res) => {
    let path = __dirname.split("routes")[0]
    res.sendFile(`${path}/uploads/${req.params.fileName}`);
})

module.exports = router