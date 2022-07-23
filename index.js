const express = require("express");
const app = express();
const pokemonsRoutes = require("./routes/pokemons");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth");
const CORS = require("CORS");
app.use(CORS());
app.use(bodyParser.json());
app.use("/", authRouter, pokemonsRoutes);
app.get("/", (req, res) => {
  res.send("hola");
});

app.listen(6789, () =>
  console.log("Server listening in http://localhost:6789")
);
