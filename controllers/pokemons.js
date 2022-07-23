const { rows } = require("pg/lib/defaults.js");
const { pool } = require("../database/conection.js");
exports.getPokemons = async (req, res) => {
  const { rows } = await pool.query(
    "select * from pokemon  JOIN elementos ele ON pokemon.id = ele.pokemonid"
  );
  res.send(
    rows.map((pok) => ({
      id: pok.id,
      elementos: [pok.elemento1, pok.elemento2],
      nombre: pok.nombre,
      numero: pok.numero,
      color: pok.color,
      peso: pok.peso,
      altura: pok.altura,
      descripcion: pok.descripcion,
    }))
  );
};
exports.getPokemon = async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    `SELECT  * 
    FROM public.stats st 
    JOIN pokemon po 
    ON po.id = st.pokemonid 
    JOIN movimientos mo 
    ON po.id = mo.pokemonid
    JOIN elementos ele 
    ON po.id = ele.pokemonid
    WHERE po.id = $1`,
    [parseInt(id)]
  );
  const { rows: next } = await pool.query(
    `SELECT id 
    FROM pokemon
     WHERE id = $1`,
    [parseInt(id) + 1]
  );
  // exports.deletePokemon = async (req, res) => {
  //   const { id } = req.params;
  //   const { rows } = await pool.query(
  //     `DELETE FROM public.pokemon
  //     WHERE id=$1`,
  //     [parseInt(id)]
  //   );

  if (rows[0]) {
    res.status(200).json({
      id: rows[0].id,
      stats: {
        hp: rows[0].hp,
        atk: rows[0].atk,
        def: rows[0].def,
        satk: rows[0].satk,
        sdef: rows[0].sdef,
        spd: rows[0].spd,
      },
      elementos: [rows[0].elemento1, rows[0].elemento2],
      movimientos: {
        movimiento1: rows[0].movimiento1,
        movimiento2: rows[0].movimiento2,
      },
      nombre: rows[0].nombre,
      numero: rows[0].numero,
      color: rows[0].color,
      peso: rows[0].peso,
      altura: rows[0].altura,
      descripcion: rows[0].descripcion,
      next: next[0]?.id || null,
    });
  } else {
    res.sendStatus(404);
  }
};
exports.postPokemons = (req, res) => {
  const pokemon = req.body;
  const nuevaLista = Pokemones;
  nuevaLista.push(pokemon);
  return res.send(nuevaLista[nuevaLista.length - 1]);
};

exports.putPokemons = (req, res) => {
  const pokemon = req.body;
  const { id } = req.params;
  const idPokemon = Pokemones.findIndex((p) => p.numero === id);
  if (idPokemon === -1) {
    return res.status(200).json({ mensaje: "No se encontro pokemon" });
  }
  const pokemonAc = { ...Pokemones[idPokemon], ...pokemon };
  Pokemones[idPokemon] = pokemonAc;
  return res.send(Pokemones);
};
exports.deletePokemons = (req, res) => {
  const pokemon = req.body;
  const { id } = req.params;
  const pokemonABorrar = pokemon.findIndex((p) => p.numero === id);
  pokemon.splice(pokemonABorrar, 1)[pokemonABorrar] = pokemon;
  return res.send(pokemon[pokemonABorrar]);
};
function encontrarPorTypes(pokemonesFiltrados, type1) {
  pokemonesFiltrados = pokemonesFiltrados.filter((e) =>
    e.elemento.some((el) => el.toLowerCase() === type1.toLowerCase())
  );
  return pokemonesFiltrados;
}
