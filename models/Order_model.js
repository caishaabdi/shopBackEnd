const mongoose = require("mongoose");


const OrderSchema = new mongoose.Schema({

    UserId: { type: String, required: true },
    customerId: { type: String, required: true, },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    delivery_status: { type: String, required: true, default: "pending" },
    payment_status: { type: String, required: true },
    total: { type: Number, required: true },

}, {
    timestamps: true
});
const order = mongoose.model("Order", OrderSchema);
module.exports = order;