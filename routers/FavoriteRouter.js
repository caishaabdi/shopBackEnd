const { getAllFav, AddFavorite, deleteFavorite } = require("../controllers/favorite_controller");

const router = require("express").Router();
router.get('/getAllFav', getAllFav)
router.post('/addFav', AddFavorite)
router.delete('/:id', deleteFavorite)

module.exports = router;