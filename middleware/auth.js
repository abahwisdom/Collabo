
const jwt= require('jsonwebtoken');
require('dotenv').config()
const { database } = require('../config');

function auth(req, res, next){
    const token= req.header('collabo-auth-token');

    if (!token) return res.status(401).json({msg: 'No token, auth denied'});

    try {
        const decoded= jwt.verify(token, database.JWT_SECRET);

        req.user=decoded;
        next()
        
    } catch (error) {
        res.status(400).json({msg: 'Token invalid, auth denied'});
    }
}

module.exports=auth;