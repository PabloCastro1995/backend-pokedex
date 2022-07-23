const express = require("express");
const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  database: "Prueba Yazi",
  password: "nico123123",
});
const app = express();
app.use(express.json());
app.post("/empleados", async (req, res) => {
  const { pokemones } = req.body;
  await Promise.all(
    pokemones.map((pk) => {
      return pool.query(
        `INSERT INTO empleados (nombre, apellido, fecha_nac, reporta_a, extension)
      VALUES ($1,$2,$3,$4,$5)`,
        [pk.nombre, pk.apellido, pk.fecha_nac, pk.reporta_a, pk.extension]
      );
    })
  );
  res.json(req.body);
});
//////////////////productos///////////////////////////////
app.get("/", (req, res) => {
  res.send(" BIENVENIDOS");
});
app.get("/productos", async (req, res) => {
  const { rows } = await pool.query("select * from public.productos");
  res.send(rows);
});
/////////////////provedoores///////////////////////////
app.get("/productos/proveedores", async (req, res) => {
  const { rows } = await pool.query("select * from public.proveedores");
  res.send(rows);
});
app.get("/productos/proveedores/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    "select  nombreprov from public.proveedores where proveedorid =$1 limit 1",
    [id]
  );
  if (rows[0]) {
    res.send(rows[0]);
  } else {
    res.sendStatus(404);
  }
});
////////////////////categorias/////////////////////////////
app.get("/productos/categorias", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM public.categorias;");
  res.send(rows);
});
app.get("/productos/categorias/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    "select  nombrecat from public.categorias where categoriaid =$1 limit 1",
    [id]
  );
  if (rows[0]) {
    res.send(rows[0]);
  } else {
    res.sendStatus(404);
  }
});
//////////////////ordenes///////////////////////////////
app.get("/productos/ordenes", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM ordenes;");
  res.send(rows);
});
app.get("/productos/ordenes/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    "select  * from ordenes ord JOIN empleados em ON (em.empleadoid = ord.empleadoid) where ordenid =$1 limit 1",
    [id]
  );
  if (rows[0]) {
    res.send(rows[0]);
  } else {
    res.sendStatus(404);
  }
});
//////////////////clientes///////////////////////////////
app.get("/clientes", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM public.clientes");
  res.send(rows);
});
app.get("/clientes/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    "select  * from clientes where clienteid =$1 limit 1",
    [id]
  );
  if (rows[0]) {
    res.send(rows[0]);
  } else {
    res.sendStatus(404);
  }
});
//////////////////empleados///////////////////////////////
app.get("/empleados", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM empleados");
  res.send(rows);
});
app.get("/empleados/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    "select  * from empleados where empleadoid =$1 limit 1",
    [id]
  );
  if (rows[0]) {
    res.send(rows[0]);
  } else {
    res.sendStatus(404);
  }
});
app.listen(5678, async () => {
  console.log("Server listening in http://localhost:5678/");
  pool.connect();
});
