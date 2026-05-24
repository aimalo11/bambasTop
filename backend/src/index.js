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
const healthRoutes = require('./routes/healthRoutes');

const requestId = require('./middleware/requestId');
const httpLogger = require('./middleware/httpLogger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.post('/api/checkout/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Middlewares d'observabilitat
app.use(requestId);
app.use(httpLogger);

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
app.use('/api', healthRoutes);

// Endpoint temporal per simular errors i testejar l'observabilitat
app.get('/api/debug/error', (req, res, next) => {
  next(new Error('Error de prova per observabilitat'));
});


app.get('/', (req, res) => res.send('API Ecommerce en marxa 🚀'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware global d'errors observable
app.use(errorHandler);

// Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));
