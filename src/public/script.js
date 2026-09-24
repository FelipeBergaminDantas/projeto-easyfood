/**
 * EasyFood Frontend Application
 * Gerencia a interface do usuário e comunicação com a API
 */

// Configuração da API
const API_URL = 'http://localhost:3000';

// Estado da aplicação
const AppState = {
  token: localStorage.getItem('token'),
  user: null,
  currentSection: 'home',
  restaurants: [],
};

// ===== Utility Functions =====

/**
 * Exibe uma notificação toast
 */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

/**
 * Faz requisições HTTP para a API
 */
async function apiRequest(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(AppState.token && { Authorization: `Bearer ${AppState.token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Navega entre seções
 */
function navigateTo(section) {
  // Esconde todas as seções
  document.querySelectorAll('.section').forEach((s) => s.classList.add('hidden'));
  
  // Remove 'active' de todos os botões
  document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.remove('active'));
  
  // Mostra a seção selecionada
  AppState.currentSection = section;
  
  switch (section) {
    case 'home':
      document.getElementById('homeSection').classList.remove('hidden');
      document.getElementById('btnHome').classList.add('active');
      loadRestaurants();
      break;
    case 'auth':
      document.getElementById('authSection').classList.remove('hidden');
      document.getElementById('btnAuth').classList.add('active');
      break;
    case 'profile':
      document.getElementById('profileSection').classList.remove('hidden');
      document.getElementById('btnProfile').classList.add('active');
      loadProfile();
      break;
    case 'new-restaurant':
      document.getElementById('newRestaurantSection').classList.remove('hidden');
      break;
  }
}

/**
 * Atualiza a UI baseado no estado de autenticação
 */
function updateAuthUI() {
  const isAuthenticated = !!AppState.token;
  
  document.getElementById('btnAuth').classList.toggle('hidden', isAuthenticated);
  document.getElementById('btnProfile').classList.toggle('hidden', !isAuthenticated);
  document.getElementById('btnLogout').classList.toggle('hidden', !isAuthenticated);
  document.getElementById('btnNewRestaurant').classList.toggle('hidden', !isAuthenticated);
}

// ===== Authentication Functions =====

/**
 * Realiza o login do usuário
 */
async function login(email, password) {
  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    AppState.token = data.token;
    AppState.user = data.user;
    localStorage.setItem('token', data.token);

    showToast('Login realizado com sucesso!', 'success');
    updateAuthUI();
    navigateTo('home');
  } catch (error) {
    showToast(error.message || 'Erro ao fazer login', 'error');
  }
}

/**
 * Registra um novo usuário
 */
async function register(name, email, password) {
  try {
    await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    showToast('Cadastro realizado! Faça login para continuar.', 'success');
    showLoginForm();
  } catch (error) {
    showToast(error.message || 'Erro ao cadastrar', 'error');
  }
}

/**
 * Faz logout do usuário
 */
function logout() {
  AppState.token = null;
  AppState.user = null;
  localStorage.removeItem('token');
  
  showToast('Logout realizado com sucesso!', 'success');
  updateAuthUI();
  navigateTo('home');
}

/**
 * Carrega o perfil do usuário
 */
async function loadProfile() {
  const profileData = document.getElementById('profileData');
  profileData.innerHTML = '<div class="loading">Carregando perfil...</div>';

  try {
    const data = await apiRequest('/auth/profile');
    const user = data.user;

    profileData.innerHTML = `
      <div class="profile-item">
        <div class="profile-label">Nome</div>
        <div class="profile-value">${user.name}</div>
      </div>
      <div class="profile-item">
        <div class="profile-label">Email</div>
        <div class="profile-value">${user.email}</div>
      </div>
      <div class="profile-item">
        <div class="profile-label">Membro desde</div>
        <div class="profile-value">${new Date(user.createdAt).toLocaleDateString('pt-BR')}</div>
      </div>
    `;
  } catch (error) {
    profileData.innerHTML = '<div class="loading">Erro ao carregar perfil</div>';
    showToast('Erro ao carregar perfil', 'error');
  }
}

// ===== Restaurant Functions =====

/**
 * Carrega e exibe os restaurantes
 */
async function loadRestaurants(filters = {}) {
  const grid = document.getElementById('restaurantGrid');
  grid.innerHTML = '<div class="loading">Carregando restaurantes...</div>';

  try {
    const queryParams = new URLSearchParams();
    if (filters.name) queryParams.append('name', filters.name);
    if (filters.category) queryParams.append('category', filters.category);

    const data = await apiRequest(`/restaurants?${queryParams}`);
    AppState.restaurants = data.restaurants;

    if (data.restaurants.length === 0) {
      grid.innerHTML = '<div class="loading">Nenhum restaurante encontrado</div>';
      return;
    }

    grid.innerHTML = data.restaurants
      .map((restaurant) => createRestaurantCard(restaurant))
      .join('');
  } catch (error) {
    grid.innerHTML = '<div class="loading">Erro ao carregar restaurantes</div>';
    showToast('Erro ao carregar restaurantes', 'error');
  }
}

/**
 * Cria o HTML de um card de restaurante
 */
function createRestaurantCard(restaurant) {
  return `
    <div class="restaurant-card">
      <div class="restaurant-header">
        <div>
          <h3 class="restaurant-name">${restaurant.name}</h3>
          <span class="restaurant-category">${restaurant.category}</span>
        </div>
        <span class="restaurant-rating">⭐ ${restaurant.rating.toFixed(1)}</span>
      </div>
      ${restaurant.description ? `<p class="restaurant-description">${restaurant.description}</p>` : ''}
      <div class="restaurant-info">
        <div class="restaurant-info-item">📍 ${restaurant.address}</div>
        <div class="restaurant-info-item">📞 ${restaurant.phone}</div>
      </div>
    </div>
  `;
}

/**
 * Cria um novo restaurante
 */
async function createRestaurant(restaurantData) {
  try {
    await apiRequest('/restaurants', {
      method: 'POST',
      body: JSON.stringify(restaurantData),
    });

    showToast('Restaurante cadastrado com sucesso!', 'success');
    navigateTo('home');
    document.getElementById('formNewRestaurant').reset();
  } catch (error) {
    showToast(error.message || 'Erro ao cadastrar restaurante', 'error');
  }
}

// ===== UI Functions =====

/**
 * Mostra o formulário de login
 */
function showLoginForm() {
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('registerForm').classList.add('hidden');
}

/**
 * Mostra o formulário de registro
 */
function showRegisterForm() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerForm').classList.remove('hidden');
}

// ===== Event Listeners =====

document.addEventListener('DOMContentLoaded', () => {
  // Navegação
  document.getElementById('btnHome').addEventListener('click', () => navigateTo('home'));
  document.getElementById('btnAuth').addEventListener('click', () => navigateTo('auth'));
  document.getElementById('btnProfile').addEventListener('click', () => navigateTo('profile'));
  document.getElementById('btnLogout').addEventListener('click', logout);
  document.getElementById('btnNewRestaurant').addEventListener('click', () => navigateTo('new-restaurant'));
  document.getElementById('btnCancelNew').addEventListener('click', () => navigateTo('home'));

  // Alternar entre login e registro
  document.getElementById('linkToRegister').addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
  });

  document.getElementById('linkToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
  });

  // Form de Login
  document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    await login(email, password);
  });

  // Form de Registro
  document.getElementById('formRegister').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    await register(name, email, password);
  });

  // Form de Novo Restaurante
  document.getElementById('formNewRestaurant').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const restaurantData = {
      name: document.getElementById('restaurantName').value,
      category: document.getElementById('restaurantCategory').value,
      description: document.getElementById('restaurantDescription').value,
      address: document.getElementById('restaurantAddress').value,
      phone: document.getElementById('restaurantPhone').value,
      rating: parseFloat(document.getElementById('restaurantRating').value) || 0,
    };

    await createRestaurant(restaurantData);
  });

  // Filtros
  let filterTimeout;
  const applyFilters = () => {
    clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
      const filters = {
        name: document.getElementById('filterName').value,
        category: document.getElementById('filterCategory').value,
      };
      loadRestaurants(filters);
    }, 500);
  };

  document.getElementById('filterName').addEventListener('input', applyFilters);
  document.getElementById('filterCategory').addEventListener('input', applyFilters);
  
  document.getElementById('btnClearFilters').addEventListener('click', () => {
    document.getElementById('filterName').value = '';
    document.getElementById('filterCategory').value = '';
    loadRestaurants();
  });

  // Inicialização
  updateAuthUI();
  navigateTo('home');
});
