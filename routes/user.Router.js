const express = require('express');
const { UserRegisterController, UserLoginController, getprofileController, logoutController, Update_profile_Controller, update_Password_Controller, updateProfilePic_Controller } = require('../controller/user.Controller');
const isauth = require('../middlewire/authontikate.middlewire');
const singleUplode = require('../middlewire/multer');
const route = express.Router();
//routing////
route.post('/register', UserRegisterController)
route.post('/login', UserLoginController)
route.post('/profile', isauth, getprofileController)
route.get('/logout', isauth, logoutController)

//update profile
route.put('/profile-update', isauth, Update_profile_Controller)
route.put('/update-user-password', isauth, update_Password_Controller)
    // route.get('/update-picture', isauth, updateProfilePic_Controller)
route.put('/update-picture', isauth, singleUplode, updateProfilePic_Controller)

module.exports = route;