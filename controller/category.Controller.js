const categorys = require("../schema/category.model");
const products = require('../schema/products.model')
const CreateCategoryController = async(req, res) => {
    try {
        const { category } = req.body;
        if (!category) {
            return res.status(500).send({ success: false, message: "enter category name" })
        }
        const createCategory = await categorys.create({ category });
        res.status(200).send({
            success: true,
            message: "category create Succesfully",
            createCategory
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "category creation faield",
            error
        });

    }
}

///get category
const getCategoryController = async(req, res) => {
    try {
        const Categorys = await categorys.find({});
        res.status(200).send({
            success: true,
            message: "category create Succesfully",
            Categorys
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "category fetch failed",
            error
        });
    }
}
const deleteCategoryController = async(req, res) => {
    try {
        const { id } = req.params;
        await categorys.findByIdAndDelete(id);
        const product = await products.find({ category: id });
        for (let i = 0; i < product.length; i++) {
            const productss = product[i];
            productss.category = undefined;
            await productss.save();
        }
        res.status(200).send({
            success: true,
            message: "category deleted Succesfully",
        });
    } catch (error) {
        console.log(error)
            //Cast error//////////
        if (error.name === "CastError") {
            res.status(401).send({
                success: false,
                message: "invalide category id",
            });
        }
        res.status(500).send({
            success: false,
            message: "category delete failed",
            error
        });
    }
}

const UpdateCategoryController = async(req, res) => {
    try {
        const { categori } = req.body;
        const { id } = req.params;
        const category = await categorys.findById(id)
        if (!category) return res.status(404).send({ message: "category not found" })

        // const product = await products.find({ category: id });
        // for (let i = 0; i < product.length; i++) {
        //     const productss = product[i];
        //     productss.category = categori;
        //     await productss.save();
        // }

        if (categori) category.category = categori;
        await category.save();
        res.status(200).send({
            success: true,
            message: "category update Succesfully",
        });
    } catch (error) {
        console.log(error)
            //Cast error//////////
        if (error.name === "CastError") {
            res.status(401).send({
                success: false,
                message: "invalide category id",
            });
        }
        res.status(500).send({
            success: false,
            message: "category update failed",
            error
        });
    }
}

module.exports = {
    CreateCategoryController,
    getCategoryController,
    deleteCategoryController,
    UpdateCategoryController
}