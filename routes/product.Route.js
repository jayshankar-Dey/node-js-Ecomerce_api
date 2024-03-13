const express = require('express');
const isauth = require('../middlewire/authontikate.middlewire')
const {
    getallProductController,
    getSingleProductController,
    createProductsController,
    updateProductController,
    updateProductImageController,
    deleteProductImageController,
    deleteProductController
} = require('../controller/product.Controller');
const singleUplode = require('../middlewire/multer');

const router = express.Router();

//routes
router.get('/getallProducts', getallProductController);

router.get('/getSingleProduct/:id', getSingleProductController);

router.post('/create', isauth, singleUplode, createProductsController)

//update product
router.put('/update/:id', isauth, updateProductController)

router.put('/update-image/:id', isauth, singleUplode, updateProductImageController)

router.delete('/delete-image/:id', isauth, deleteProductImageController)

router.delete('/delete-product/:id', isauth, deleteProductController)
    //exports
module.exports = router;