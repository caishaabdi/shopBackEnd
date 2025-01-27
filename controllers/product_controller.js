const Product = require("../models/product_model");
module.exports = {
    createProduct: async (req, res) => {
        const newProduct = new Product(req.body)
        try {
            await newProduct.save();
            res.status(200).json("Products Created")
        } catch (error) {
            res.status(500).json("Failed To Create Product")
        }
    },

    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find().sort({ createdAt: -1 })
            res.status(200).json(products)
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json("failed to get the products")
        }
    },
    getProduct: async (req, res) => {
        const productId = req.params.id;
        try {
            // Find the product by ID
            const product = await Product.findById(productId);

            // If product is not found, return 404 (Not Found)
            if (!product) {
                return res.status(404).json("Product not found");
            }

            // Destructure the product document to remove unwanted fields like __v and createdAt
            const { __v, createdAt, ...productData } = product.toObject(); // Use toObject() to avoid referencing Mongoose internal properties

            // Send back the filtered product data
            res.status(200).json(productData);
        } catch (error) {
            console.error('Error fetching product:', error); // Log error for debugging
            res.status(500).json("Failed to get the product");
        }
    },

    searchProducts: async (req, res) => {
        try {
            const results = await Product.aggregate(
                [
                    {
                        $search: {
                            index: "shoes",
                            text: {
                                query: req.params.key,
                                path: {
                                    wildcard: "*"
                                }
                            }
                        }
                    }
                ]
            );
            res.status(200).json(results);
        } catch (error) {
            console.error("Search Error:", error);  // Log the actual error for debugging
            res.status(500).json({ message: "Failed to search products", error: error.message });
        }
    }

}