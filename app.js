require('dotenv').config();
const express = require('express');
const cors = require('cors'); // 👈 importa cors
const app = express();
const sequelize = require('./config/db');

const PORT = process.env.PORT || 3000;

app.use(cors()); // 👈 habilita CORS para TODAS las rutas

app.use(express.json());

// 👇 Aquí montamos las rutas
const routes = require('./routes/routes');
app.use('/hv', routes); 

// Ruta simple de prueba
app.get('/', (req, res) => {
  res.send('✅ Backend Hacienda La Vega activo');
});

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
