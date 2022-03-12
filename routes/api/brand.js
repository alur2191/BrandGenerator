const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');

const Brand = require('../../models/Brand');

// @route    GET api/brands
// @desc     Get brand by id
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        const brand = await Brand.findOne({
            _id: req.body.id
        })

        if (!brand) {
            return res.status(400).json({ msg: 'There is no brand with this id' });
        }

        // Check user
        if (brand.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        res.json(brand);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// @route    POST api/brands
// @desc     Create a brand
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

            const newBrand = new Brand({
                user: req.user.id,
                purpose: req.body.purpose,
                vision: req.body.vision,
                mission: req.body.mission,
                values: req.body.values
            });
            const brand = await newBrand.save();

            res.json(brand);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


// @route    PUT api/brand/:id
// @desc     Update a brand
// @access   Private
router.put('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({ msg: 'Brand not found' });
        }

        // Check user
        if (brand.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const brandFields = {
            purpose: req.body.purpose,
            vision: req.body.vision,
            mission: req.body.mission,
            values: req.body.values
        }

        try {
            let brand = await Brand.findOneAndUpdate(
                { _id: req.params.id },
                { brandFields }
            );
            return res.json(brand);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server Error');
    }
});


// @route    DELETE api/brand/:id
// @desc     Delete a brand
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({ msg: 'Brand not found' });
        }

        // Check user
        if (brand.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await brand.remove();

        res.json({ msg: 'Brand removed' });
    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server Error');
    }
});



module.exports = router