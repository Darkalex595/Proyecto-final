const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(req, res, next){

    const token = req.cookies.token;

    if(!token){
        res.redirect('/login');
    }
    else{
        jwt.verify(token, config.secret, function(err, decoded){
            if (err){
                console.log(err);
                return res.redirect('/login');
            }
            else{

                req.fname = decoded.nombre;
                req.lname = decoded.apellido;
                req.bday = decoded.cumpleaños;
                req.height = decoded.altura;
                req.weight = decoded.peso;
                req.lact = decoded.act;
                next();
            }
        })
    } 
}

module.exports = verifyToken;