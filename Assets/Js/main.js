
// Variáveis globais
let currentZoom = 1;

// Funções de Toast
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Funções de modal de imagem
function openImageModal(imageSrc) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    modalImage.src = imageSrc;
    modal.style.display = 'flex';
    currentZoom = 1;
    modalImage.style.transform = 'scale(1)';
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
}

function zoomImage(factor) {
    currentZoom *= factor;
    if (currentZoom < 0.5) currentZoom = 0.5;
    if (currentZoom > 3) currentZoom = 3;
    
    const modalImage = document.getElementById('modal-image');
    modalImage.style.transform = `scale(${currentZoom})`;
}

function resetZoom() {
    currentZoom = 1;
    const modalImage = document.getElementById('modal-image');
    modalImage.style.transform = 'scale(1)';
}

// Funções de WhatsApp
function openWhatsApp() {
    const savedContent = JSON.parse(localStorage.getItem('akron-content') || '{}');
    const whatsappNumber = savedContent.whatsapp || '558191103194';
    const whatsappUrl = `https://wa.me/${whatsappNumber}`;
    window.open(whatsappUrl, '_blank');
}

function handlePurchase(product) {
    const savedContent = JSON.parse(localStorage.getItem('akron-content') || '{}');
    const whatsappNumber = savedContent.whatsapp || '558191103194';
    const message = `Olá! Tenho interesse na ${product}. Podem me ajudar?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Funções de formulário
function handleContactSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;
    
    if (!name || !email || !message) {
        showToast('Por favor, preencha todos os campos.', 'error');
        return;
    }

    const savedContent = JSON.parse(localStorage.getItem('akron-content') || '{}');
    const whatsappNumber = savedContent.whatsapp || '558191103194';
    const whatsappMessage = `Olá! Sou ${name}. Email: ${email}. Mensagem: ${message}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    window.open(whatsappUrl, '_blank');
    
    showToast('Redirecionando para o WhatsApp...', 'success');

    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-message').value = '';
}

function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('newsletter-email').value;
    
    if (!email) {
        showToast('Por favor, insira um e-mail válido.', 'error');
        return;
    }

    showToast('E-mail cadastrado na newsletter!', 'success');
    document.getElementById('newsletter-email').value = '';
}

// Navegação suave para seções
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Aplicar conteúdo salvo
    const savedContent = JSON.parse(localStorage.getItem('akron-content') || '{}');
    
    // Aplicar conteúdos salvos se existirem
    if (savedContent.heroBg && document.querySelector('.hero-bg')) {
        document.querySelector('.hero-bg').style.backgroundImage = `url('${savedContent.heroBg}')`;
    }
    
    if (savedContent.heroLogo && document.querySelector('.hero-logo')) {
        document.querySelector('.hero-logo').src = savedContent.heroLogo;
    }
    
    if (savedContent.title && document.querySelector('.hero-title')) {
        document.querySelector('.hero-title').innerHTML = `${savedContent.title.split(' ')[0]} <span class="text-red-600">OVER<span class="text-white">SIZED</span></span>`;
    }
    
    if (savedContent.subtitle && document.querySelector('.hero-subtitle')) {
        document.querySelector('.hero-subtitle').textContent = savedContent.subtitle;
    }
    
    if (savedContent.collectionTitle && document.querySelector('.collection-title')) {
        document.querySelector('.collection-title').textContent = savedContent.collectionTitle;
    }
    
    if (savedContent.collectionSubtitle && document.querySelector('.collection-subtitle')) {
        document.querySelector('.collection-subtitle').textContent = savedContent.collectionSubtitle;
    }
    
    if (savedContent.whatsapp && document.querySelector('.whatsapp-number')) {
        const formatted = `+55 (${savedContent.whatsapp.substring(2, 4)}) ${savedContent.whatsapp.substring(4, 9)}-${savedContent.whatsapp.substring(9)}`;
        document.querySelector('.whatsapp-number').textContent = formatted;
    }
    
    if (savedContent.email && document.querySelector('.contact-email')) {
        document.querySelector('.contact-email').textContent = savedContent.email;
        document.querySelector('.contact-email').href = `mailto:${savedContent.email}`;
    }

    // Fechar modal ao clicar fora da imagem
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeImageModal();
            }
        });
    }
});
