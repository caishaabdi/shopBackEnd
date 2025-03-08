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
    // Delete Product by ID
    deleteProduct: async (req, res) => {
        const { id } = req.params; // Assuming you pass the product ID in the URL params
        try {
            const product = await Product.findByIdAndDelete(id);

            if (!product) {
                return res.status(404).json("Product Not Found");
            }

            res.status(200).json("Product Deleted");
        } catch (error) {
            res.status(500).json("Failed To Delete Product");
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

    // searchProducts: async (req, res) => {
    //     try {
    //         const results = await Product.aggregate(
    //             [
    //                 {
    //                     $search: {
    //                         index: "shoes",
    //                         text: {
    //                             query: req.params.key,
    //                             path: {
    //                                 wildcard: "*"
    //                             }
    //                         }
    //                     }
    //                 }
    //             ]
    //         );
    //         res.status(200).json(results);
    //     } catch (error) {
    //         console.error("Search Error:", error);  // Log the actual error for debugging
    //         res.status(500).json({ message: "Failed to search products", error: error.message });
    //     }
    // }


    searchProducts: async (req, res) => {
        try {
            // Retrieve the search term from the URL path
            const searchTerm = req.params.key;
            console.log("Searching for:", searchTerm);

            // Ensure search term is provided
            if (!searchTerm) {
                return res.status(400).json({ message: "Search term is required" });
            }

            // Pagination params
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            // Perform the search query
            const results = await Product.aggregate([

                {
                    $search: {
                        index: "shoes",  // Ensure the "shoes" index is created in MongoDB Atlas
                        text: {
                            query: searchTerm,  // Use the search term from the URL path
                            path: { wildcard: "*" },  // Search across all fields
                        }
                    }
                },
                { $skip: skip },  // Pagination: Skip previous results
                { $limit: limit }  // Pagination: Limit the number of results
            ]);

            console.log("Search results:", results);  // Log the results

            if (results.length === 0) {

                return res.status(404).json({ message: "No products found" });
            }

            console.log("Search results:", results);  // Log the results
            res.status(200).json(results);  // Send results back to the client

        } catch (error) {
            console.error("Search Error:", error);
            res.status(500).json({ message: "Failed to search products", error: error.message });
        }
    }




}