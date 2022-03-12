const express = require('express');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Competitor = require('../../models/Competitor');
const User = require('../../models/User');

// @route    GET api/competitor/me
// @desc     Get current users competitor
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
        const competitors = await Competitor.findMany({
            user: req.user.id
        })

        if (!competitors) {
            return res.status(400).json({ msg: 'There are no competitors for this user' });
        }

        res.json(competitors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/competitor
// @desc     Create or update user competitor
// @access   Private
router.post(
    '/:id',
    auth,
    check('name', 'Status is required').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // destructure the request
        const {
            user,
            name,
            look,
            valueProp,
            tagline,
            coreProduct,
            personas,
            communication,
        } = req.body;

        // build a competitor
        const competitorFields = {
            user,
            name,
            look,
            valueProp,
            tagline,
            coreProduct,
            personas,
            communication,
        } = req.body

        try {
            // Using upsert option (creates new doc if no match is found):
            let competitor = await Competitor.findOneAndUpdate(
                { user: req.user.id, id: req.params.id },
                { $set: competitorFields },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            return res.json(competitor);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    }
);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // Remove competitor
        await Promise(
            User.findOneAndRemove({ id: req.params.id })
        );

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router