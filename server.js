const express = require('express');
const path = require('path');
const morgan = require('morgan');

const app = express();

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

app.listen(PORT, function(){
    console.log("Server Up on Port 3000")
})


