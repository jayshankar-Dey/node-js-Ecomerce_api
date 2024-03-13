const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email alrady exist"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: [6, "password length should be graterthen  6 cheracter"],
    },
    address: {
        type: String,
        required: [true, "address is required"],
    },
    city: {
        type: String,
        required: [true, "city is required"],
    },
    country: {
        type: String,
        required: [true, "country is required"],
    },
    phone: {
        type: String,
        required: [true, "phone is required"],
    },
    profilepic: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
}, { timestamps: true });

///hash password
userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    }
    const hashPassword = await bcrypt.hash(user.password, 10);
    user.password = hashPassword;
});
////compare password

userSchema.methods.comaprePassword = async function(planepassword) {
    return await bcrypt.compare(planepassword, this.password);
}

///jsonWebtoken/////
userSchema.methods.generateToken = async function() {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
}
const Users = mongoose.model("Users", userSchema);
module.exports = Users;