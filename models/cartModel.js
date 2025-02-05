const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    userId: { type: String, required: true },  // Fixed 'requried' to 'required'
    products: [
        {
            cartItem: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
            quantity: { type: Number, default: 1 }
        }
    ]
}, {
    timestamps: true
});

const Product = mongoose.model("Cart", CartSchema);
module.exports = Product;  // CommonJS export syntax