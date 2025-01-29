const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({

    name: { type: String, required: true },
    title: { type: String, required: true, },
    category: { type: String, required: true },
    imageUrl: { type: [String], required: true, },
    oldPrice: { type: Number, required: true, },
    sizes: {
        type: [
            {
                size: { type: String, required: true },
                isSelected: { type: Boolean, default: false, }
            }
        ]
    },
    price: { type: Number, required: true, },
    description: { type: String, required: true, },

}, {
    timestamps: true
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;  // CommonJS export syntax