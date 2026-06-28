document.addEventListener('DOMContentLoaded', () => {

  // --- STATE ---
  let selectedColor = 'Charcoal Grey';
  let selectedSize = 'S';
  let quantity = 1;
  let cartCount = 0;

  // --- SELECTORS ---
  // Quantity
  const qtyMinusBtn = document.getElementById('qty-minus');
  const qtyPlusBtn = document.getElementById('qty-plus');
  const qtyInput = document.getElementById('qty-val');

  // Swatches (Color)
  const swatches = document.querySelectorAll('.swatch');
  const selectedColorText = document.getElementById('selected-color-name');
  const galleryImages = document.querySelectorAll('.gallery-slide img');
  const stickyThumb = document.getElementById('sticky-thumb');

  // Sizes
  const sizeButtons = document.querySelectorAll('.size-btn:not(.disabled)');
  const selectedSizeText = document.getElementById('selected-size-name');

  // Sticky CTA
  const stickyCta = document.getElementById('sticky-cta');
  const mainAddToCartBtn = document.getElementById('add-to-cart-btn');
  const stickyAddToCartBtn = document.getElementById('sticky-add-btn');
  const stickyVariantSummary = document.getElementById('sticky-variant-summary');

  // Cart Header Icon
  const cartIconBadge = document.querySelector('.cart-count');

  // Size Guide Modal
  const openSizeGuideBtn = document.getElementById('open-size-guide');
  const closeSizeGuideBtn = document.getElementById('close-size-guide');
  const sizeGuideModal = document.getElementById('size-guide-modal');

  // Accordions
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  // Lightbox
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeLightboxBtn = document.getElementById('close-lightbox');
  const gallerySlides = document.querySelectorAll('.gallery-slide');

  // Mobile Carousel Dots
  const galleryWrapper = document.getElementById('gallery-wrapper');
  const carouselDots = document.querySelectorAll('.dot');


  // --- QUANTITY SELECTOR ---
  qtyMinusBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      qtyInput.value = quantity;
    }
  });

  qtyPlusBtn.addEventListener('click', () => {
    quantity++;
    qtyInput.value = quantity;
  });


  // --- COLOR FILTERS (to simulate variants) ---
  const colorFilters = {
    'Charcoal Grey': 'none',
    'Off-White': 'sepia(0.12) brightness(1.6) contrast(0.9) saturate(0.12)',
    'Olive Green': 'hue-rotate(50deg) sepia(0.3) saturate(0.85) brightness(0.7)'
  };

  function updateColorFilter(color) {
    const filterValue = colorFilters[color] || 'none';
    galleryImages.forEach(img => {
      img.style.filter = filterValue;
    });
    if (stickyThumb) {
      stickyThumb.style.filter = filterValue;
    }
    if (lightboxImg) {
      lightboxImg.style.filter = filterValue;
    }
  }


  // --- SWATCH SELECTOR ---
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      
      selectedColor = swatch.getAttribute('data-color');
      selectedColorText.textContent = selectedColor;
      
      updateColorFilter(selectedColor);
      updateVariantSummary();
    });
  });


  // --- SIZE SELECTOR ---
  sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      selectedSize = btn.getAttribute('data-size');
      selectedSizeText.textContent = selectedSize;
      
      updateVariantSummary();
    });
  });

  function updateVariantSummary() {
    const text = `${selectedColor} / ${selectedSize}`;
    if (stickyVariantSummary) {
      stickyVariantSummary.textContent = text;
    }
  }


  // --- SIZE GUIDE MODAL ---
  function openModal() {
    sizeGuideModal.classList.add('active');
    sizeGuideModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeModal() {
    sizeGuideModal.classList.remove('active');
    sizeGuideModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openSizeGuideBtn.addEventListener('click', openModal);
  closeSizeGuideBtn.addEventListener('click', closeModal);
  sizeGuideModal.addEventListener('click', (e) => {
    if (e.target === sizeGuideModal) {
      closeModal();
    }
  });

  // Handle escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
    }
  });


  // --- ACCORDIONS ---
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = header.nextElementSibling;
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Toggle state
      header.setAttribute('aria-expanded', !isExpanded);
      content.setAttribute('aria-hidden', isExpanded);
      item.classList.toggle('active');

      if (isExpanded) {
        content.style.maxHeight = '0px';
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });


  // --- STICKY CTA SCROLL OBSERVER ---
  if ('IntersectionObserver' in window && mainAddToCartBtn) {
    const observerOptions = {
      root: null,
      threshold: 0,
      rootMargin: '-80px 0px 0px 0px' // Offset for the top header height
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // When main buy button is NOT intersecting (scrolled out of view), show sticky bar
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          stickyCta.classList.add('visible');
        } else {
          stickyCta.classList.remove('visible');
        }
      });
    }, observerOptions);

    observer.observe(mainAddToCartBtn);
  }


  // --- ADD TO CART ACTIONS (Main & Sticky) ---
  function simulateAddToCart(btn) {
    if (btn.classList.contains('loading')) return;

    btn.classList.add('loading');
    const btnText = btn.querySelector('.btn-text') || btn.querySelector('span');
    const spinner = btn.querySelector('.spinner-container');
    
    const originalText = btnText.textContent;
    
    // Hide text, show spinner
    btnText.style.opacity = '0';
    if (spinner) spinner.classList.remove('hidden');

    setTimeout(() => {
      // Hide spinner, show checkmark/added
      if (spinner) spinner.classList.add('hidden');
      btnText.style.opacity = '1';
      btnText.textContent = 'Added to Cart ✓';
      btn.style.backgroundColor = '#1F7547'; // Green background for success
      btn.style.borderColor = '#1F7547';
      
      // Update cart count
      cartCount += quantity;
      cartIconBadge.textContent = cartCount;
      cartIconBadge.style.transform = 'scale(1.2)';
      setTimeout(() => {
        cartIconBadge.style.transform = 'scale(1)';
      }, 200);

      // Reset button state
      setTimeout(() => {
        btnText.textContent = originalText;
        btn.classList.remove('loading');
        btn.style.backgroundColor = ''; // Reset to default CSS values
        btn.style.borderColor = '';
      }, 2000);

    }, 1500);
  }

  if (mainAddToCartBtn) {
    mainAddToCartBtn.addEventListener('click', () => {
      simulateAddToCart(mainAddToCartBtn);
    });
  }

  if (stickyAddToCartBtn) {
    stickyAddToCartBtn.addEventListener('click', () => {
      simulateAddToCart(stickyAddToCartBtn);
    });
  }


  // --- ZOOM LIGHTBOX ---
  gallerySlides.forEach(slide => {
    slide.addEventListener('click', () => {
      const img = slide.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.style.filter = img.style.filter; // Keep variant filter
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    if (!sizeGuideModal.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  closeLightboxBtn.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });


  // --- MOBILE CAROUSEL SCROLL HANDLING ---
  if (galleryWrapper) {
    galleryWrapper.addEventListener('scroll', () => {
      // Find which slide is active based on scroll position
      const slideWidth = galleryWrapper.offsetWidth;
      if (slideWidth > 0) {
        const activeIndex = Math.round(galleryWrapper.scrollLeft / slideWidth);
        carouselDots.forEach((dot, index) => {
          if (index === activeIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    });

    // Carousel dots click navigation
    carouselDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'), 10);
        const slideWidth = galleryWrapper.offsetWidth;
        galleryWrapper.scrollTo({
          left: slideWidth * index,
          behavior: 'smooth'
        });
      });
    });
  }

});
