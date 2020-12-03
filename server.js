const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const User = require('./model/User');
const jwt = require("jsonwebtoken");
const verify = require('./middleware/verifyAcecess');
const verify2 = require('./middleware/verify2')
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

app.get('/login', verify2, function(req, res){
    res.sendFile(path.join(__dirname, "login.html"));
})

app.get('/register', verify2, function(req, res){
    res.sendFile(path.join(__dirname, "register.html"));
})

app.get('/logout', function(req, res){
    res.clearCookie("token");
    res.redirect('/');
})

app.get('/refresh', verify, async function(req, res){

    email = req.email;
    var usuario = await User.findOne({email:email});
    console.log(usuario);
    res.clearCookie("token");
    const token = jwt.sign({nombre:usuario.fname, apellido:usuario.lname, email:usuario.email, cumpleaños:usuario.bday, altura:usuario.height, peso:usuario.weight, act:usuario.last_date}, config.secret,{expiresIn: "1h"});
    console.log(token);
    res.cookie("token", token, {httpOnly: true});
    res.redirect('/user');
})

app.get('/api/userinfo', verify, function(req, res){
    var Usuario = {
        email: req.email,
        fname: req.fname,
        lname: req.lname,
        bday: req.bday,
        height: req.height,
        weight: req.weight,
        lact: req.lact
    };

    //console.log(Usuario);
    return res.json(Usuario);
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
            /*console.log("Contraseña valida");*/
            const token = jwt.sign({nombre:usuario.fname, apellido:usuario.lname, email:usuario.email, cumpleaños:usuario.bday, altura:usuario.height, peso:usuario.weight, act:usuario.last_date}, config.secret,{expiresIn: "1h"});
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

app.post('/api/actualizar', async function(req, res){
    var Act = req.body;

    await User.updateOne({email: Act.Email}, {weight: Act.Peso});
    const usuario = await User.findOne({email: Act.Email});
    res.redirect('/refresh');

})

app.listen(PORT, function(){
    console.log("Server Up on Port 3000")
})


