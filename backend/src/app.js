const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const swaggerDocs = require('./docs/swagger');

// Route files
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Swagger API Documentation
swaggerDocs(app);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Health Check Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is awake!' });
});

// Base route
app.get('/', (req, res) => {
  res.send('API is running... Check /api-docs for Swagger documentation.');
});

// Error handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
