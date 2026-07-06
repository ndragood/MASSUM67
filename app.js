/* ============================================
   MASSUM67 — App Logic (Router, Filters, Menu)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // === Theme Toggle ===
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const themeIcons = document.querySelectorAll('.theme-icon');
  
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcons.forEach(icon => icon.textContent = 'light_mode');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      themeIcons.forEach(icon => icon.textContent = 'dark_mode');
    }
  }

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('massum67_theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('massum67_theme', newTheme);
    });
  });

  // === Mobile Menu (declare first, used by navigate) ===
  const mobileToggle = document.querySelector('.navbar__mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-menu__overlay');
  const mobileClose = document.querySelector('.mobile-menu__close');

  function openMobileMenu() {
    if (mobileMenu) mobileMenu.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);


  // === Hash Router ===
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('[data-nav]');
  const mobileLinks = document.querySelectorAll('[data-mobile-nav]');

  function navigate(hash) {
    const target = hash.replace('#', '') || 'home';

    // Hide all pages
    pages.forEach(p => {
      p.classList.remove('active');
      p.style.animation = 'none';
    });

    // Show target page
    const targetPage = document.getElementById('page-' + target);
    if (targetPage) {
      void targetPage.offsetWidth; // Force reflow for animation restart
      targetPage.style.animation = '';
      targetPage.classList.add('active');
    }

    // Update nav active state
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-nav') === target);
    });

    // Update mobile nav active state
    mobileLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-mobile-nav') === target);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Close mobile menu if open
    closeMobileMenu();

    // Re-trigger reveal animations
    setTimeout(() => initRevealAnimations(), 100);
  }

  // Nav link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-nav');
      window.location.hash = target;
    });
  });

  // Mobile nav link clicks
  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-mobile-nav');
      window.location.hash = target;
    });
  });

  // Logo click -> home
  const logo = document.querySelector('.navbar__logo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.location.hash = 'home';
    });
  }

  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    navigate(window.location.hash);
  });

  // Initial load
  navigate(window.location.hash || '#home');


  // === Roster Filters ===
  const roleButtons = document.querySelectorAll('[data-role-filter]');
  const rankButtons = document.querySelectorAll('[data-rank-filter]');
  const memberCards = document.querySelectorAll('[data-member]');

  let activeRole = 'all';
  let activeRank = 'all';

  function filterRoster() {
    memberCards.forEach(card => {
      const role = card.getAttribute('data-role');
      const rank = card.getAttribute('data-rank');
      const matchRole = activeRole === 'all' || role === activeRole;
      const matchRank = activeRank === 'all' || rank === activeRank;

      if (matchRole && matchRank) {
        card.style.display = '';
        card.style.animation = 'fadeIn 0.3s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  }

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRole = btn.getAttribute('data-role-filter');
      filterRoster();
    });
  });

  rankButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      rankButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRank = btn.getAttribute('data-rank-filter');
      filterRoster();
    });
  });


  // === Gallery Filters ===
  const galleryButtons = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('[data-gallery-item]');

  galleryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-gallery-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-gallery-item');
        if (filter === 'all' || category === filter) {
          item.style.display = '';
          item.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });


  // === Scroll Reveal (Intersection Observer) ===
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal:not(.visible)');

    // First pass: immediately reveal elements already in viewport
    // (needed after page transitions from display:none)
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });

    // Second pass: observe remaining hidden elements
    const remaining = document.querySelectorAll('.reveal:not(.visible)');

    if ('IntersectionObserver' in window && remaining.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      remaining.forEach(el => observer.observe(el));
    } else {
      remaining.forEach(el => el.classList.add('visible'));
    }
  }

  initRevealAnimations();
});


// ===== UPLOAD MODAL LOGIC (Redesigned 2-Step) =====
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('upload-modal');
  const btnOpen = document.getElementById('open-upload-modal');
  const btnClose = document.getElementById('upload-modal-close');
  const btnCancel = document.getElementById('upload-modal-cancel');
  const overlay = document.getElementById('upload-modal-overlay');

  const step1 = document.getElementById('upload-step-1');
  const step2 = document.getElementById('upload-step-2');
  const btnNext = document.getElementById('upload-next');
  const btnBack = document.getElementById('upload-back');
  const btnSubmit = document.getElementById('upload-modal-submit');
  const progressDots = document.querySelectorAll('.upload-progress__dot');

  const uploadArea = document.getElementById('upload-area');
  const uploadInput = document.getElementById('upload-input');
  const uploadPreview = document.getElementById('upload-preview');
  const uploadPreviewWrap = document.getElementById('upload-preview-wrap');
  const uploadPlaceholder = document.getElementById('upload-placeholder');
  const uploadRemove = document.getElementById('upload-remove');

  const titleInput = document.getElementById('upload-title');
  const charCount = document.getElementById('upload-char-count');
  const catBtns = document.querySelectorAll('.upload-cat-btn');

  let selectedCategory = 'hangout';

  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    goToStep(1);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    resetForm();
  }

  function goToStep(n) {
    if (n === 1) {
      step1.style.display = '';
      step2.style.display = 'none';
      btnNext.style.display = '';
      btnBack.style.display = 'none';
      btnSubmit.style.display = 'none';
    } else {
      step1.style.display = 'none';
      step2.style.display = '';
      btnNext.style.display = 'none';
      btnBack.style.display = '';
      btnSubmit.style.display = '';
    }
    progressDots.forEach(d => {
      d.classList.toggle('active', parseInt(d.dataset.step) === n);
    });
  }

  // Open / Close
  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  // Step navigation
  if (btnNext) btnNext.addEventListener('click', () => goToStep(2));
  if (btnBack) btnBack.addEventListener('click', () => goToStep(1));

  // File selection
  if (uploadArea) {
    uploadArea.addEventListener('click', (e) => {
      if (e.target.closest('.upload-dropzone__remove')) return;
      uploadInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      if (e.dataTransfer.files.length > 0) {
        uploadInput.files = e.dataTransfer.files;
        handleFile(e.dataTransfer.files[0]);
      }
    });
  }

  if (uploadInput) {
    uploadInput.addEventListener('change', function () {
      if (this.files && this.files[0]) handleFile(this.files[0]);
    });
  }

  function handleFile(file) {
    if (!file.type.startsWith('image/')) return alert('Pilih file gambar ya bro!');
    if (file.size > 5 * 1024 * 1024) return alert('File terlalu besar! Maksimal 5MB.');
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadPreview.src = e.target.result;
      uploadPreviewWrap.style.display = '';
      uploadPlaceholder.style.display = 'none';
      btnNext.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  // Remove photo
  if (uploadRemove) {
    uploadRemove.addEventListener('click', (e) => {
      e.stopPropagation();
      uploadInput.value = '';
      uploadPreview.src = '';
      uploadPreviewWrap.style.display = 'none';
      uploadPlaceholder.style.display = '';
      btnNext.disabled = true;
    });
  }

  // Character counter
  if (titleInput) {
    titleInput.addEventListener('input', () => {
      charCount.textContent = titleInput.value.length + ' / 60';
    });
  }

  // Category picker
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCategory = btn.dataset.cat;
    });
  });

  // Submit
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      if (!uploadInput.files.length) return alert('Pilih foto dulu bro!');

      btnSubmit.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;animation:spin 1s linear infinite;">progress_activity</span> Uploading...';
      btnSubmit.disabled = true;

      setTimeout(() => {
        alert('Fitur Upload belum tersambung ke Database! Ini baru tampilannya saja. Nanti kita sambungkan ke Firebase.');
        btnSubmit.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;">cloud_upload</span> Upload Now';
        btnSubmit.disabled = false;
        closeModal();
      }, 1500);
    });
  }

  function resetForm() {
    if (uploadInput) uploadInput.value = '';
    if (uploadPreview) uploadPreview.src = '';
    if (uploadPreviewWrap) uploadPreviewWrap.style.display = 'none';
    if (uploadPlaceholder) uploadPlaceholder.style.display = '';
    if (titleInput) titleInput.value = '';
    if (charCount) charCount.textContent = '0 / 60';
    if (btnNext) btnNext.disabled = true;
    catBtns.forEach(b => b.classList.remove('active'));
    if (catBtns[0]) catBtns[0].classList.add('active');
    selectedCategory = 'hangout';
  }
});
