/**
 * Auth Routes
 * Define as rotas de autenticação da aplicação
 */

const express = require('express');
const authController = require('./auth.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Registra um novo usuário
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /auth/login
 * @desc    Realiza login e retorna token JWT
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /auth/profile
 * @desc    Retorna o perfil do usuário autenticado
 * @access  Private (requer autenticação)
 */
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
