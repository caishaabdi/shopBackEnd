const FavoriteItem = require("../models/favoriteModel");




module.exports = {
    getAllFav: async (req, res) => {
        try {
            const favorites = await FavoriteItem.find({});
            res.status(200).json({ message: "success", favorites })
        } catch (e) {
            res.status(500).json({ message: "Failed to retrive  favorites", e });
        }
    },

    AddFavorite: async (req, res) => {
        try {
            // Destructure the necessary fields from the request body
            const { id, name, category, price, imageUrl } = req.body;

            // Ensure that all required fields are provided
            if (!id || !name || !category || !price || !imageUrl) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // Create a new instance of the FavoriteItem model
            const newFavorite = new FavoriteItem({
                id,
                name,
                category,
                price,
                imageUrl
            });

            // Save the new favorite item to the database
            await newFavorite.save();

            // Respond with a success message and the newly added favorite item
            res.status(201).json({ message: "Favorite item added successfully", newFavorite });
        } catch (err) {
            // Log the error for debugging
            console.error("Error adding favorite:", err);

            // Respond with a 500 status code and the error message
            res.status(500).json({ message: "Failed to add favorite item", error: err.message });
        }
    },



    deleteFavorite: async (req, res) => {
        const { id } = req.params; // Getting the 'id' from the URL parameters

        try {
            // Attempt to find and delete the favorite item
            const deletedFavorite = await FavoriteItem.findOneAndDelete({ id });

            // If no item was found with the provided id
            if (!deletedFavorite) {
                return res.status(404).json({ message: "Favorite item not found" });
            }

            // If deletion was successful, send a success message with the deleted item
            res.status(200).json({
                message: "Favorite item deleted successfully",
                deletedFavorite
            });
        } catch (error) {
            // Catch any errors and return a 500 status code with the error message
            console.error(error);  // Log the error for debugging purposes
            res.status(500).json({
                message: "Failed to delete the favorite item",
                error: error.message // Provide error message for debugging
            });
        }
    }

}

