const express = require('express');
const { CreateCategoryController, getCategoryController, deleteCategoryController, UpdateCategoryController } = require('../controller/category.Controller');
const isauth = require('../middlewire/authontikate.middlewire')
const router = express.Router();

router.post('/addCategory', CreateCategoryController);
router.get('/getallCategory', getCategoryController)
router.delete('/:id', isauth, deleteCategoryController)
router.put('/:id', isauth, UpdateCategoryController)
module.exports = router;