
// Initialize Firebase services
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(window.firebaseConfig || {
            apiKey: "AIzaSyDEXAMPLEEXAMPLEEXAMPLE",
            authDomain: "your-project-id.firebaseapp.com",
            projectId: "your-project-id",
            storageBucket: "your-project-id.appspot.com",
            messagingSenderId: "1234567890",
            appId: "1:1234567890:web:abc123abc123abc123abc123"
        });
    }

    // Initialize services and make available globally
    window.auth = firebase.auth();
    window.db = firebase.firestore();
    window.storage = firebase.storage();

    // Verify services are available
    if (!window.auth || !window.db || !window.storage) {
        throw new Error('Firebase services failed to initialize');
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
    document.getElementById('generateForm')?.style.display = 'none';
    showAlert('Application failed to initialize. Please refresh the page.', 'danger');
    throw error; // Prevent further execution
}

// Wait for auth to be ready
const authReady = new Promise(resolve => {
    window.auth.onAuthStateChanged(() => resolve());
});

// Auth state observer (after initialization)
window.auth.onAuthStateChanged(user => {
    const authElements = document.querySelectorAll('.auth-only');
    const unauthElements = document.querySelectorAll('.unauth-only');
    
    if (user) {
        // User is signed in
        authElements.forEach(el => el.style.display = 'block');
        unauthElements.forEach(el => el.style.display = 'none');
        document.getElementById('userEmail').textContent = user.email;
        loadGallery(); // Refresh gallery with user's images
    } else {
        // User is signed out
        authElements.forEach(el => el.style.display = 'none');
        unauthElements.forEach(el => el.style.display = 'block');
    }
});

// Auth functions
// Enhanced auth functions with validation
async function handleLogin() {
    await authReady; // Wait for auth to initialize
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    
    // Validate inputs
    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'warning');
        return;
    }
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'warning');
        return;
    }

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        $('#authModal').modal('hide');
        document.getElementById('authForm').reset();
        showAlert(`Welcome back, ${userCredential.user.email}`, 'success');
    } catch (error) {
        handleAuthError(error);
    }
}

async function handleSignup() {
    await authReady; // Wait for auth to initialize
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    
    // Validate inputs
    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'warning');
        return;
    }
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'warning');
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        // Create user profile in Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        $('#authModal').modal('hide');
        document.getElementById('authForm').reset();
        showAlert('Account created successfully!', 'success');
    } catch (error) {
        handleAuthError(error);
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function handleAuthError(error) {
    let message = error.message;
    
    switch(error.code) {
        case 'auth/invalid-email':
            message = 'Invalid email address';
            break;
        case 'auth/user-disabled':
            message = 'This account has been disabled';
            break;
        case 'auth/user-not-found':
            message = 'No account found with this email';
            break;
        case 'auth/wrong-password':
            message = 'Incorrect password';
            break;
        case 'auth/email-already-in-use':
            message = 'This email is already registered';
            break;
        case 'auth/weak-password':
            message = 'Password should be at least 6 characters';
            break;
    }
    
    showAlert(message, 'danger');
}

function logout() {
    window.auth.signOut();
}

function switchToSignup() {
    const form = document.getElementById('authForm');
    const submitBtn = form.querySelector('button[type="button"]');
    const signupText = form.querySelector('p.text-center a');
    
    submitBtn.textContent = 'Sign Up';
    submitBtn.onclick = handleSignup;
    signupText.textContent = 'Sign in';
    signupText.onclick = switchToLogin;
    
    document.querySelector('.modal-title').textContent = 'Create Account';
}

function switchToLogin() {
    const form = document.getElementById('authForm');
    const submitBtn = form.querySelector('button[type="button"]');
    const signupText = form.querySelector('p.text-center a');
    
    submitBtn.textContent = 'Sign In';
    submitBtn.onclick = handleLogin;
    signupText.textContent = 'Sign up';
    signupText.onclick = switchToSignup;
    
    document.querySelector('.modal-title').textContent = 'Welcome Back!';
}

// Initialize social login buttons
function initSocialLogin() {
    // Google login
    document.querySelector('.btn-outline-primary .fa-google').closest('button')
        .addEventListener('click', () => {
            // Implement Google login
            showAlert('Google login will be implemented', 'info');
        });
    
    // Facebook login
        document.querySelector('.btn-outline-primary .fa-facebook-f').closest('button')
        .addEventListener('click', async () => {
            try {
                await authReady;
                const provider = new firebase.auth.FacebookAuthProvider();
                const result = await window.auth.signInWithPopup(provider);
                showAlert(`Welcome, ${result.user.displayName}`, 'success');
                $('#authModal').modal('hide');
            } catch (error) {
                handleAuthError(error);
            }
        });
    
    // Twitter login
    document.querySelector('.btn-outline-primary .fa-twitter').closest('button')
        .addEventListener('click', async () => {
            try {
                await authReady;
                const provider = new firebase.auth.TwitterAuthProvider();
                const result = await window.auth.signInWithPopup(provider);
                showAlert(`Welcome, ${result.user.displayName}`, 'success');
                $('#authModal').modal('hide');
            } catch (error) {
                handleAuthError(error);
            }
        });
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initSocialLogin();
    
    // Toggle file upload visibility based on story mode
    const storyModeCheckbox = document.getElementById('storyMode');
    const fileUploadContainer = document.getElementById('fileUploadContainer');
    
    storyModeCheckbox.addEventListener('change', function() {
        fileUploadContainer.style.display = this.checked ? 'block' : 'none';
        if (!this.checked) {
            document.getElementById('storyFile').value = ''; // Clear file input when disabled
        }
    });
});

