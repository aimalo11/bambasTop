require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Ruta raíz
app.get('/', (req, res) => res.send('API Ecommerce en marxa 🚀'));

// Montar rutas de productos bajo '/api/products'
app.use('/api/products', productRoutes);

// Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
