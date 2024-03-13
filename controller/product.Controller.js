const products = require("../schema/products.model");
const getDatauri = require("../utils/features");
const cloudinary = require('cloudinary');

//get all product
const getallProductController = async(req, res) => {
    try {
        const allProducts = await products.find({});
        res.status(200).send({
            success: true,
            message: "get all product succesfully",
            allProducts
        });
    } catch (error) {
        console.log(`error in get all products api ${error}`);
    }
}


//getsingle products api 
const getSingleProductController = async(req, res) => {
    try {
        const { id } = req.params;
        const getSingleProduct = await products.findById(id);
        res.status(200).send({
            success: true,
            message: "get single product succesfully",
            getSingleProduct
        });
    } catch (error) {
        console.log(`error in get single product api ${error}`);
        //Cast error//////////
        if (error.name === "CastError") {
            res.status(401).send({
                success: false,
                message: "invalide product id",
            });
        }
        res.status(500).send({
            success: false,
            message: "product not found",
        });
    }
}

///create products api

const createProductsController = async(req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        if (!name || !description || !price || !stock) {
            return res.status(500).send({
                success: false,
                message: "please provide all fields",

            });
        }
        if (!req.file) {
            return res.status(500).send({
                success: false,
                message: "please provide products image"
            })
        }
        const file = getDatauri(req.file);
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        const product = await products.create({
            name,
            description,
            price,
            stock,
            category,
            image: [image]
        })
        res.status(200).send({
            success: true,
            message: " product created succesfully",
            product
        });
    } catch (error) {
        console.log(`error in  products create api ${error}`);
        res.status(400).send({
            success: false,
            message: "product creation failed",
            error
        });
    }
}
const updateProductController = async(req, res) => {
        try {
            const { name, description, price, stock, category } = req.body;
            const { id } = req.params;
            const product = await products.findById(id);
            if (!product) return res.status(400).send({ success: false, message: "product not found" });

            //update with validation
            if (name) product.name = name;
            if (description) product.description = description;
            if (price) product.price = price;
            if (stock) product.stock = stock;
            if (category) product.category = category;

            await product.save();

            res.status(200).send({
                success: true,
                message: " product update succesfully",
                product
            });
        } catch (error) {
            //Cast error//////////
            if (error.name === "CastError") {
                res.status(401).send({
                    success: false,
                    message: "invalide product id",
                });
            }
            res.status(400).send({
                success: false,
                message: "product update failed",
                error
            });
        }
    }
    ///update product image Controller

const updateProductImageController = async(req, res) => {
    try {
        const { id } = req.params;
        const product = await products.findById(id);
        if (!product) return res.status(400).send({ success: false, message: "product not found" });
        if (!req.file) return res.status(400).send({ success: false, message: "file not found" });
        const file = getDatauri(req.file)
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        product.image.push(image);
        await product.save();

        res.status(200).send({
            success: true,
            message: " product image update succesfully",
            product
        });
    } catch (error) {
        //Cast error//////////
        if (error.name === "CastError") {
            res.status(401).send({
                success: false,
                message: "invalide product id",
            });
        }
        res.status(400).send({
            success: false,
            message: "product image update failed",
            error
        });
    }
}
const deleteProductImageController = async(req, res) => {
    try {
        const product = await products.findById(req.params.id);
        if (!product) return res.status(400).send({ success: false, message: "product not found" });


        // const cdb = await cloudinary.v2.uploader.destroy()

        //find image 
        const id = req.query.id;
        if (!id) return res.status(400).send({ success: false, message: "product image not found" });

        let exist = -1;
        product.image.forEach((item, index) => {
            if (item._id.toString() === id.toString()) exist = index
        })
        if (exist < 0) {
            return res.status(400).send({
                success: false,
                message: "image not found",
            });
        }
        //delete product image
        await cloudinary.v2.uploader.destroy(product.image[exist].public_id)
        product.image.splice(exist, 1);
        await product.save();

        return res.status(200).send({
            success: true,
            message: "product image delete succesfully",
            product
        });
    } catch (error) {
        //Cast error//////////
        if (error.name === "CastError") {
            res.status(401).send({
                success: false,
                message: "invalide product id",
            });
        }
        res.status(400).send({
            success: false,
            message: "product image delete failed",
            error
        });
    }
}
const deleteProductController = async(req, res) => {
    try {
        const product = await products.findById(req.params.id);
        if (!product) return res.status(400).send({ success: false, message: "product not found" });

        for (let index = 0; index < product.image.length; index++) {
            await cloudinary.v2.uploader.destroy(product.image[index].public_id)
                //delete product image
        }
        await product.deleteOne();
        return res.status(200).send({
            success: true,
            message: "product delete succesfully",

        });
    } catch (error) {
        //Cast error//////////
        if (error.name === "CastError") {
            res.status(401).send({
                success: false,
                message: "invalide product id",
            });
        }
        res.status(400).send({
            success: false,
            message: "product  delete failed",
            error
        });
    }
}
module.exports = {
    getallProductController,
    getSingleProductController,
    createProductsController,
    updateProductController,
    updateProductImageController,
    deleteProductImageController,
    deleteProductController,
}