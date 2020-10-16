const express= require('express');
const router= express.Router();
const bcrypt= require('bcryptjs');
const config= require('config');
const jwt= require('jsonwebtoken');


const User = require('../models/Users');

//Create Account
//POST
router.post('/register', (req, res)=>{
    const {name, email, password}= req.body;
    if (!name|| !email|| !password) return res.status(400).json({msg: 'Please Fill All Fields'})

    User.findOne({email})
    .then(user=>{ 
        if (user) return res.status(400).json({msg: 'Email Already In Use'})

        const newUser= User({
            name,
            email,
            password
        });

        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(newUser.password, salt, (err, hash)=>{
                if (err) throw err;
                newUser.password= hash;
                newUser.save()
                .then((user)=>{
                    jwt.sign(
                        {id: user._id},
                        config.get('jwtSecret'),
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
        })
    })

    
});

//Display all users
//GET
router.get('/', (req, res)=>{
    User.find()
    .then((user)=>{res.json(user)})
    .catch((err)=>{res.status(400).json({"error": err})});
});

//Display Profile
//GET
router.get('/:uid', (req, res)=>{
    User.findOne({_id:req.params.uid})
    .select('-password')
    .then((user)=>{res.json(user)})
    .catch((err)=>{res.status(400).json({"error": err})});
});

//Display Profile by email
//GET
router.get('/email/:mail', (req, res)=>{
    User.find({email:req.params.mail})
    .then((user)=>{if (user) res.json(user)})
    .catch((err)=>{res.status(400).json({"error": err})});
});

//Edit Profile
//PUT
router.put('/:id', (req, res)=>{
    User.findById(req.params.id)
    .then((user)=>{
        // user.username=req.body.username||user.username;
        user.email= req.body.email||user.email;
        // user.UID= req.body.UID||user.UID;
        user.name= req.body.name||user.name;
        // user.age= req.body.age||user.age;
        user.save()
        .then((user)=>{res.json(user)}).catch((err)=>{res.status(400).json(err.message)});
    })
    .catch((err)=>{res.status(400).json("No user with id")});
});

//Delete Account
//DELETE
router.delete('/:id', (req, res)=>{
    User.findById(req.params.id)
    .then((user)=>{
        user.remove()
        .then((user)=>{res.json('user removed')}).catch((err)=>{res.status(400).json(err.message)});
    })
    .catch((err)=>{res.status(400).json("No user with id")});

    
});



module.exports= router;