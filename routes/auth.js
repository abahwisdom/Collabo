const express= require('express');
const router= express.Router();
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');
const auth= require('../middleware/auth');
const { database } = require('../config')


const User = require('../models/Users');

//Sign in
//POST
router.post('/login', (req, res)=>{
    const {email, password}= req.body;
    if (!email|| !password) return res.status(400).json({msg: 'Fill all fields'})

    User.findOne({email})
    .then(user=>{ 
        if (!user) return res.status(400).json({msg: 'User Does Not Exist'})

        bcrypt.compare(password, user.password)
        .then(isMatch=>{
            if (!isMatch) return res.status(400).json({msg: 'Invalid Credentials'})
            jwt.sign(
                {id: user._id},
                database.JWT_SECRET,
                {expiresIn: 86400},
                (err, token)=>{
                    if (err) throw err;
                    res.json({
                        token,
                        user:{
                            id: user._id,
                            name: user.name,
                            email:user.email
                        }
                    })
                }
            )
        })
    })

    
});

//Get User details
//Get
router.get('/user', auth, (req, res)=>{
    User.findById(req.user.id)
    .select('-password')
    .then(user=> res.json(user))
} )

module.exports= router;