// DOM Elements
const generateForm = document.getElementById('generateForm');
const textInput = document.getElementById('textInput');
const genreSelect = document.getElementById('genreSelect');
const storyModeCheckbox = document.getElementById('storyMode');
const resultsContainer = document.getElementById('resultsContainer');
const loadingIndicator = document.getElementById('loadingIndicator');
const galleryContainer = document.getElementById('galleryContainer');
const emptyGallery = document.getElementById('emptyGallery');
const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

let currentImageToDelete = null;

// Form submission handler
if (generateForm) {
    generateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = textInput.value.trim();
        const genre = genreSelect.value;
        const style = document.querySelector('input[name="style"]:checked').value;
        const isStoryMode = storyModeCheckbox.checked;
        let finalText = text;

        // Handle file upload if story mode is enabled
        if (isStoryMode) {
            const fileInput = document.getElementById('storyFile');
            if (fileInput.files.length > 0) {
                try {
                    const file = fileInput.files[0];
                    const fileContent = await readFileAsText(file);
                    finalText = fileContent;
                } catch (error) {
                    showAlert('Error reading file: ' + error.message, 'danger');
                    return;
                }
            }
        }

        if (!finalText) {
            showAlert('Please enter some text or upload a file', 'danger');
            return;
        }

        loadingModal.show();

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, genre, style, isStoryMode })
            });

            const data = await response.json();
            
            if (response.ok) {
                displayResults(data.images);
                // Show results section
                document.getElementById('resultsSection').style.display = 'block';
                // Scroll to results
                document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
            } else {
                showAlert(data.error || 'Failed to generate images', 'danger');
            }
        } catch (error) {
            console.error('Error generating images:', error);
            showAlert('Network error. Please try again.', 'danger');
        } finally {
            loadingModal.hide();
        }
    });
}

