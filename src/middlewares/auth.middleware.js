/**
 * Middleware de Autenticação JWT
 * Intercepta requisições, valida o token JWT e permite ou bloqueia o acesso
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar e validar o token JWT
 * @param {Object} req - Request object do Express
 * @param {Object} res - Response object do Express
 * @param {Function} next - Próxima função middleware
 */
const authenticateToken = (req, res, next) => {
  try {
    // Extrai o token do header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // Verifica se o token foi fornecido
    if (!token) {
      return res.status(401).json({
        error: 'Token não fornecido',
        message: 'É necessário estar autenticado para acessar este recurso',
      });
    }

    // Verifica e decodifica o token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Token inválido ou expirado
        return res.status(403).json({
          error: 'Token inválido',
          message: 'O token fornecido é inválido ou expirou',
        });
      }

      // Adiciona os dados do usuário ao request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      };

      // Prossegue para a próxima função
      next();
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro na autenticação',
      message: 'Ocorreu um erro ao processar a autenticação',
    });
  }
};

/**
 * Middleware opcional - tenta autenticar mas não bloqueia se falhar
 * Útil para rotas que podem funcionar com ou sem autenticação
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (!err) {
          req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
          };
        }
      });
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
};
