const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const User = require('./model/User');
const jwt = require("jsonwebtoken");

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

app.get('/',  function (req, res){
    res.sendFile(path.join(__dirname, "index.html"));
})

app.get('/user', function (req, res){
    res.sendFile(path.join(__dirname, "infouser.html"));
})

app.get('/login', function(req, res){
    res.sendFile(path.join(__dirname, "login.html"));
})

app.get('/register', function(req, res){
    res.sendFile(path.join(__dirname, "register.html"));
})

app.post('/register', async function(req, res){
    user = new User(req.body);
    user.password = await user.encryptPassword(user.password);
    await user.save();
    res.redirect("/user");
    
})

app.listen(PORT, function(){
    console.log("Server Up on Port 3000")
})


