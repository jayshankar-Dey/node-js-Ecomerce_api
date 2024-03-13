const express = require('express');
const color = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const cloudinary = require('cloudinary');
const cookie_parser = require('cookie-parser');
const dbConnection = require('./db/db');
const Useroute = require('./routes/user.Router');
const Productrouter = require('./routes/product.Route');
const Categoryrouter = require('./routes/category.Route');
require('dotenv').config();
const app = express();
//middlewire
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookie_parser());

dbConnection();
//route//
//cloudinary config

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
//user api
app.use("/api/v1/user", Useroute)
    //product api
app.use("/api/v1/product", Productrouter);
//category route
app.use('/api/v1/category', Categoryrouter)

app.get("/", (req, res) => {
    res.status(200).send("<h1 style='color:green'>Wellcome to the Rest api </h1><br><h3 style='color:red'>CRUD api in Node js and mysql database </h3><br><h3 style='color:pink'>This is for testing..........</h3>")
})
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`server is starting on http://localhost:${port}`.bgMagenta);
})