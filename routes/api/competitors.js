const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');

const Competitor = require('../../models/Competitor');

// @route    GET api/competitors/me
// @desc     Get current users all competitors
// @access   Private
router.get('/my', auth, async (req, res) => {
    try {
        const competitors = await Competitor.find({
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

// @route    GET api/competitors
// @desc     Get competitor by id
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        const competitor = await Competitor.findOne({
            _id: req.body.id
        })

        if (!competitor) {
            return res.status(400).json({ msg: 'There is no competitor with this id' });
        }

        // Check user
        if (competitor.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        res.json(competitor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// @route    POST api/competitors
// @desc     Create a competitor
// @access   Private
router.post(
    '/',
    auth,
    check('name', 'Name is required').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {

            const newCompetitor = new Competitor({
                user: req.user.id,
                name: req.body.name,
                look: req.body.look,
                valueProp: req.body.valueProp,
                tagline: req.body.tagline,
                coreProduct: req.body.coreProduct,
                personas: req.body.personas
            });
            const competitor = await newCompetitor.save();

            res.json(competitor);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


// @route    PUT api/competitors/:id
// @desc     Update a competitor
// @access   Private
router.put('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const competitor = await Competitor.findById(req.params.id);

        if (!competitor) {
            return res.status(404).json({ msg: 'Competitor not found' });
        }

        // Check user
        if (competitor.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const competitorFields = {
            name: req.body.name,
            look: req.body.look,
            valueProp: req.body.valueProp,
            tagline: req.body.tagline,
            coreProduct: req.body.coreProduct,
            personas: req.body.personas
        }

        try {
            let competitor = await Competitor.findOneAndUpdate(
                { _id: req.params.id },
                { competitorFields }
            );
            return res.json(competitor);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server Error');
    }
});


// @route    DELETE api/competitors/:id
// @desc     Delete a competitor
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const competitor = await Competitor.findById(req.params.id);

        if (!competitor) {
            return res.status(404).json({ msg: 'Competitor not found' });
        }

        // Check user
        if (competitor.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await competitor.remove();

        res.json({ msg: 'Competitor removed' });
    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server Error');
    }
});



module.exports = router