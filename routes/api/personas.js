const express = require('express');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Persona = require('../../models/Persona');
const User = require('../../models/User');

// @route    GET api/persona/me
// @desc     Get current users all personas
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
        const personas = await Persona.findMany({
            user: req.user.id
        })

        if (!personas) {
            return res.status(400).json({ msg: 'There are no personas for this user' });
        }

        res.json(personas);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/persona
// @desc     Create or update user persona
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

        // build a persona
        const personaFields = {
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
            let persona = await Persona.findOneAndUpdate(
                { user: req.user.id, id: req.params.id },
                { $set: personaFields },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            return res.json(persona);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    }
);

// @route    DELETE api/persona
// @desc     Delete persona
// @access   Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // Remove persona
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