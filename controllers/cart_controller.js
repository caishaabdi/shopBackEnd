const Product = require('../models/product_model');
const Cart = require('../models/cartModel');

module.exports = {
    addCart: async (req, res) => {
        const userId = req.user.id;
        const { cartItem, quantity } = req.body;

        try {
            // Find if cart exists for the user
            const cart = await Cart.findOne({ userId });

            if (cart) {
                // Look for the product in the cart by comparing its ID
                const existingProduct = cart.products.find(
                    (product) => product.cartItem.toString() === cartItem
                );

                if (existingProduct) {
                    // If the product exists, update the quantity
                    existingProduct.quantity += quantity;  // Use dynamic quantity
                } else {
                    // If the product doesn't exist, push a new product with quantity
                    cart.products.push({ cartItem, quantity });
                }

                // Save the updated cart
                await cart.save();
                res.status(200).json("Product added to the cart");
            } else {
                // If no cart exists for the user, create a new one
                const newCart = new Cart({
                    userId,
                    products: [{ cartItem, quantity }]
                });

                await newCart.save();
                res.status(200).json("Product added to the cart");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getCart: async (req, res) => {
        const userId = req.user.id;
        try {
            // Find the user's cart
            const cart = await Cart.findOne({ userId })
                .populate('products.cartItem', "_id name imageUrl price category")

            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    deleteCartItem: async (req, res) => {
        const cartItemId = req.params.cartItem;

        try {
            // Find the cart and remove the product by its ID
            const updatedCart = await Cart.findOneAndUpdate(
                { 'products._id': cartItemId },
                { $pull: { products: { _id: cartItemId } } },
                { new: true }
            );

            if (!updatedCart) {
                return res.status(404).json({ message: 'Cart item not found' });
            }

            res.status(200).json(updatedCart);
        } catch (error) {
            res.status(500).json(error);
        }
    }
};
