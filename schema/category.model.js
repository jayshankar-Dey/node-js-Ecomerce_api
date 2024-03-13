const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, "name is required"]
    }
}, { timestamps: true })

const categorys = mongoose.model("Category", categorySchema);
module.exports = categorys;