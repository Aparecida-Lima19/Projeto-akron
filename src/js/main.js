// main.js

// Modal de imagem
function openImageModal(src) {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');

  if (modal && modalImg) {
    modal.style.display = 'flex';
    modalImg.src = src;
    modalImg.style.transform = 'scale(1)';
  }
}

function closeImageModal() {
  const modal = document.getElementById('image-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Zoom da imagem
function zoomImage(factor) {
  const modalImg = document.getElementById('modal-image');
  if (modalImg) {
    const currentScale = parseFloat(modalImg.style.transform.replace('scale(', '').replace(')', '')) || 1;
    const newScale = Math.max(0.5, Math.min(3, currentScale * factor));
    modalImg.style.transform = `scale(${newScale})`;
  }
}

function resetZoom() {
  const modalImg = document.getElementById('modal-image');
  if (modalImg) {
    modalImg.style.transform = 'scale(1)';
  }
}

// Rolagem suave para seções
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Enviar formulário de contato
function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('contact-name')?.value.trim();
  const email = document.getElementById('contact-email')?.value.trim();
  const message = document.getElementById('contact-message')?.value.trim();

  if (!name || !email || !message) {
    showToast('Preencha todos os campos!', 'error');
    return;
  }

  // Simulação de envio
  showToast('Mensagem enviada com sucesso!', 'success');

  // Limpa o formulário
  document.getElementById('contact-name').value = '';
  document.getElementById('contact-email').value = '';
  document.getElementById('contact-message').value = '';
}

// Enviar newsletter
function handleNewsletterSubmit(event) {
  event.preventDefault();

  const emailInput = document.getElementById('newsletter-email');
  const email = emailInput?.value.trim();

  if (!email || !email.includes('@')) {
    showToast('Insira um e-mail válido!', 'error');
    return;
  }

  // Simulação de sucesso
  showToast('Inscrito com sucesso na newsletter!', 'success');
  emailInput.value = '';
}

// Toast reutilizável (se não estiver em admin.js)
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}
