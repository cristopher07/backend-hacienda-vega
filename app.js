require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/db');

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Backend Hacienda La Vega activo');
});

// Iniciar servidor y probar conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('🟢 Conexión a la base de datos exitosa');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('🔴 Error al conectar a la base de datos:', error);
  }
})();
