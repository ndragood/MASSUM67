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
  const registerState = document.getElementById('upload-register-state');
  const formState = document.getElementById('upload-form-state');
  const progressState = document.getElementById('upload-progress-state');
  const successState = document.getElementById('upload-success-state');
  const progressText = document.getElementById('upload-progress-text');

  const linkToRegister = document.getElementById('link-to-register');
  const linkToLogin = document.getElementById('link-to-login');

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

  // === Navbar Profile Elements ===
  const navLoginBtn = document.getElementById('nav-login-btn');
  const navUserBtn = document.getElementById('nav-user-btn');
  const navUserName = document.getElementById('nav-user-name');
  const navUserAvatar = document.getElementById('nav-user-avatar');
  const navProfileDropdown = document.getElementById('nav-profile-dropdown');
  const navLogoutBtn = document.getElementById('nav-logout-btn');

  if (navLoginBtn) {
    navLoginBtn.addEventListener('click', () => {
      openModal();
      showState(loginState);
    });
  }

  if (navUserBtn && navProfileDropdown) {
    navUserBtn.addEventListener('click', () => {
      navProfileDropdown.style.display = navProfileDropdown.style.display === 'none' ? 'block' : 'none';
    });
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!navUserBtn.contains(e.target) && !navProfileDropdown.contains(e.target)) {
        navProfileDropdown.style.display = 'none';
      }
    });
  }

  // === Admin Dashboard Logic ===
  const adminModal = document.getElementById('admin-modal');
  const adminModalClose = document.getElementById('admin-modal-close');
  const adminModalOverlay = document.getElementById('admin-modal-overlay');
  const adminUserList = document.getElementById('admin-user-list');

  function closeAdminModal() {
    if (adminModal) adminModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (adminModalClose) adminModalClose.addEventListener('click', closeAdminModal);
  if (adminModalOverlay) adminModalOverlay.addEventListener('click', closeAdminModal);

  async function openAdminDashboard() {
    if (adminModal) {
      adminModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      navProfileDropdown.style.display = 'none';
      
      if (adminUserList) {
        adminUserList.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:16px;">Memuat data...</td></tr>';
        
        try {
          const snapshot = await db.collection('users').get();
          adminUserList.innerHTML = '';
          
          snapshot.forEach(doc => {
            const data = doc.data();
            const uid = doc.id;
            
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--outline-variant)';
            
            // Only allow changing if not super admin
            const isSuper = data.role === 'super_admin';
            let roleSelect = '';
            
            if (isSuper) {
              roleSelect = `<span class="label-sm" style="color:var(--primary); font-weight:700;">SUPER ADMIN</span>`;
            } else {
              roleSelect = `
                <select class="role-select body-sm" data-uid="${uid}" style="padding:4px 8px; border-radius:4px; border:1px solid var(--outline-variant); background:var(--surface);">
                  <option value="member" ${data.role === 'member' ? 'selected' : ''}>Member</option>
                  <option value="admin" ${data.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
              `;
            }

            tr.innerHTML = `
              <td style="padding:8px; font-size:14px; font-weight:600;">${data.name || '-'}</td>
              <td style="padding:8px; font-size:14px;">${data.email || '-'}</td>
              <td style="padding:8px; font-size:14px;">${roleSelect}</td>
              <td style="padding:8px; font-size:14px;">
                ${!isSuper ? `<button class="update-role-btn label-sm" data-uid="${uid}" style="padding:4px 12px; background:var(--primary); color:var(--on-primary); border:none; border-radius:4px; cursor:pointer;">Update</button>` : ''}
              </td>
            `;
            
            adminUserList.appendChild(tr);
          });
          
          // Attach update events
          document.querySelectorAll('.update-role-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
              const uid = e.target.getAttribute('data-uid');
              const select = document.querySelector(`.role-select[data-uid="${uid}"]`);
              const newRole = select.value;
              
              const originalText = e.target.textContent;
              e.target.textContent = 'Updating...';
              e.target.disabled = true;
              
              try {
                await db.collection('users').doc(uid).update({ role: newRole });
                alert('Role berhasil diupdate!');
              } catch (err) {
                console.error("Error updating role:", err);
                alert("Gagal update role: " + err.message);
              } finally {
                e.target.textContent = originalText;
                e.target.disabled = false;
              }
            });
          });

        } catch (err) {
          console.error("Error loading users:", err);
          adminUserList.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:16px; color:red;">Gagal memuat data</td></tr>';
        }
      }
    }
  }

  // Bind Dashboard button if exists
  const navAdminBtn = document.getElementById('nav-admin-dashboard-btn');
  if (navAdminBtn) {
    navAdminBtn.addEventListener('click', openAdminDashboard);
  }

  if (navLogoutBtn) {
    navLogoutBtn.addEventListener('click', async () => {
      try {
        await auth.signOut();
        navProfileDropdown.style.display = 'none';
        alert('Berhasil logout!');
      } catch (err) {
        console.error('Logout error:', err);
      }
    });
  }

  // === Auth State ===
  if (typeof auth !== 'undefined') {
    auth.onAuthStateChanged(async (user) => {
      currentUser = user;
      const openUploadBtn = document.getElementById('open-upload-modal');
      const navAdminBtn = document.getElementById('nav-admin-dashboard-btn');
      
      // Update Navbar
      if (user) {
        if (navLoginBtn) navLoginBtn.style.display = 'none';
        if (navUserBtn) navUserBtn.style.display = 'flex';
        
        const name = user.displayName || user.email.split('@')[0] || 'User';
        if (navUserName) navUserName.textContent = name;
        if (navUserAvatar) navUserAvatar.textContent = name.charAt(0).toUpperCase();

        // Check Role in Firestore
        try {
          const docRef = db.collection('users').doc(user.uid);
          let docSnap = await docRef.get();
          
          let role = 'member';
          if (docSnap.exists) {
            role = docSnap.data().role || 'member';
          }

          // Super Admin Hardcode Override
          if (user.email === 'bukabukagame456@gmail.com' && role !== 'super_admin') {
            await docRef.set({ role: 'super_admin', name: name, email: user.email }, { merge: true });
            role = 'super_admin';
          }

          user.role = role; // attach role to currentUser object

          // Toggle Upload Button Visibility
          if (openUploadBtn) {
            if (role === 'admin' || role === 'super_admin') {
              openUploadBtn.style.display = 'flex';
              document.body.classList.add('is-admin');
            } else {
              openUploadBtn.style.display = 'none';
              document.body.classList.remove('is-admin');
            }
          }

          // Toggle Admin Dashboard Button Visibility
          if (navAdminBtn) {
            if (role === 'super_admin') {
              navAdminBtn.style.display = 'flex';
            } else {
              navAdminBtn.style.display = 'none';
            }
          }

        } catch (err) {
          console.error("Error fetching user role:", err);
        }

      } else {
        if (navLoginBtn) navLoginBtn.style.display = 'flex';
        if (navUserBtn) navUserBtn.style.display = 'none';
        if (navProfileDropdown) navProfileDropdown.style.display = 'none';
        if (openUploadBtn) openUploadBtn.style.display = 'none';
        if (navAdminBtn) navAdminBtn.style.display = 'none';
        document.body.classList.remove('is-admin');
      }
    });
  }

  // === Modal States ===
  function showState(state) {
    [loginState, registerState, formState, progressState, successState].forEach(s => {
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

  if (linkToRegister) linkToRegister.addEventListener('click', (e) => { e.preventDefault(); showState(registerState); });
  if (linkToLogin) linkToLogin.addEventListener('click', (e) => { e.preventDefault(); showState(loginState); });

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
        
        // Cek role untuk UX redirect
        const docSnap = await db.collection('users').doc(currentUser.uid).get();
        let role = docSnap.exists ? (docSnap.data().role || 'member') : 'member';
        if (email === 'bukabukagame456@gmail.com') role = 'super_admin';

        if (role === 'admin' || role === 'super_admin') {
          showState(formState);
        } else {
          closeModal();
          alert('Berhasil login sebagai Member!');
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('Login gagal: ' + err.message);
      } finally {
        loginBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">login</span> Masuk';
        loginBtn.disabled = false;
      }
    });
  }

  // === Email/Password Register ===
  const registerBtn = document.getElementById('upload-register-btn');
  if (registerBtn) {
    registerBtn.addEventListener('click', async () => {
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-pass').value;

      if (!name || !email || !password) {
        return alert('Isi nama, email, dan password dulu ya bro untuk daftar!');
      }
      if (password.length < 6) {
        return alert('Password minimal 6 karakter bro!');
      }

      try {
        registerBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;animation:spin 1s linear infinite;">progress_activity</span> Loading...';
        registerBtn.disabled = true;

        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        await user.updateProfile({ displayName: name });
        
        // Save user role to Firestore (Default: member)
        await db.collection('users').doc(user.uid).set({
          name: name,
          email: email,
          role: 'member',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        currentUser = user;
        
        let initialRole = 'member';
        if (email === 'bukabukagame456@gmail.com') initialRole = 'super_admin';

        if (initialRole === 'super_admin') {
          showState(formState);
        } else {
          closeModal();
          alert('Berhasil daftar! Akun kamu berstatus MEMBER. Hubungi admin jika butuh akses upload foto.');
        }
      } catch (err) {
        console.error('Register error:', err);
        alert('Daftar gagal: ' + err.message);
      } finally {
        registerBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">person_add</span> Daftar Sekarang';
        registerBtn.disabled = false;
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
    if (file.size > 10 * 1024 * 1024) return alert('Max 10MB bro!');
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
          <button class="delete-photo-btn" data-id="${doc.id}">
            <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
          </button>
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

  // Inject Delete Button Styles
  const style = document.createElement('style');
  style.innerHTML = `
    .delete-photo-btn { display: none; position: absolute; top: 8px; right: 8px; background: rgba(220, 38, 38, 0.9); color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; z-index: 10; align-items: center; justify-content: center; backdrop-filter: blur(4px); transition: transform 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .delete-photo-btn:hover { transform: scale(1.1); background: rgba(239, 68, 68, 1); }
    body.is-admin .delete-photo-btn { display: flex; }
  `;
  document.head.appendChild(style);

  // Delegated Event Listener for Delete
  const masonryContainer = document.querySelector('#page-gallery .masonry');
  if (masonryContainer) {
    masonryContainer.addEventListener('click', async (e) => {
      const btn = e.target.closest('.delete-photo-btn');
      if (btn) {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (confirm("Yakin mau hapus foto ini dari gallery?")) {
          btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;animation:spin 1s linear infinite;">progress_activity</span>';
          try {
            await db.collection('gallery').doc(id).delete();
            const item = btn.closest('.masonry-item');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => item.remove(), 300);
          } catch (err) {
            console.error('Gagal hapus foto:', err);
            alert('Gagal menghapus foto: ' + err.message);
            btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;">delete</span>';
          }
        }
      }
    });
  }

  loadGalleryFromFirestore();
});
