const express = require("express");
const router = express.Router();
const {
  deletePokemons,
  getPokemon,
  getPokemons,
  postPokemons,
  putPokemons,
} = require("../controllers/pokemons");
const { verifyToken } = require("../middlewares/validate-jwt");
router.get("/Pokemons", getPokemons);
router.post("/Pokemons", verifyToken, postPokemons);
router.get("/Pokemons/:id", getPokemon);
router.put("/Pokemons/:id", verifyToken, putPokemons);
router.delete("/Pokemons/:id", verifyToken, deletePokemons);

module.exports = router;
