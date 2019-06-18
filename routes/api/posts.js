const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator/check');
const wrap = require('express-async-wrap');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

router.post('/', [auth,
    [
        check('text', 'Text is required').not().isEmpty(),
    ]
], wrap(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();

        res.json(post);
    }));

module.exports = router;