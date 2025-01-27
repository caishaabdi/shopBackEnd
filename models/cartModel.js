const mongoose = require("mongoose");


const CartSchema = new mongoose.Schema({

    UserId: { type: String, requried: true, },
    products: [
        {
            cartItem: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
            quantity: { type: Number, default: 1 }
        }
    ]


}, {
    timestamps: true
});

module.express = mongoose.model("Cart", CartSchema);