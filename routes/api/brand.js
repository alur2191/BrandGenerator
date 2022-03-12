const express = require('express');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Persona = require('../../models/Persona');
const User = require('../../models/User');

// @route    GET api/brand/me
// @desc     Get current users all brand
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
        const brand = await Persona.findOne({
            user: req.user.id
        })

        if (!brand) {
            return res.status(400).json({ msg: 'There is no brand for this user' });
        }

        res.json(brand);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/brand
// @desc     Create or update user brand
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
            name,
            age,
            gender,
            relationship,
            job,
            location,
            salary,
            budget
        } = req.body;

        // build a brand
        const brandFields = {
            name,
            age,
            gender,
            relationship,
            job,
            location,
            salary,
            budget
        } = req.body

        try {
            // Using upsert option (creates new doc if no match is found):
            let brand = await Persona.findOneAndUpdate(
                { user: req.user.id, id: req.params.id },
                { $set: brandFields },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            return res.json(brand);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    }
);

// @route    DELETE api/brand
// @desc     Delete brand
// @access   Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // Remove brand
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