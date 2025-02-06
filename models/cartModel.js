const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    userId: { type: String, required: true },  // Fixed 'requried' to 'required'
    products: [
        {
            cartItem: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default: 1 }
        }
    ]
}, {
    timestamps: true
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;  // CommonJS export syntax