const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário de exemplo
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@easyfood.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@easyfood.com',
      password: hashedPassword,
    },
  });

  console.log('✅ Usuário criado:', user.email);

  // Criar restaurantes de exemplo
  const restaurants = [
    {
      name: 'Pizzaria Bella Napoli',
      category: 'Italiana',
      description: 'Pizzas artesanais no forno a lenha com ingredientes importados da Itália',
      address: 'Rua das Palmeiras, 123 - Vila Mariana',
      phone: '(11) 3456-7890',
      rating: 4.8,
    },
    {
      name: 'Sushi House',
      category: 'Japonesa',
      description: 'Culinária japonesa autêntica com peixes frescos e sushimen experientes',
      address: 'Av. Paulista, 1500 - Bela Vista',
      phone: '(11) 98765-4321',
      rating: 4.9,
    },
    {
      name: 'Churrascaria Gaúcha',
      category: 'Churrascaria',
      description: 'Rodízio de carnes nobres com buffet completo de saladas',
      address: 'Rua dos Três Irmãos, 456 - Pinheiros',
      phone: '(11) 2345-6789',
      rating: 4.5,
    },
    {
      name: 'Cantina da Nonna',
      category: 'Italiana',
      description: 'Massas caseiras e molhos tradicionais da culinária italiana',
      address: 'Rua Avanhandava, 78 - Centro',
      phone: '(11) 3344-5566',
      rating: 4.7,
    },
    {
      name: 'Hamburgueria Artesanal',
      category: 'Fast Food',
      description: 'Hambúrgueres gourmet com pães artesanais e carnes selecionadas',
      address: 'Rua Augusta, 2000 - Consolação',
      phone: '(11) 99876-5432',
      rating: 4.6,
    },
    {
      name: 'Restaurante Vegano Green',
      category: 'Vegana',
      description: 'Opções 100% veganas com ingredientes orgânicos e sustentáveis',
      address: 'Rua Harmonia, 250 - Vila Madalena',
      phone: '(11) 3456-1234',
      rating: 4.4,
    },
    {
      name: 'Taco Mexicano',
      category: 'Mexicana',
      description: 'Tacos, burritos e nachos com temperos tradicionais mexicanos',
      address: 'Rua dos Pinheiros, 890 - Pinheiros',
      phone: '(11) 98123-4567',
      rating: 4.3,
    },
    {
      name: 'Padaria São Paulo',
      category: 'Padaria',
      description: 'Pães frescos, doces e salgados artesanais desde 1985',
      address: 'Rua da Consolação, 567 - Consolação',
      phone: '(11) 3344-7788',
      rating: 4.2,
    },
  ];

  for (const restaurant of restaurants) {
    const created = await prisma.restaurant.upsert({
      where: { 
        id: 0 // Força criação se não existir
      },
      update: {},
      create: restaurant,
    });
    console.log(`✅ Restaurante criado: ${created.name}`);
  }

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
