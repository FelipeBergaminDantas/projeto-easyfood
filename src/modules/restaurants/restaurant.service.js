/**
 * Restaurant Service
 * Contém a lógica de negócio para gerenciamento de restaurantes
 */

const prisma = require('../../config/database');

/**
 * Busca todos os restaurantes com filtros opcionais
 * @param {Object} filters - Filtros de busca (name, category)
 * @returns {Array} Lista de restaurantes
 */
const getAllRestaurants = async (filters = {}) => {
  const { name, category } = filters;

  const where = {};

  // Filtro por nome (case-insensitive, busca parcial)
  if (name) {
    where.name = {
      contains: name,
      mode: 'insensitive',
    };
  }

  // Filtro por categoria (case-insensitive, busca parcial)
  if (category) {
    where.category = {
      contains: category,
      mode: 'insensitive',
    };
  }

  const restaurants = await prisma.restaurant.findMany({
    where,
    orderBy: {
      rating: 'desc', // Ordena por avaliação (melhores primeiro)
    },
  });

  return restaurants;
};

/**
 * Busca um restaurante por ID
 * @param {Number} id - ID do restaurante
 * @returns {Object} Restaurante encontrado
 */
const getRestaurantById = async (id) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: parseInt(id) },
  });

  if (!restaurant) {
    throw new Error('Restaurante não encontrado');
  }

  return restaurant;
};

/**
 * Cria um novo restaurante
 * @param {Object} restaurantData - Dados do restaurante
 * @returns {Object} Restaurante criado
 */
const createRestaurant = async (restaurantData) => {
  const { name, category, description, address, phone, rating } = restaurantData;

  // Validações básicas
  if (!name || !category || !address || !phone) {
    throw new Error('Nome, categoria, endereço e telefone são obrigatórios');
  }

  // Valida o rating (0 a 5)
  if (rating !== undefined) {
    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      throw new Error('A avaliação deve ser um número entre 0 e 5');
    }
  }

  // Valida formato do telefone (básico)
  const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error('Formato de telefone inválido. Use: (11) 98765-4321');
  }

  // Cria o restaurante
  const restaurant = await prisma.restaurant.create({
    data: {
      name,
      category,
      description: description || null,
      address,
      phone,
      rating: rating ? parseFloat(rating) : 0.0,
    },
  });

  return restaurant;
};

/**
 * Atualiza um restaurante existente
 * @param {Number} id - ID do restaurante
 * @param {Object} updateData - Dados a serem atualizados
 * @returns {Object} Restaurante atualizado
 */
const updateRestaurant = async (id, updateData) => {
  // Verifica se o restaurante existe
  const existing = await prisma.restaurant.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existing) {
    throw new Error('Restaurante não encontrado');
  }

  // Valida o rating se fornecido
  if (updateData.rating !== undefined) {
    const ratingNum = parseFloat(updateData.rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      throw new Error('A avaliação deve ser um número entre 0 e 5');
    }
    updateData.rating = ratingNum;
  }

  // Valida telefone se fornecido
  if (updateData.phone) {
    const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/;
    if (!phoneRegex.test(updateData.phone)) {
      throw new Error('Formato de telefone inválido. Use: (11) 98765-4321');
    }
  }

  // Atualiza o restaurante
  const restaurant = await prisma.restaurant.update({
    where: { id: parseInt(id) },
    data: updateData,
  });

  return restaurant;
};

/**
 * Remove um restaurante
 * @param {Number} id - ID do restaurante
 * @returns {Object} Restaurante removido
 */
const deleteRestaurant = async (id) => {
  // Verifica se o restaurante existe
  const existing = await prisma.restaurant.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existing) {
    throw new Error('Restaurante não encontrado');
  }

  // Remove o restaurante
  const restaurant = await prisma.restaurant.delete({
    where: { id: parseInt(id) },
  });

  return restaurant;
};

/**
 * Busca categorias únicas de restaurantes
 * @returns {Array} Lista de categorias
 */
const getCategories = async () => {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      category: true,
    },
    distinct: ['category'],
    orderBy: {
      category: 'asc',
    },
  });

  return restaurants.map((r) => r.category);
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getCategories,
};
