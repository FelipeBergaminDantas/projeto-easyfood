/**
 * Auth Service
 * Contém a lógica de negócio para autenticação (registro e login)
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/database');

/**
 * Registra um novo usuário no sistema
 * @param {Object} userData - Dados do usuário (name, email, password)
 * @returns {Object} Usuário criado (sem a senha)
 */
const registerUser = async ({ name, email, password }) => {
  // Validações básicas
  if (!name || !email || !password) {
    throw new Error('Nome, email e senha são obrigatórios');
  }

  // Valida formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Email inválido');
  }

  // Valida tamanho da senha
  if (password.length < 6) {
    throw new Error('A senha deve ter no mínimo 6 caracteres');
  }

  // Verifica se o email já está em uso
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email já cadastrado no sistema');
  }

  // Gera o hash da senha usando bcrypt
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Cria o usuário no banco de dados
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Remove a senha do objeto de retorno
  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

/**
 * Realiza o login do usuário
 * @param {Object} credentials - Credenciais (email, password)
 * @returns {Object} Token JWT e dados do usuário
 */
const loginUser = async ({ email, password }) => {
  // Validações básicas
  if (!email || !password) {
    throw new Error('Email e senha são obrigatórios');
  }

  // Busca o usuário pelo email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Credenciais inválidas');
  }

  // Compara a senha fornecida com o hash armazenado
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas');
  }

  // Gera o token JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    }
  );

  // Remove a senha do objeto de retorno
  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
};

/**
 * Busca informações do usuário autenticado
 * @param {Number} userId - ID do usuário
 * @returns {Object} Dados do usuário
 */
const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
