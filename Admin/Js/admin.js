// admin.js

let adminLoggedIn = false;
let activeAdminTab = 'home';

// Login do administrador
function adminLogin(event) {
  event.preventDefault();

  const passwordInput = document.getElementById('admin-password');
  const password = passwordInput.value.trim();

  if (password === 'akron123') {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    adminLoggedIn = true;
    showToast('Login realizado com sucesso!', 'success');
    loadAdminData();
    showAdminTab('home');
  } else {
    showToast('Senha incorreta!', 'error');
  }
}

// Troca de abas
function showAdminTab(tab) {
  // Oculta todos os conteúdos
  document.querySelectorAll('.admin-tab-content').forEach((tabContent) => {
    tabContent.style.display = 'none';
  });

  // Remove destaque dos botões
  document.querySelectorAll('.admin-tab').forEach((btn) => {
    btn.classList.remove('bg-red-600', 'text-white');
    btn.classList.add('bg-gray-200', 'text-black');
  });

  // Ativa a aba clicada
  document.getElementById(`admin-${tab}-tab`).style.display = 'block';
  document.getElementById(`${tab}-tab`).classList.add('bg-red-600', 'text-white');
  document.getElementById(`${tab}-tab`).classList.remove('bg-gray-200', 'text-black');

  activeAdminTab = tab;

  // Carrega dados específicos
  if (tab === 'products') loadProductsList();
  if (tab === 'collection') loadCollectionProductsList();
}

// Carregar dados salvos do localStorage
function loadAdminData() {
  const content = JSON.parse(localStorage.getItem('akron-content') || '{}');

  if (content.title) document.getElementById('main-title').value = content.title;
  if (content.subtitle) document.getElementById('subtitle').value = content.subtitle;
  if (content.heroBg) document.getElementById('hero-bg-image').value = content.heroBg;
  if (content.heroLogo) document.getElementById('hero-logo-image').value = content.heroLogo;
  if (content.whatsapp) document.getElementById('whatsapp-number').value = content.whatsapp;
  if (content.email) document.getElementById('contact-email-admin').value = content.email;
  if (content.collectionTitle) document.getElementById('collection-title').value = content.collectionTitle;
  if (content.collectionSubtitle) document.getElementById('collection-subtitle').value = content.collectionSubtitle;
}

// Salvar conteúdo da aba home
function saveHomeContent() {
  const content = {
    title: document.getElementById('main-title').value.trim(),
    subtitle: document.getElementById('subtitle').value.trim(),
    heroBg: document.getElementById('hero-bg-image').value.trim(),
    heroLogo: document.getElementById('hero-logo-image').value.trim(),
    whatsapp: document.getElementById('whatsapp-number').value.trim(),
    email: document.getElementById('contact-email-admin').value.trim()
  };

  localStorage.setItem('akron-content', JSON.stringify(content));
  showToast('Conteúdo salvo com sucesso!', 'success');
}

// Salvar conteúdo da coleção
function saveCollectionContent() {
  const content = JSON.parse(localStorage.getItem('akron-content') || '{}');
  content.collectionTitle = document.getElementById('collection-title').value.trim();
  content.collectionSubtitle = document.getElementById('collection-subtitle').value.trim();

  localStorage.setItem('akron-content', JSON.stringify(content));
  showToast('Coleção atualizada com sucesso!', 'success');
}

// Toast genérico
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Aqui entram as funções que serão corrigidas em products.js:
// - loadProductsList()
// - loadCollectionProductsList()
// - addProduct()
// (Essas serão ajustadas na próxima etapa)