// Display results on results page
function displayResults(images) {
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = images.map(image => `
        <div class="col">
            <div class="card h-100">
                <img src="${image.imageUrl}" class="card-img-top gallery-img" alt="${image.prompt}">
                <div class="card-body">
                    <p class="card-text tamil-font">${image.prompt}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${image.genre} • ${image.style}</small>
                        <div>
                            <button onclick="downloadImage('${image.imageUrl}', '${image.prompt}')" class="btn btn-sm btn-outline-primary">
                                <i class="fas fa-download"></i>
                            </button>
                            <button onclick="saveImage('${image.imageUrl}', '${image.prompt}', '${image.genre}', '${image.style}')" class="btn btn-sm btn-outline-success ms-1">
                                <i class="fas fa-save"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Download image
function downloadImage(url, prompt) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-${prompt.substring(0, 20)}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Save image to Firebase
async function saveImage(imageUrl, prompt, genre, style) {
    try {
        const user = auth.currentUser;
        if (!user) {
            showAlert('Please login to save images to your gallery', 'warning');
            return;
        }

        const storageRef = storage.ref();
        const imageRef = storageRef.child(`images/${user.uid}/${Date.now()}.jpg`);
        
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        await imageRef.put(blob);
        const downloadUrl = await imageRef.getDownloadURL();
        
        await db.collection('images').add({
            imageUrl: downloadUrl,
            prompt,
            genre,
            style,
            userId: user.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showAlert('Image saved to gallery!', 'success');
    } catch (error) {
        console.error('Error saving image:', error);
        showAlert('Failed to save image', 'danger');
    }
}

// Load gallery items from Firebase
async function loadGallery() {
    try {
        showLoading(true);
        
        const user = auth.currentUser;
        let query = db.collection('images').orderBy('timestamp', 'desc');
        
        if (user) {
            query = query.where('userId', '==', user.uid);
        }
            
        const querySnapshot = await query.get();
            
        if (querySnapshot.empty) {
            showEmptyGallery(true);
            return;
        }
        
        galleryContainer.innerHTML = '';
        
        querySnapshot.forEach(doc => {
            const image = doc.data();
            galleryContainer.innerHTML += `
                <div class="col">
                    <div class="card h-100">
                        <img src="${image.imageUrl}" class="card-img-top gallery-img" alt="${image.prompt}">
                        <div class="card-body">
                            <p class="card-text tamil-font">${image.prompt}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">${new Date(image.timestamp?.toDate()).toLocaleString()}</small>
                                <div>
                                    <button onclick="downloadImage('${image.imageUrl}', '${image.prompt}')" class="btn btn-sm btn-outline-primary">
                                        <i class="fas fa-download"></i>
                                    </button>
                                    <button onclick="showDeleteModal('${doc.id}', '${image.imageUrl}')" class="btn btn-sm btn-outline-danger ms-1">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        showGallery(true);
    } catch (error) {
        console.error('Error loading gallery:', error);
        showAlert('Failed to load gallery', 'danger');
    } finally {
        showLoading(false);
    }
}

// Show delete confirmation modal
function showDeleteModal(docId, imageUrl) {
    currentImageToDelete = { docId, imageUrl };
    deleteModal.show();
}

// Delete image from Firebase
async function deleteImage() {
    try {
        deleteModal.hide();
        showLoading(true);
        
        await db.collection('images').doc(currentImageToDelete.docId).delete();
        
        const imageRef = storage.refFromURL(currentImageToDelete.imageUrl);
        await imageRef.delete();
        
        showAlert('Image deleted successfully', 'success');
        loadGallery();
    } catch (error) {
        console.error('Error deleting image:', error);
        showAlert('Failed to delete image', 'danger');
    } finally {
        showLoading(false);
    }
}

// UI Helper Functions
function showLoading(show) {
    if (loadingIndicator) loadingIndicator.classList.toggle('d-none', !show);
}

function showGallery(show) {
    if (galleryContainer) galleryContainer.classList.toggle('d-none', !show);
    if (emptyGallery) emptyGallery.classList.toggle('d-none', show);
}

function showEmptyGallery(show) {
    if (emptyGallery) emptyGallery.classList.toggle('d-none', !show);
    if (galleryContainer) galleryContainer.classList.toggle('d-none', show);
}

async function handleForgotPassword() {
    await authReady; // Wait for auth to initialize
    const email = document.getElementById('authEmail').value.trim();
    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'warning');
        return;
    }
    
    try {
        await auth.sendPasswordResetEmail(email);
        showAlert(`Password reset link sent to ${email}. Check your inbox.`, 'success');
        $('#authModal').modal('hide');
    } catch (error) {
        handleAuthError(error);
    }
}

// Form validation helper
function validateInput(input) {
    if (input.checkValidity()) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
    }
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
}

// Initialize the app
if (window.location.pathname.includes('gallery.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const authRequired = document.getElementById('authRequired');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const galleryContainer = document.getElementById('galleryContainer');
        const emptyGallery = document.getElementById('emptyGallery');
        
        // Handle auth state changes
        window.auth.onAuthStateChanged(user => {
            if (!user) {
                authRequired.style.display = 'block';
                loadingIndicator.style.display = 'none';
                galleryContainer.style.display = 'none';
                emptyGallery.style.display = 'none';
                return;
            }
            
            // User is signed in
            authRequired.style.display = 'none';
            loadingIndicator.style.display = 'block';
            loadGallery();
        });
        
        confirmDeleteBtn.addEventListener('click', deleteImage);
    });
}

