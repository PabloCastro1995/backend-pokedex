const express = require("express");
const router = express.Router();
const {
  deletePokemon,
  getPokemon,
  getPokemons,
  postPokemons,
} = require("../controllers/pokemons");
const { verifyToken } = require("../middlewares/validate-jwt");
router.get("/pokemons", getPokemons);
router.post("/pokemons", verifyToken, postPokemons);
router.get("/pokemons/:id", getPokemon);
router.delete("/pokemons/:id", verifyToken, deletePokemon);

module.exports = router;
