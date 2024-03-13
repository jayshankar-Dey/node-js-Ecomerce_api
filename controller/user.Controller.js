const Users = require("../schema/user.model");
const bcrypt = require('bcryptjs');
const getDatauri = require("../utils/features");
const cloudinary = require('cloudinary');

// register api/////////////
const UserRegisterController = async(req, res) => {
    try {
        const { name, email, password, address, city, country, phone } = req.body;
        if (!name || !email || !password || !address || !city || !country || !phone) {
            res.status(500).send({
                success: false,
                message: "please fill all fields"
            });
        }
        if (password.length < 6) res.status(500).send({ message: "password length min 6 charactere" });
        const find = await Users.findOne({ email: email });
        if (find) res.status(500).send({ message: "email alrady exist" });

        const user = await Users.create({ name, email, password, address, city, country, phone });
        res.status(200).send({
            success: true,
            message: "user register succesfully",
            user

        })
    } catch (error) {
        console.log(`error in register api ${error}`.bgred);
        res.status(500).send({
            success: false,
            message: "error in register api"
        })
    }
}

//user login ///////////

const UserLoginController = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) res.status(500).send({ message: "Please enter email" });
        if (!password) res.status(500).send({ message: "Please enter password" });


        const user = await Users.findOne({ email: email });
        if (!user) res.status(500).send({ success: false, message: "user not exiest please register first" });
        ///check password
        const isMetch = await user.comaprePassword(password);
        if (!isMetch) res.status(500).send({ success: false, message: "user not exiest please register first" });
        //toke
        const token = await user.generateToken();
        res.status(200).cookie("token", token, {
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            secure: true,
            httpOnly: true

        }).send({
            success: true,
            message: "user login succesfully",
            token
        })
    } catch (error) {
        console.log(`error in login api ${error}`.bgred);
        res.status(500).send({
            success: false,
            message: "error in login api"
        })
    }
}

const getprofileController = async(req, res) => {
    try {
        const user = await Users.findById(req.user._id);
        user.password = undefined;
        res.status(200).send({
            success: true,
            message: "profile update succesfully",
            user
        })
    } catch (error) {
        console.log(`error in profile api ${error}`.bgred);
    }
}

const logoutController = async(req, res) => {

    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        secure: true,
        httpOnly: true
    }).send({
        success: true,
        message: "logout succesfully"
    })
}

const Update_profile_Controller = async(req, res) => {
    try {
        const { name, email, address, city, country, phone } = req.body;
        const user = await Users.findById(req.user._id);
        if (name) user.name = name;
        if (email) user.email = email;
        if (address) user.address = address;
        if (city) user.city = city;
        if (country) user.country = country;
        if (phone) user.phone = phone;
        await user.save();
        res.status(200).send({
            success: true,
            message: " user profile update succesfully",
            user
        })
    } catch (error) {
        console.log(`error in proile ${error}}`)
    }
}
const update_Password_Controller = async(req, res) => {
    try {
        const { oldpassword, newpassword } = req.body;
        if (!oldpassword) res.status(400).send({ message: "oldPassword is required" })
        if (!newpassword) res.status(400).send({ message: "newpassword is required" })

        const user = await Users.findById(req.user._id)
        const ismatch = await user.comaprePassword(oldpassword);
        if (!ismatch) {
            res.status(200).send({
                success: false,
                message: "invalide old password",
            })
        }
        user.password = newpassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "user password update succesfully"
        })
    } catch (error) {
        console.log(`error in update password ${error}}`)
    }
}
const updateProfilePic_Controller = async(req, res) => {
        try {
            const user = await Users.findById({ _id: req.user._id })
            const file = getDatauri(req.file);
            //delete preveous image
            await cloudinary.v2.uploader.destroy(user.profilepic.public_id)
                //uplode new image
            const cdb = await cloudinary.v2.uploader.upload(file.content);
            user.profilepic = {
                public_id: cdb.public_id,
                url: cdb.secure_url
            }
            await user.save();
            res.status(200).json({
                success: true,
                message: "user profile update succesfully",
                user
            })
        } catch (error) {
            console.log(`error in update picture ${error}}`)
        }
    }
    ////exports//////////////
module.exports = {
    UserRegisterController,
    UserLoginController,
    getprofileController,
    logoutController,
    Update_profile_Controller,
    update_Password_Controller,
    updateProfilePic_Controller,
}