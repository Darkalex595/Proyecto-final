const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const User = require('./model/User');
const jwt = require("jsonwebtoken");
const verify = require('./middleware/verifyAcecess');
const config = require("./config");

const app = express();


mongoose.connect('mongodb://localhost/e-snutri-users',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex: true
})
    .then(db => console.log('db connected'))
    .catch(err => console.log(err));

var PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/',  function (req, res){
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get('/user', verify, function (req, res){
    res.sendFile(path.join(__dirname, "infouser.html"));
})

app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname, "login.html"));
})

app.get('/register', function(req, res){
    res.sendFile(path.join(__dirname, "register.html"));
})

app.get('/logout', function(req, res){
    res.clearCookie("token");
    res.redirect('/');
})

app.post('/register', async function(req, res){
    user = new User(req.body);
    user.password = await user.encryptPassword(user.password);
    await user.save();
    res.redirect("/user");
    
})

app.post('/login', async function(req, res){
    var {email, password} = req.body

    const usuario = await User.findOne({email:email});

    console.log(usuario);

    if(!usuario){
        return res.status(404).send("No existe el usuario");
    }
    else{
        const valid = await usuario.validatePassword(password);

        if(valid){
            console.log("Contraseña valida");
            const token = jwt.sign({nombre:usuario.fname, apellido:usuario.lname, cumpleaños:usuario.bday, altura:usuario.height, peso:usuario.weight, act:usuario.last_date}, config.secret,{expiresIn: "1h"});
            console.log(token);
            res.cookie("token", token, {httpOnly: true});
            res.redirect('/user');
        }
        else{
            console.log("Contraseña invalida");
            res.json('Invalido');
        }
    }
})

app.listen(PORT, function(){
    console.log("Server Up on Port 3000")
})


