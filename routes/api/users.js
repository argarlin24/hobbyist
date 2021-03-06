const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const keys = require('../../config/keys'); 
const passport = require('passport');

//input validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

//Load User Model
const User = require('../../models/User');

//GET api/users/test
//Tests post route
//Public
router.get('/test', (req, res) => res.json({ msg: "Users Works" }));

//POST api/users/register
//Register User
//Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    //Check Validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }) 
        .populate("profile")
        .then(user => {
            if (user) {
                errors.email = 'That email is taken';
                return res.status(400).json(errors);
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })
            }
        });
});

//Post api/users/login
//Login User & return JWT Token
//Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    //Check Validation
    if(!isValid) {
        return res.status(400).json(errors);
    }
    

    const email = req.body.email;
    const password = req.body.password;

    //Find user by email 
    User.findOne({email})
    .populate("profile")
        .then(user => {
            //check for user 
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors)
            }
            //check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        //user matched
                        const payload = { id: user.id, name: user.name } //create JTW payload

                        //sign token
                        jwt.sign(
                            payload, 
                            keys.secretOrKey, 
                            { expiresIn: 3600 }, 
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token,
                                    user: user
                    
                                })
                            });
                    } else {
                        errors.password = 'Incorrect Password'
                        return res.status(400).json(errors);
                    }
                })
        })
});

//Post api/users/current
//Return Current User 
//Private 
router.get('/current', 
passport.authenticate('jwt', { session: false }), 
(req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    }); 
})

module.exports = router; 