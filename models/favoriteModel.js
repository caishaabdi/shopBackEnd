const mongoose = require('mongoose');


const FavoriteSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,

    },
    category: {
        type: String,
        required: true

    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});
const FavoriteItem = mongoose.model('favoriteItem', FavoriteSchema);

module.exports = FavoriteItem;
