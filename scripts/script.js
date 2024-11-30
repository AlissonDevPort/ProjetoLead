document.addEventListener("DOMContentLoaded", () => {
  initLeadForm();
  initPhoneMask();
  initThumbnails();
  initGalleryModal();
  initBannerNavigation();
  swiperMentional();
  updateCountdown();
});

/** Variaveis globais */
let carouselIndex = 0;
let currentImageIndex = 0;
let countdownTime = 5 * 60;
const images = ["assets/chair.jpg", "assets/chair2.jpg", "assets/chair3.jpg"];
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const ctaButton = document.getElementById("cta-button");

/** Sliders com inicialização glboal */
let slider = document.querySelector(".slider");
let innerSlider = document.querySelector(".slider-inner");

let pressed = false;
let startx;
let x;

/**
 * Listener para adicionar classe ao header
 */
function scrollHeaderDetected() {
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 0) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}
scrollHeaderDetected();

/**
 * Função para swipe do mentinal
 */
function swiperMentional() {
  slider.addEventListener("mousedown", (e) => {
    pressed = true;
    startx = e.pageX - innerSlider.offsetLeft;
    slider.style.cursor = "grabbing";
  });

  slider.addEventListener("mouseenter", () => {
    slider.style.cursor = "grab";
  });

  slider.addEventListener("mouseup", () => {
    pressed = false;
    slider.style.cursor = "grab";
  });

  slider.addEventListener("mouseleave", () => {
    pressed = false;
    slider.style.cursor = "default";
  });

  slider.addEventListener("mousemove", (e) => {
    if (!pressed) return;
    e.preventDefault();

    x = e.pageX;
    innerSlider.style.left = `${x - startx}px`;

    checkBoundary();
  });

  slider.addEventListener("touchstart", (e) => {
    pressed = true;
    startx = e.touches[0].pageX - innerSlider.offsetLeft;
  });

  slider.addEventListener("touchend", () => {
    pressed = false;
  });

  slider.addEventListener("touchmove", (e) => {
    if (!pressed) return;

    x = e.touches[0].pageX;
    innerSlider.style.left = `${x - startx}px`;

    checkBoundary();
  });
}
/**
 * Garantir que o slider não saia dos limites
 */
function checkBoundary() {
  const outer = slider.getBoundingClientRect();
  const inner = innerSlider.getBoundingClientRect();

  if (parseInt(innerSlider.style.left) > 0) {
    innerSlider.style.left = "0px";
  } else if (inner.right < outer.right) {
    innerSlider.style.left = `-${inner.width - outer.width}px`;
  }
}
swiperMentional();

/**
 * Inicializa o formulário de captura de leads.
 */
function initLeadForm() {
  const form = document.getElementById("form");
  const leadForm = document.getElementById("lead-form");
  const productPage = document.getElementById("product-page");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;

    leadForm.classList.add("d-none");
    productPage.classList.remove("d-none");

    displayWelcomeMessage(name);
  });
}

/**
 * Exibe a mensagem de boas-vindas na página de produto.
 * @param {string} name - Nome do usuário.
 */
function displayWelcomeMessage(name) {
  const welcomeMessage = document.getElementById("welcome-message");
  if (welcomeMessage) {
    welcomeMessage.textContent = `Bem-vindo, ${name}!`;
  }
}

/**
 * Adiciona máscara ao campo de telefone.
 */
function initPhoneMask() {
  const phoneInput = document.getElementById("phone");

  phoneInput.addEventListener("input", (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const formatted = value.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    e.target.value = formatted.slice(0, 15); // Limita a 15 caracteres

    if (!validatePhone(value)) {
      e.target.setCustomValidity("Número de telefone inválido.");
      e.target.reportValidity();
    } else {
      e.target.setCustomValidity("");
    }
  });
}

/**
 * Verifica se o número possui o formato (XX) XXXXX-XXXX, onde X é um número.
 * @param {string} value
 * @returns {boolean}
 */
function validatePhone(value) {
  const phoneRegex = /^[0-9]{2}[0-9]{5}[0-9]{4}$/;
  return phoneRegex.test(value);
}

