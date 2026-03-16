require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/usuariRoutes');
const cistellaRoutes = require('./routes/cistellaRoutes');

const app = express();
app.use(express.json());

// Conectar base de datos
connectDB();

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cistellaRoutes);

app.get('/', (req, res) => res.send('API Ecommerce en marxa 🚀'));

// Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
