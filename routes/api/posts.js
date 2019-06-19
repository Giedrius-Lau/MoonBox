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


router.get('/', auth, wrap(async(req, res) => {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
}));


router.get('/:id', auth, wrap(async(req, res) => {
    const posts = await Post.findById(req.params.id);

    if (!posts) res.status(404).json({ msg: 'Post not found' });
    res.json(posts);
}));


router.delete('/:id', auth, wrap(async(req, res) => {
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorised' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
}));


router.put('/like/:id', auth, wrap(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
        return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    
    await post.save();

    res.json(post.likes);
}));

router.put('/unlike/:id', auth, wrap(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
        return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
}));

router.post('/comment/:id', [auth,
    [
        check('text', 'Text is required').not().isEmpty(),
    ]
],

    wrap(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newCommet = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newCommet);

        await post.save();

        res.json(post.comments);
}));

router.delete('/comment/:id/:comment_id', auth, wrap(async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    if (!comment) return res.status(404).json({ msg: 'Comment does not exist' });

    if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
    }

    const removeIndex = post.comments.map(comment => comment.user.id.toString().indexOf(req.user.id));

    post.comments.splice(removeIndex, 1);
    
    await post.save();
    res.json(post.comments);
}));

module.exports = router;