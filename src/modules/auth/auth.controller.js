/**
 * Auth Controller
 * Controla as requisições HTTP relacionadas à autenticação
 */

const authService = require('./auth.service');

/**
 * Controller para registro de novo usuário
 * POST /auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await authService.registerUser({ name, email, password });

    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user,
    });
  } catch (error) {
    // Erros de validação retornam 400
    if (
      error.message.includes('obrigatórios') ||
      error.message.includes('inválido') ||
      error.message.includes('já cadastrado') ||
      error.message.includes('caracteres')
    ) {
      return res.status(400).json({
        error: 'Erro de validação',
        message: error.message,
      });
    }

    // Outros erros retornam 500
    console.error('Erro no registro:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível registrar o usuário',
    });
  }
};

/**
 * Controller para login de usuário
 * POST /auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser({ email, password });

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      ...result,
    });
  } catch (error) {
    // Credenciais inválidas retornam 401
    if (error.message.includes('Credenciais inválidas')) {
      return res.status(401).json({
        error: 'Autenticação falhou',
        message: error.message,
      });
    }

    // Erros de validação retornam 400
    if (error.message.includes('obrigatórios')) {
      return res.status(400).json({
        error: 'Erro de validação',
        message: error.message,
      });
    }

    // Outros erros retornam 500
    console.error('Erro no login:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível realizar o login',
    });
  }
};

/**
 * Controller para obter perfil do usuário autenticado
 * GET /auth/profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extraído do token pelo middleware

    const user = await authService.getUserProfile(userId);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar o perfil do usuário',
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
