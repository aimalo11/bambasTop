require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/usuariRoutes');
const cistellaRoutes = require('./routes/cistellaRoutes');
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const orderRoutes = require('./routes/orderRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');


const app = express();
app.use(cors());
app.post('/api/checkout/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Conectar base de datos
connectDB();

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cistellaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', checkoutRoutes);


app.get('/', (req, res) => res.send('API Ecommerce en marxa 🚀'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