function updateAllComponents() {
  updateBannerImage();
  updateThumbnails();
  updateModalImage();
}

/**
 * Atualiza a imagem do banner principal.
 */
function updateBannerImage() {
  const bannerImage = document.getElementById("banner-image");
  const imageIndexDisplay = document.getElementById("image-index");
  const indexNumber = imageIndexDisplay.querySelector("span");

  bannerImage.setAttribute("src", images[currentImageIndex]);
  indexNumber.textContent = `0${currentImageIndex + 1}`;
  imageIndexDisplay.innerHTML = `${indexNumber.outerHTML} / 0${images.length}`;
}

/**
 * Atualiza o estado das miniaturas (destacando a imagem atual).
 */
function updateThumbnails() {
  const thumbnails = document.querySelectorAll(".miniature");
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.classList.toggle("active", index === currentImageIndex);
  });
}

/**
 * Atualiza a imagem no modal.
 */
function updateModalImage() {
  const modalContent = document.querySelector(".modal-overlay img");
  if (modalContent) {
    modalContent.setAttribute("src", images[currentImageIndex]);
  }
}

/**
 * Inicializa a navegação do banner principal.
 */

function initBannerNavigation() {
  const prevButton = document.getElementById("prev-banner");
  const nextButton = document.getElementById("next-banner");

  prevButton.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateAllComponents();
  });

  nextButton.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateAllComponents();
  });

  updateBannerImage();
}

/**
 * Inicializa o comportamento de troca de thumbnails.
 */
function initThumbnails() {
  const thumbnails = document.querySelectorAll(".miniature");

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => {
      currentImageIndex = index; // Atualiza o índice global
      updateAllComponents(); // Atualiza todos os componentes
    });
  });

  updateThumbnails();
}

/**
 * Inicializa o modal da galeria de imagens com funcionalidade de navegação.
 */
function initGalleryModal() {
  const galleryImages = document.querySelectorAll(".gallery-image");
  const modalOverlay = createModalOverlay();
  const nextButton = modalOverlay.querySelector(".modal-next");
  const prevButton = modalOverlay.querySelector(".modal-prev");

  const showModal = (index) => {
    currentImageIndex = index;
    updateModalImage(); // Atualiza a imagem no modal
    modalOverlay.style.display = "flex";
  };

  galleryImages.forEach((image, index) => {
    image.addEventListener("click", () => {
      showModal(index);
    });
  });

  nextButton.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateAllComponents();
  });

  prevButton.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateAllComponents();
  });

  updateModalImage();
}

/**
 * Cria o modal overlay para a galeria de imagens com navegação.
 * @returns {HTMLElement} - Elemento do modal overlay.
 */
function createModalOverlay() {
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");

  const modalContent = document.createElement("img");
  const closeModal = document.createElement("span");
  const nextButton = document.createElement("button");
  const prevButton = document.createElement("button");

  closeModal.classList.add("close-modal");
  closeModal.textContent = "×";

  nextButton.classList.add("modal-next");
  nextButton.textContent = ">";
  prevButton.classList.add("modal-prev");
  prevButton.textContent = "<";

  modalOverlay.appendChild(modalContent);
  modalOverlay.appendChild(closeModal);
  modalOverlay.appendChild(nextButton);
  modalOverlay.appendChild(prevButton);
  document.body.appendChild(modalOverlay);

  closeModal.addEventListener("click", () => {
    modalOverlay.style.display = "none";
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = "none";
    }
  });

  return modalOverlay;
}
/*
 * Função para atualizar a contagem regressiva
 */
function updateCountdown() {
  const minutes = Math.floor(countdownTime / 60);
  const seconds = countdownTime % 60;

  minutesElement.textContent = minutes < 10 ? "0" + minutes : minutes;
  secondsElement.textContent = seconds < 10 ? "0" + seconds : seconds;

  if (countdownTime <= 0) {
    clearInterval(countdownInterval);
    ctaButton.disabled = true;
    ctaButton.textContent = "Promoção Expirada";
    ctaButton.style.backgroundColor = "#e5a39c";
  }

  countdownTime--;
}
const countdownInterval = setInterval(updateCountdown, 1000);
