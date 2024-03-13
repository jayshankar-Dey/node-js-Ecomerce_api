const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    description: {
        type: String,
        required: [true, "description is required"]
    },
    price: {
        type: Number,
        required: [true, "price is required"]
    },
    stock: {
        type: Number,
        required: [true, "product stock is required"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    image: [{
        public_id: String,
        url: String
    }]
}, { timestamps: true })

const products = mongoose.model("products", productSchema);
module.exports = products