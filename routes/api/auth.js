const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const brypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../../models/user/User');

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/', [check('email', 'Please include a valid email').isEmail(), check('password', 'Password is required').exists()], async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const isMatch = await brypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: 360000,
            },
            (err, token) => {
                if (err) throw err;

                res.json({
                    token,
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Sever error');
    }
});

module.exports = router;
