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
      imagen: pok.imagen,
      color: pok.color,
      peso: pok.peso,
      altura: pok.altura,
      descripcion: pok.descripcion,
    }))
  );
};
exports.deletePokemon = async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    `UPDATE public.pokemon
    SET  eliminado=true
    WHERE id=$1`,
    [parseInt(id)]
  );
  res.sendStatus(200);
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
    WHERE po.id = $1 `,
    [parseInt(id)]
  );
  const { rows: next } = await pool.query(
    `SELECT id 
    FROM pokemon
     WHERE id = $1`,
    [parseInt(id) + 1]
  );
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
      imagen: rows[0].imagen,
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

exports.postPokemons = async (req, res) => {
  console.log(req.body);
  try {
    const { rows } = await pool.query(
      `INSERT INTO public.pokemon(nombre, numero, color, peso, altura, descripcion, imagen) VALUES ($1,$2,$3,$4,$5,$6,$7) returning id `,
      [
        req.body.nombre,
        req.body.numero,
        req.body.color,
        req.body.peso,
        req.body.altura,
        req.body.descripcion,
        req.body.imagen,
      ]
    );

    const id = rows[0].id;
    const { rows: stats } = await pool.query(
      `INSERT INTO public.stats(hp, atk, def, satk, sdef,spd, pokemonid) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        req.body.hp,
        req.body.atk,
        req.body.def,
        req.body.satk,
        req.body.sdef,
        req.body.spd,
        id,
      ]
    );

    const { rows: movimientos } = await pool.query(
      `INSERT INTO public.movimientos( movimiento1, pokemonid, movimiento2) VALUES ($1, $2, $3) `,
      [req.body.movimiento1, id, req.body.movimiento2]
    );
    const { rows: elementos } = await pool.query(
      `INSERT INTO public.elementos(elemento1, pokemonid, elemento2)VALUES ( $1, $2, $3) `,
      [req.body.elementoPrincipal, id, req.body.elementoSecundario]
    );
  } catch (error) {
    console.log(error);
  }
  res.sendStatus(201);
};
