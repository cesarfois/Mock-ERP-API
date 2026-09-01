const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dataService = require('./services/dataService');
const supplierRoutes = require('./routes/suppliers');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize JSON database
dataService.initDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mock ERP / Primavera API',
      version: '1.0.0',
      description: 'API for simulating ERP operations (e.g. Primavera)',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1/suppliers', supplierRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'mock-erp-api'
  });
});

// Fallback for frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock ERP API running on http://localhost:${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/docs`);
});
