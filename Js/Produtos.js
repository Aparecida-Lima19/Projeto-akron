
// Funções de produtos
function getAllProducts() {
    const customProducts = JSON.parse(localStorage.getItem('akron-products') || '[]');
    return customProducts;
}

function getBadgeClass(category) {
    switch(category) {
        case 'new': return 'bg-red-600';
        case 'limited': return 'bg-purple-600';
        case 'sale': return 'bg-green-600';
        default: return 'bg-red-600';
    }
}

function getBadgeText(category) {
    switch(category) {
        case 'new': return 'NOVO';
        case 'limited': return 'LIMITADA';
        case 'sale': return 'PROMOÇÃO';
        default: return 'NOVO';
    }
}

function createImageGallery(images, productName) {
    if (!images || images.length === 0) return '';
    if (images.length === 1) {
        return `<img src="${images[0]}" alt="${productName}" class="w-full h-auto product-image" onclick="openImageModal('${images[0]}')" />`;
    }

    return `
        <div class="product-image-container">
            <div class="product-images" id="images-${Date.now()}">
                ${images.map(img => `<img src="${img}" alt="${productName}" class="product-image" onclick="openImageModal('${img}')" />`).join('')}
            </div>
            <div class="image-indicators">
                ${images.map((_, index) => `<div class="indicator ${index === 0 ? 'active' : ''}" onclick="switchImage(this, ${index})"></div>`).join('')}
            </div>
        </div>
    `;
}

function switchImage(indicator, index) {
    const container = indicator.parentElement.parentElement;
    const imagesDiv = container.querySelector('.product-images');
    const indicators = container.querySelectorAll('.indicator');
    
    // Remove active class from all indicators
    indicators.forEach(ind => ind.classList.remove('active'));
    // Add active class to clicked indicator
    indicator.classList.add('active');
    
    // Move images
    imagesDiv.style.transform = `translateX(-${index * 100}%)`;
}

function createProductCard(product, isCollection = false) {
    const images = [];
    if (product.image) images.push(product.image);
    if (product.image2) images.push(product.image2);

    const colorsHtml = product.colors ? product.colors.map(color => 
        `<span class="w-4 h-4 rounded-full border-2 border-gray-300 inline-block mx-1 cursor-pointer hover:scale-110 transition-transform" style="background-color: ${color}" title="${color}"></span>`
    ).join('') : '';

    const priceHtml = product.originalPrice ? 
        `<div>
            <span class="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            <span class="text-lg font-bold text-red-600 ml-2">${product.price}</span>
        </div>` :
        `<span class="text-lg font-bold text-black">${product.price}</span>`;

    const buttonClass = product.category === 'sale' ? 
        'bg-red-600 hover:bg-red-700 text-white' : 
        'bg-black text-white hover:bg-gray-800';

    const buttonSize = isCollection ? 'px-6 py-3' : 'px-4 py-2';
    const buttonText = isCollection ? 'COMPRAR AGORA' : 'COMPRAR';

    return `
        <div class="product-card bg-white rounded-lg overflow-hidden transition duration-300 border-2 border-black hover:border-red-600" data-category="${product.category}">
            <div class="relative">
                ${createImageGallery(images, product.name)}
                <div class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white ${getBadgeClass(product.category)}">
                    ${getBadgeText(product.category)}
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-black mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">${product.description}</p>
                ${colorsHtml ? `<div class="flex justify-center mb-4">${colorsHtml}</div>` : ''}
                <div class="flex justify-between items-center">
                    ${priceHtml}
                    <button 
                        onclick="handlePurchase('${product.name}')"
                        class="${buttonClass} ${buttonSize} rounded-md font-bold transition transform hover:scale-105"
                    >
                        ${buttonText}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function loadCollectionProducts() {
    const products = getAllProducts().filter(p => p.showInCollection);
    const container = document.getElementById('collection-products');
    if (container) {
        if (products.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 col-span-full">Nenhum produto adicionado à coleção ainda.</p>';
        } else {
            container.innerHTML = products.map(product => createProductCard(product, true)).join('');
        }
    }
}

function loadCatalogProducts() {
    const products = getAllProducts();
    const container = document.getElementById('catalog-products-grid');
    if (container) {
        if (products.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 col-span-full">Nenhum produto cadastrado ainda.</p>';
        } else {
            container.innerHTML = products.map(product => createProductCard(product)).join('');
        }
    }
}

// Funções de filtro do catálogo - CORRIGIDA
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card[data-category]');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Resetar estilos dos botões
    filterBtns.forEach(btn => {
        btn.className = 'filter-btn bg-gray-200 text-black px-6 py-2 rounded-md font-bold transition hover:bg-gray-300';
    });
    
    // Destacar botão ativo - buscar o botão clicado
    const activeBtn = Array.from(filterBtns).find(btn => 
        btn.getAttribute('onclick').includes(`'${category}'`)
    );
    if (activeBtn) {
        activeBtn.className = 'filter-btn bg-red-600 text-white px-6 py-2 rounded-md font-bold transition hover:bg-red-700';
    }
    
    // Filtrar produtos
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Função para recarregar catálogo após adicionar produto
function refreshCatalog() {
    loadCatalogProducts();
}
