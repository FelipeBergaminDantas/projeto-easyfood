/**
 * Restaurant Routes
 * Define as rotas relacionadas a restaurantes
 */

const express = require('express');
const restaurantController = require('./restaurant.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route   GET /restaurants/categories
 * @desc    Lista todas as categorias únicas de restaurantes
 * @access  Public
 */
router.get('/categories', restaurantController.getCategories);

/**
 * @route   GET /restaurants
 * @desc    Lista todos os restaurantes (com filtros opcionais)
 * @query   name, category
 * @access  Public
 */
router.get('/', restaurantController.getAllRestaurants);

/**
 * @route   GET /restaurants/:id
 * @desc    Busca um restaurante específico por ID
 * @access  Public
 */
router.get('/:id', restaurantController.getRestaurantById);

/**
 * @route   POST /restaurants
 * @desc    Cria um novo restaurante
 * @access  Private (requer autenticação)
 */
router.post('/', authenticateToken, restaurantController.createRestaurant);

/**
 * @route   PUT /restaurants/:id
 * @desc    Atualiza um restaurante existente
 * @access  Private (requer autenticação)
 */
router.put('/:id', authenticateToken, restaurantController.updateRestaurant);

/**
 * @route   DELETE /restaurants/:id
 * @desc    Remove um restaurante
 * @access  Private (requer autenticação)
 */
router.delete('/:id', authenticateToken, restaurantController.deleteRestaurant);

module.exports = router;
