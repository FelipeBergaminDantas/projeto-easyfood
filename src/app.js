/**
 * Configuração principal da aplicação Express
 * Define middlewares, rotas e tratamento de erros
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importa as rotas dos módulos
const authRoutes = require('./modules/auth/auth.routes');
const restaurantRoutes = require('./modules/restaurants/restaurant.routes');

// Cria a aplicação Express
const app = express();

// ===== Middlewares =====

// CORS - permite requisições de qualquer origem
app.use(cors());

// Parser de JSON - processa requisições com Content-Type: application/json
app.use(express.json());

// Parser de URL encoded - processa formulários
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Log de requisições (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ===== Rotas =====

// Rota raiz - serve o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'EasyFood API está funcionando',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Rotas da API
app.use('/auth', authRoutes);
app.use('/restaurants', restaurantRoutes);

// ===== Tratamento de Erros =====

// Rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.path} não existe`,
    availableRoutes: [
      'GET /health',
      'POST /auth/register',
      'POST /auth/login',
      'GET /auth/profile',
      'GET /restaurants',
      'GET /restaurants/:id',
      'POST /restaurants',
      'PUT /restaurants/:id',
      'DELETE /restaurants/:id',
      'GET /restaurants/categories',
    ],
  });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  
  res.status(err.status || 500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Ocorreu um erro ao processar sua requisição',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
