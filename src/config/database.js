/**
 * Configuração do Prisma Client
 * Instancia e exporta o cliente do Prisma para acesso ao banco de dados PostgreSQL
 */

const { PrismaClient } = require('@prisma/client');

// Instancia o Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Tratamento de desconexão graciosa
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
