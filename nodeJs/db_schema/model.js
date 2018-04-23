const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("users", UserSchema);

module.exports = User;