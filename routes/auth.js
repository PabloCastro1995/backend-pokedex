const { pool } = require("../database/conection.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../middlewares/validate-jwt");
const users = [
  {
    name: "",
    mail: "",
    password: "",
  },
];

router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  const { rows } = await pool.query(
    `INSERT INTO public.usuarios(
      name, mail, password)
     VALUES ( $1, $2, $3)`,
    [req.body.name, req.body.mail, password]
  );
  const newUser = {
    name: req.body.name,
    mail: req.body.mail,
    password: password,
  };
  users.push(newUser);
  return res.json({ success: true, newUser });
});
router.post("/login", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  const { rows } = await pool.query(
    `select * from public.usuarios where mail = $1`,
    [req.body.mail]
  );
  const user = rows[0];
  if (!user) {
    return res.status(400).json({ error: "user not found" });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: "invalid password" });
  }

  const token = jwt.sign(
    {
      name: user.name,
      mail: user.mail,
    },
    TOKEN_SECRET
  );

  return res.status(200).json({ data: "login exitoso", token });
});

module.exports = router;
