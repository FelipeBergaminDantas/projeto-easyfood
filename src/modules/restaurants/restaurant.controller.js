/**
 * Restaurant Controller
 * Controla as requisições HTTP relacionadas a restaurantes
 */

const restaurantService = require('./restaurant.service');

/**
 * Controller para listar todos os restaurantes
 * GET /restaurants?name=xxx&category=xxx
 */
const getAllRestaurants = async (req, res) => {
  try {
    const { name, category } = req.query;

    const restaurants = await restaurantService.getAllRestaurants({
      name,
      category,
    });

    return res.status(200).json({
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error('Erro ao buscar restaurantes:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar os restaurantes',
    });
  }
};

/**
 * Controller para buscar um restaurante por ID
 * GET /restaurants/:id
 */
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await restaurantService.getRestaurantById(id);

    return res.status(200).json({
      restaurant,
    });
  } catch (error) {
    if (error.message === 'Restaurante não encontrado') {
      return res.status(404).json({
        error: 'Não encontrado',
        message: error.message,
      });
    }

    console.error('Erro ao buscar restaurante:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar o restaurante',
    });
  }
};

/**
 * Controller para criar um novo restaurante
 * POST /restaurants
 */
const createRestaurant = async (req, res) => {
  try {
    const restaurantData = req.body;

    const restaurant = await restaurantService.createRestaurant(restaurantData);

    return res.status(201).json({
      message: 'Restaurante cadastrado com sucesso',
      restaurant,
    });
  } catch (error) {
    // Erros de validação retornam 400
    if (
      error.message.includes('obrigatórios') ||
      error.message.includes('inválido') ||
      error.message.includes('avaliação')
    ) {
      return res.status(400).json({
        error: 'Erro de validação',
        message: error.message,
      });
    }

    console.error('Erro ao criar restaurante:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível criar o restaurante',
    });
  }
};

/**
 * Controller para atualizar um restaurante
 * PUT /restaurants/:id
 */
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const restaurant = await restaurantService.updateRestaurant(id, updateData);

    return res.status(200).json({
      message: 'Restaurante atualizado com sucesso',
      restaurant,
    });
  } catch (error) {
    if (error.message === 'Restaurante não encontrado') {
      return res.status(404).json({
        error: 'Não encontrado',
        message: error.message,
      });
    }

    if (
      error.message.includes('inválido') ||
      error.message.includes('avaliação')
    ) {
      return res.status(400).json({
        error: 'Erro de validação',
        message: error.message,
      });
    }

    console.error('Erro ao atualizar restaurante:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível atualizar o restaurante',
    });
  }
};

/**
 * Controller para deletar um restaurante
 * DELETE /restaurants/:id
 */
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    await restaurantService.deleteRestaurant(id);

    return res.status(200).json({
      message: 'Restaurante removido com sucesso',
    });
  } catch (error) {
    if (error.message === 'Restaurante não encontrado') {
      return res.status(404).json({
        error: 'Não encontrado',
        message: error.message,
      });
    }

    console.error('Erro ao deletar restaurante:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível remover o restaurante',
    });
  }
};

/**
 * Controller para listar categorias
 * GET /restaurants/categories
 */
const getCategories = async (req, res) => {
  try {
    const categories = await restaurantService.getCategories();

    return res.status(200).json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar as categorias',
    });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getCategories,
};
