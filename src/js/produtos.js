// products.js

// --- USUÁRIO: CATÁLOGO E COLEÇÃO ---

function loadProductsToPage(containerId, filterCategory = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const products = getProductsFromStorage();
  container.innerHTML = '';

  const filtered = filterCategory && filterCategory !== 'all'
    ? products.filter(p => p.category === filterCategory)
    : products;

  if (filtered.length === 0) {
    container.innerHTML = '<p class="text-gray-600">Nenhum produto encontrado.</p>';
    return;
  }

  filtered.forEach(product => {
    const div = document.createElement('div');
    div.className = 'border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition';

    div.innerHTML = `
      <img src="${product.image1}" alt="${product.name}" class="w-full h-64 object-cover cursor-pointer" onclick="openImageModal('${product.image1}')">
      <div class="p-4">
        <h3 class="text-xl font-bold mb-2">${product.name}</h3>
        <p class="text-gray-600 mb-2">${product.description}</p>
        <div class="flex items-center space-x-2">
          ${product.originalPrice ? `<span class="line-through text-sm text-gray-500">${product.originalPrice}</span>` : ''}
          <span class="text-lg font-bold text-red-600">${product.price}</span>
        </div>
      </div>
    `;

    container.appendChild(div);
  });
}

function filterProducts(category) {
  loadProductsToPage('catalog-products-grid', category);
}

// --- ADMIN: CRUD DE PRODUTOS ---

function addProduct() {
  const name = document.getElementById('product-name').value.trim();
  const description = document.getElementById('product-description').value.trim();
  const price = document.getElementById('product-price').value.trim();
  const originalPrice = document.getElementById('product-original-price').value.trim();
  const image1 = document.getElementById('product-image1').value.trim();
  const image2 = document.getElementById('product-image2').value.trim();
  const category = document.getElementById('product-category').value;
  const colors = document.getElementById('product-colors').value.trim();
  const showInCollection = document.getElementById('show-in-collection').checked;

  if (!name || !price || !image1) {
    showToast('Preencha os campos obrigatórios: nome, preço e imagem!', 'error');
    return;
  }

  const products = getProductsFromStorage();
  products.push({ name, description, price, originalPrice, image1, image2, category, colors, showInCollection });

  localStorage.setItem('akron-products', JSON.stringify(products));
  showToast('Produto adicionado com sucesso!', 'success');

  // Reset
  document.querySelectorAll('#product-name, #product-description, #product-price, #product-original-price, #product-image1, #product-image2, #product-colors').forEach(el => el.value = '');
  document.getElementById('show-in-collection').checked = false;

  loadProductsList();
  loadCollectionProductsList();
}

function loadProductsList() {
  const list = document.getElementById('products-list');
  if (!list) return;

  const products = getProductsFromStorage();
  list.innerHTML = '';

  if (products.length === 0) {
    list.innerHTML = '<p class="text-gray-600">Nenhum produto cadastrado.</p>';
    return;
  }

  products.forEach((product, index) => {
    const div = document.createElement('div');
    div.className = 'bg-gray-100 p-4 rounded-lg border flex justify-between items-center';

    div.innerHTML = `
      <div>
        <h4 class="font-bold">${product.name}</h4>
        <p class="text-sm text-gray-600">${product.description}</p>
        <p class="text-sm">Preço: <strong>${product.price}</strong></p>
        ${product.originalPrice ? `<p class="text-xs text-gray-500">De: ${product.originalPrice}</p>` : ''}
      </div>
      <button onclick="deleteProduct(${index})" class="text-red-600 hover:text-red-800 text-sm font-bold">Remover</button>
    `;

    list.appendChild(div);
  });
}

function deleteProduct(index) {
  const products = getProductsFromStorage();
  products.splice(index, 1);
  localStorage.setItem('akron-products', JSON.stringify(products));
  showToast('Produto removido!', 'success');

  loadProductsList();
  loadCollectionProductsList();
}

function loadCollectionProductsList() {
  const list = document.getElementById('collection-products-list');
  const collectionGrid = document.getElementById('collection-products');
  const products = getProductsFromStorage().filter(p => p.showInCollection);

  if (list) {
    list.innerHTML = '';
    products.forEach((product, i) => {
      const div = document.createElement('div');
      div.className = 'bg-white p-4 border rounded shadow-sm';
      div.innerHTML = `
        <h4 class="font-bold">${product.name}</h4>
        <p class="text-sm text-gray-600">${product.description}</p>
        <p class="text-sm font-bold text-red-600">${product.price}</p>
      `;
      list.appendChild(div);
    });
  }

  if (collectionGrid) {
    collectionGrid.innerHTML = '';
    products.forEach(product => {
      const item = document.createElement('div');
      item.className = 'border rounded-lg overflow-hidden shadow';

      item.innerHTML = `
        <img src="${product.image1}" alt="${product.name}" class="w-full h-64 object-cover cursor-pointer" onclick="openImageModal('${product.image1}')">
        <div class="p-4">
          <h3 class="text-xl font-bold">${product.name}</h3>
          <p class="text-gray-600 mb-2">${product.description}</p>
          <div class="text-lg text-red-600 font-bold">${product.price}</div>
        </div>
      `;

      collectionGrid.appendChild(item);
    });
  }
}

// --- UTILITÁRIOS ---

function getProductsFromStorage() {
  return JSON.parse(localStorage.getItem('akron-products') || '[]');
}
