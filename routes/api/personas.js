const express = require('express');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');

const Persona = require('../../models/Persona');

// @route    GET api/personas/me
// @desc     Get current users all personas
// @access   Private
router.get('/my', auth, async (req, res) => {
    try {
        const personas = await Persona.find({
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

// @route    GET api/personas
// @desc     Get persona by id
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        const persona = await Persona.findOne({
            _id: req.body.id
        })

        if (!persona) {
            return res.status(400).json({ msg: 'There is no persona with this id' });
        }

        res.json(persona);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// @route    POST api/personas
// @desc     Create a persona
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

            const newPersona = new Persona({
                user: req.user.id,
                name: req.body.name,
                age: req.body.age,
                gender: req.body.gender,
                relationship: req.body.relationship,
                job: req.body.job,
                location: req.body.location,
                salary: req.body.salary,
                budget: req.body.budget
            });
            const persona = await newPersona.save();

            res.json(persona);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


// @route    PUT api/personas/:id
// @desc     Update a persona
// @access   Private
router.put('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const persona = await Persona.findById(req.params.id);

        if (!persona) {
            return res.status(404).json({ msg: 'Persona not found' });
        }

        // Check user
        if (persona.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const personaFields = {
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            relationship: req.body.relationship,
            job: req.body.job,
            location: req.body.location,
            salary: req.body.salary,
            budget: req.body.budget
        }

        try {
            // Using upsert option (creates new doc if no match is found):
            let persona = await Persona.findOneAndUpdate(
                { _id: req.params.id },
                { personaFields }
            );
            return res.json(persona);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Server Error');
        }
    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server Error');
    }
});


// @route    DELETE api/personas/:id
// @desc     Delete a persona
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const persona = await Persona.findById(req.params.id);

        if (!persona) {
            return res.status(404).json({ msg: 'Persona not found' });
        }

        // Check user
        if (persona.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await persona.remove();

        res.json({ msg: 'Persona removed' });
    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server Error');
    }
});



module.exports = router