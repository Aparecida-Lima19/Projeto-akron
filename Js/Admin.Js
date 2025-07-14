
// Variáveis admin
let adminLoggedIn = false;
let activeAdminTab = 'home';

// Funções de administração
function adminLogin(event) {
    event.preventDefault();
    
    const password = document.getElementById('admin-password').value;
    
    if (password === 'akron123') {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        adminLoggedIn = true;
        loadAdminData();
        showToast('Login realizado com sucesso!', 'success');
    } else {
        showToast('Senha incorreta!', 'error');
    }
}

function showAdminTab(tab) {
    // Ocultar todas as abas
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Resetar estilos dos botões
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.className = 'admin-tab px-6 py-3 font-bold rounded-t-lg transition bg-gray-200 text-black hover:bg-gray-300';
    });
    
    // Mostrar aba ativa
    document.getElementById(`admin-${tab}-tab`).style.display = 'block';
    document.getElementById(`${tab}-tab`).className = 'admin-tab px-6 py-3 font-bold rounded-t-lg transition bg-red-600 text-white';
    
    activeAdminTab = tab;
    
    if (tab === 'products') {
        loadProductsList();
    } else if (tab === 'collection') {
        loadCollectionProductsList();
    }
}

function loadAdminData() {
    const savedContent = JSON.parse(localStorage.getItem('akron-content') || '{}');
    
    if (savedContent.title) document.getElementById('main-title').value = savedContent.title;
    if (savedContent.subtitle) document.getElementById('subtitle').value = savedContent.subtitle;
    if (savedContent.heroBg) document.getElementById('hero-bg-image').value = savedContent.heroBg;
    if (savedContent.heroLogo) document.getElementById('hero-logo-image').value = savedContent.heroLogo;
    if (savedContent.whatsapp) document.getElementById('whatsapp-number').value = savedContent.whatsapp;
    if (savedContent.email) document.getElementById('contact-email-admin').value = savedContent.email;
    if (savedContent.collectionTitle) document.getElementById('collection-title').value = savedContent.collectionTitle;
    if (savedContent.collectionSubtitle) document.getElementById('collection-subtitle').value = savedContent.collectionSubtitle;
}

function saveHomeContent() {
    const content = {
        title: document.getElementById('main-title').value,
        subtitle: document.getElementById('subtitle').value,
        heroBg: document.getElementById('hero-bg-image').value,
        heroLogo: document.getElementById('hero-logo-image').value,
        whatsapp: document.getElementById('whatsapp-number').value,
        email: document.getElementById('contact-email-admin').value
    };
    
    // Salvar conteúdo
    const existingContent = JSON.parse(localStorage.getItem('akron-content') || '{}');
    localStorage.setItem('akron-content', JSON.stringify({...existingContent, ...content}));
    
    showToast('Conteúdo da página inicial salvo com sucesso!', 'success');
}

function saveCollectionContent() {
    const content = {
        collectionTitle: document.getElementById('collection-title').value,
        collectionSubtitle: document.getElementById('collection-subtitle').value
    };
    
    // Salvar conteúdo
    const existingContent = JSON.parse(localStorage.getItem('akron-content') || '{}');
    localStorage.setItem('akron-content', JSON.stringify({...existingContent, ...content}));
    
    showToast('Conteúdo da coleção salvo com sucesso!', 'success');
}

