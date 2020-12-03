const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken2(req, res, next){

    const token = req.cookies.token;

    if(!token){
        next();
    }
    else{
        return res.redirect('/user');
    } 
}

module.exports = verifyToken2;