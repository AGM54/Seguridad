const express = require('express');
const Keycloak = require('keycloak-connect');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const memoryStore = new session.MemoryStore();
const { authMiddleware } = require("./middleware");

app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const keycloak = new Keycloak({ store: memoryStore });

app.use(keycloak.middleware());

// Endpoint público
app.get('/public', (req, res) => {
  res.send('Este es un endpoint público.');
});

// Endpoint protegido
app.get('/private', authMiddleware, (req, res) => {
  res.send('Este es un endpoint protegido.');
});

// Endpoint para enviar datos
app.post('/data', authMiddleware, express.json(), (req, res) => {
  const data = req.body;
  res.json({ message: 'Datos recibidos', data });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});