function addProduct() {
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    const originalPrice = document.getElementById('product-original-price').value;
    const image1 = document.getElementById('product-image1').value;
    const image2 = document.getElementById('product-image2').value;
    const category = document.getElementById('product-category').value;
    const colors = document.getElementById('product-colors').value;
    const showInCollection = document.getElementById('show-in-collection').checked;
    
    if (!name || !description || !price || !image1) {
        showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    const newProduct = {
        id: Date.now(),
        name,
        description,
        price,
        originalPrice: originalPrice || null,
        image: image1,
        image2: image2 || null,
        category,
        colors: colors ? colors.split(',').map(c => c.trim()) : [],
        showInCollection
    };
    
    // Salvar no localStorage
    let products = JSON.parse(localStorage.getItem('akron-products') || '[]');
    products.push(newProduct);
    localStorage.setItem('akron-products', JSON.stringify(products));
    
    // Limpar formulário
    document.getElementById('product-name').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-original-price').value = '';
    document.getElementById('product-image1').value = '';
    document.getElementById('product-image2').value = '';
    document.getElementById('product-colors').value = '';
    document.getElementById('show-in-collection').checked = false;
    
    loadProductsList();
    
    // ATUALIZAR CATÁLOGO EM TEMPO REAL
    if (typeof refreshCatalog === 'function') {
        refreshCatalog();
    }
    
    showToast('Produto adicionado com sucesso! Catálogo atualizado.', 'success');
}

function loadProductsList() {
    const customProducts = JSON.parse(localStorage.getItem('akron-products') || '[]');
    const container = document.getElementById('products-list');
    
    if (customProducts.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center">Nenhum produto cadastrado.</p>';
        return;
    }
    
    container.innerHTML = customProducts.map(product => `
        <div class="border border-gray-300 rounded-lg p-4 flex items-center space-x-4">
            <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded">
            <div class="flex-1">
                <h3 class="font-bold text-sm">${product.name}</h3>
                <p class="text-xs text-gray-600">${product.description}</p>
                <p class="text-sm font-bold text-red-600">${product.price}</p>
                <p class="text-xs text-gray-500">Categoria: ${product.category} ${product.showInCollection ? '| Na Coleção' : ''}</p>
            </div>
            <button 
                onclick="removeProduct(${product.id})"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-xs"
            >
                REMOVER
            </button>
        </div>
    `).join('');
}

function loadCollectionProductsList() {
    const allProducts = getAllProducts();
    const container = document.getElementById('collection-products-list');
    
    if (allProducts.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center">Nenhum produto cadastrado.</p>';
        return;
    }
    
    container.innerHTML = allProducts.map(product => `
        <div class="border border-gray-300 rounded-lg p-4 flex items-center space-x-4">
            <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded">
            <div class="flex-1">
                <h3 class="font-bold text-sm">${product.name}</h3>
                <p class="text-xs text-gray-600">${product.description}</p>
                <p class="text-sm font-bold text-red-600">${product.price}</p>
            </div>
            <label class="flex items-center">
                <input 
                    type="checkbox" 
                    ${product.showInCollection ? 'checked' : ''} 
                    onchange="toggleProductInCollection(${product.id}, this.checked)"
                    class="mr-2"
                >
                <span class="text-xs">Na Coleção</span>
            </label>
        </div>
    `).join('');
}

function toggleProductInCollection(productId, showInCollection) {
    let customProducts = JSON.parse(localStorage.getItem('akron-products') || '[]');
    const productIndex = customProducts.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        customProducts[productIndex].showInCollection = showInCollection;
        localStorage.setItem('akron-products', JSON.stringify(customProducts));
    }
    
    // ATUALIZAR COLEÇÃO EM TEMPO REAL
    if (typeof loadCollectionProducts === 'function') {
        loadCollectionProducts();
    }
    
    showToast(`Produto ${showInCollection ? 'adicionado na' : 'removido da'} coleção!`, 'success');
}

function removeProduct(id) {
    let products = JSON.parse(localStorage.getItem('akron-products') || '[]');
    products = products.filter(p => p.id !== id);
    localStorage.setItem('akron-products', JSON.stringify(products));
    loadProductsList();
    
    // ATUALIZAR CATÁLOGO EM TEMPO REAL
    if (typeof refreshCatalog === 'function') {
        refreshCatalog();
    }
    if (typeof loadCollectionProducts === 'function') {
        loadCollectionProducts();
    }
    
    showToast('Produto removido com sucesso!', 'success');
}
