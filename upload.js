// ===== UPLOAD & DYNAMIC GALLERY (Cloudinary + Firestore) =====
const CLOUDINARY_CLOUD = 'vlf1nj6q';
const CLOUDINARY_PRESET = 'boluwdqv';

document.addEventListener('DOMContentLoaded', () => {
  // === Elements ===
  const modal = document.getElementById('upload-modal');
  const btnOpen = document.getElementById('open-upload-modal');
  const btnClose = document.getElementById('upload-modal-close');
  const overlay = document.getElementById('upload-modal-overlay');

  const loginState = document.getElementById('upload-login-state');
  const formState = document.getElementById('upload-form-state');
  const progressState = document.getElementById('upload-progress-state');
  const successState = document.getElementById('upload-success-state');
  const progressText = document.getElementById('upload-progress-text');

  const loginBtn = document.getElementById('upload-login-btn');
  const cancelBtn = document.getElementById('upload-cancel');
  const submitBtn = document.getElementById('upload-submit');

  const uploadArea = document.getElementById('upload-area');
  const uploadInput = document.getElementById('upload-input');
  const uploadPreview = document.getElementById('upload-preview');
  const previewWrap = document.getElementById('upload-preview-wrap');
  const placeholder = document.getElementById('upload-placeholder');
  const removeBtn = document.getElementById('upload-remove');

  const titleInput = document.getElementById('upload-title');
  const catBtns = document.querySelectorAll('.upload-cat-btn');

  let selectedCategory = 'hangout';
  let currentUser = null;

  // === Auth State ===
  if (typeof auth !== 'undefined') {
    auth.onAuthStateChanged(user => {
      currentUser = user;
    });
  }

  // === Modal States ===
  function showState(state) {
    [loginState, formState, progressState, successState].forEach(s => {
      if (s) s.style.display = 'none';
    });
    if (state) state.style.display = '';
  }

  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    showState(currentUser ? formState : loginState);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    resetForm();
  }

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // === Email/Password Login ===
  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-pass').value;

      if (!email || !password) {
        return alert('Isi email dan password dulu ya bro!');
      }

      try {
        loginBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;animation:spin 1s linear infinite;">progress_activity</span> Loading...';
        loginBtn.disabled = true;

        await auth.signInWithEmailAndPassword(email, password);
        currentUser = auth.currentUser;
        showState(formState);
      } catch (err) {
        console.error('Login error:', err);
        alert('Login gagal: ' + err.message);
      } finally {
        loginBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">login</span> Masuk';
        loginBtn.disabled = false;
      }
    });
  }

  // === File Handling ===
  if (uploadArea) {
    uploadArea.addEventListener('click', (e) => {
      if (e.target.closest('.upload-dropzone__remove')) return;
      uploadInput.click();
    });
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
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
    if (!file.type.startsWith('image/')) return alert('Pilih file gambar ya!');
    if (file.size > 5 * 1024 * 1024) return alert('Max 5MB bro!');
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadPreview.src = e.target.result;
      previewWrap.style.display = '';
      placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      uploadInput.value = '';
      uploadPreview.src = '';
      previewWrap.style.display = 'none';
      placeholder.style.display = '';
    });
  }

  // === Category Picker ===
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCategory = btn.dataset.cat;
    });
  });

  // === Upload to Cloudinary + Save to Firestore ===
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      if (!uploadInput.files.length) return alert('Pilih foto dulu!');
      if (!currentUser) return alert('Login dulu!');

      const file = uploadInput.files[0];
      const caption = titleInput ? titleInput.value.trim() : '';

      try {
        showState(progressState);
        if (progressText) progressText.textContent = 'Uploading ke Cloudinary...';

        // 1. Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_PRESET);
        formData.append('folder', 'massum67');

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error('Upload ke Cloudinary gagal!');
        const data = await res.json();
        const imageUrl = data.secure_url;

        if (progressText) progressText.textContent = 'Menyimpan ke database...';

        // 2. Save metadata to Firestore
        await db.collection('gallery').add({
          imageUrl: imageUrl,
          caption: caption || 'Untitled',
          category: selectedCategory,
          uploadedBy: currentUser.displayName || currentUser.email,
          uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 3. Success!
        showState(successState);
        setTimeout(() => {
          closeModal();
          loadGalleryFromFirestore();
        }, 1500);

      } catch (err) {
        console.error('Upload error:', err);
        alert('Upload gagal: ' + err.message);
        showState(formState);
      }
    });
  }

  function resetForm() {
    if (uploadInput) uploadInput.value = '';
    if (uploadPreview) uploadPreview.src = '';
    if (previewWrap) previewWrap.style.display = 'none';
    if (placeholder) placeholder.style.display = '';
    if (titleInput) titleInput.value = '';
    catBtns.forEach(b => b.classList.remove('active'));
    if (catBtns[0]) catBtns[0].classList.add('active');
    selectedCategory = 'hangout';
  }

  // === Load Gallery from Firestore ===
  async function loadGalleryFromFirestore() {
    if (typeof db === 'undefined') return;
    try {
      const snapshot = await db.collection('gallery')
        .orderBy('uploadedAt', 'desc')
        .get();

      if (snapshot.empty) return;

      const masonry = document.querySelector('#page-gallery .masonry');
      if (!masonry) return;

      // Remove old dynamic items
      masonry.querySelectorAll('.masonry-item--dynamic').forEach(el => el.remove());

      snapshot.forEach(doc => {
        const d = doc.data();
        const item = document.createElement('div');
        item.className = 'masonry-item masonry-item--dynamic';
        item.setAttribute('data-gallery-item', d.category || 'hangout');
        item.innerHTML = `
          <img alt="${d.caption || ''}" src="${d.imageUrl}" loading="lazy" />
          <div class="masonry-item__overlay">
            <span class="masonry-item__label label-md">${(d.caption || '').toUpperCase()}</span>
          </div>
        `;
        masonry.prepend(item);
      });

      // Re-apply gallery filter
      const activeFilter = document.querySelector('[data-gallery-filter].active');
      if (activeFilter) activeFilter.click();

    } catch (err) {
      console.error('Load gallery error:', err);
    }
  }

  loadGalleryFromFirestore();
});
