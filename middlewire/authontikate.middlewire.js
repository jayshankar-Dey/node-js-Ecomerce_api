const jwt = require('jsonwebtoken');
const Users = require('../schema/user.model');
const isauth = async(req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(400).send({
                success: false,
                message: "Unauthorised user please login first "
            });
        }
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await Users.findById(_id);
        next();
    } catch (error) {
        console.log(`error in auth middlewire ${error}`);
        res.status(400).send({
            success: false,
            message: "error in middlewiire "
        });
    }

}
module.exports = isauth;