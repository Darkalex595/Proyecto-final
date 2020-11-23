const {Schema, model} = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = Schema({
    fname: String,
    lname: String,
    email: String,
    password: String,
    bday: Date,
    height: Number,
    weight: Number,
    last_date: {
        type: Date, 
        default: Date.now
    } ,
})

userSchema.methods.encryptPassword =  async function(password){
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password,salt);
}

userSchema.methods.validatePassword =  async function(password) {
    return bcrypt.compare(password,this.password);
}

module.exports = model('User', userSchema);