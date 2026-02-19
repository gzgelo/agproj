// ===== CONFIGURATION =====
const EMAILJS_PUBLIC_KEY  = 'bKSc8sM7EP3mwpTQo';
const EMAILJS_SERVICE_ID  = 'service_vbjyhld';
const EMAILJS_TEMPLATE_ID = 'template_mhlub6q';
const GITHUB_USERNAME     = 'gzgelo';

// Initialize EmailJS after the library is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    } else {
        console.error('EmailJS library not loaded');
    }
});

// ===== HAMBURGER MENU =====
const menuIcon = document.getElementById('menu-icon');
const navbar = document.getElementById('navbar');

menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});

// ===== ACTIVE NAVIGATION ON SCROLL =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== API 1: GITHUB REPOSITORIES =====
async function loadGithubRepos() {
    const container = document.getElementById('github-repos');
    const langColors = {
        JavaScript: '#f1e05a',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Java: '#b07219',
        Python: '#3572A5',
        TypeScript: '#2b7489',
        PHP: '#4F5D95'
    };
    
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        if (!response.ok) throw new Error('GitHub API error');
        
        const repos = await response.json();
        
        if (repos.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-color);font-size:1.6rem;padding:3rem;">No public repositories found.</p>';
            return;
        }
        
        container.innerHTML = repos.map(repo => `
            <div class="project-box">
                <div class="project-icon" style="background: linear-gradient(135deg, ${langColors[repo.language] || '#667eea'} 0%, #764ba2 100%);">
                    <i class="fa-brands fa-github"></i>
                </div>
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description provided.'}</p>
                <div class="project-tags">
                    ${repo.language ? `<span class="tag">${repo.language}</span>` : ''}
                    <span class="tag"><i class="fa-solid fa-star"></i> ${repo.stargazers_count}</span>
                    <span class="tag"><i class="fa-solid fa-code-fork"></i> ${repo.forks_count}</span>
                </div>
                <a href="${repo.html_url}" target="_blank" class="btn-inquire">
                    <i class="fa-brands fa-github"></i> View on GitHub
                </a>
            </div>
        `).join('');
        
    } catch (error) {
        container.innerHTML = `
            <div style="text-align:center;padding:3rem;grid-column:1/-1;">
                <p style="color:var(--text-color);font-size:1.6rem;">
                    <i class="fa-solid fa-circle-exclamation" style="color:var(--accent-color);"></i>
                    Could not load GitHub repositories. Please check the username.
                </p>
                <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" style="color:var(--main-color);font-size:1.5rem;margin-top:1rem;display:inline-block;">
                    View Profile on GitHub →
                </a>
            </div>
        `;
    }
}

// Load GitHub repos after DOM is ready
document.addEventListener('DOMContentLoaded', loadGithubRepos);

// ===== API 3: LEAFLET / OPENSTREETMAP =====
(function initMap() {
    // Wait for DOM and Leaflet to be ready
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        return;
    }
    const lat = 14.2817, lng = 122.7849;
    const map = L.map('map', { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    const customIcon = L.divIcon({
        html: '<div style="background:var(--accent-color);width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(183,75,75,0.8)"></div>',
        className: '', iconSize: [18, 18], iconAnchor: [9, 9]
    });
    
    L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup('<strong>Angelo Gozo</strong><br>Paracale, Camarines Norte')
        .openPopup();
})();

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
    toast.className = `show ${type}`;
    setTimeout(() => { toast.className = ''; }, 5000);
}

// ===== VALIDATION HELPERS =====
function validateField(inputId, errorId, validationFn, errorMessage) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    const value = input.value.trim();
    const isValid = validationFn(value);
    
    if (!isValid) {
        error.textContent = errorMessage;
        error.classList.add('show');
        input.style.borderColor = '#ff6b6b';
    } else {
        error.classList.remove('show');
        input.style.borderColor = 'rgba(100, 255, 218, 0.1)';
    }
    
    return isValid;
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ===== TRANSACTION 1: CONTACT FORM (EmailJS) =====
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all fields
    const validations = [
        validateField('contact-name', 'error-name', v => v.length >= 2, 'Name must be at least 2 characters'),
        validateField('contact-email', 'error-email', isEmail, 'Please enter a valid email address'),
        validateField('contact-subject', 'error-subject', v => v.length >= 3, 'Subject must be at least 3 characters'),
        validateField('contact-message', 'error-message', v => v.length >= 20, 'Message must be at least 20 characters')
    ];
    
    if (!validations.every(v => v)) return;
    
    const submitBtn = document.getElementById('contact-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    
    const formData = {
        from_name: document.getElementById('contact-name').value.trim(),
        reply_to: document.getElementById('contact-email').value.trim(),
        subject: document.getElementById('contact-subject').value.trim(),
        message: document.getElementById('contact-message').value.trim(),
        to_name: 'Angelo Gozo',
        email: 'gozangelo814@gmail.com' // recipient email (used by template)
    };
    
    try {
        // Send email via EmailJS
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData);
        showToast('✓ Message sent successfully! I will reply soon.', 'success');
        this.reset();
        
    } catch (error) {
        console.error('Error:', error);
        showToast('✗ Failed to send message. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }
});

// ===== TRANSACTION 2: PROJECT INQUIRY MODAL (EmailJS) =====
const inquiryModal = document.getElementById('inquiry-modal');

function openInquiry(projectName) {
    document.getElementById('inquiry-project-name').textContent = projectName;
    document.getElementById('inquiry-form').reset();
    
    // Clear any previous errors
    document.querySelectorAll('.error-msg').forEach(err => err.classList.remove('show'));
    document.querySelectorAll('#inquiry-form input, #inquiry-form select, #inquiry-form textarea').forEach(input => {
        input.style.borderColor = 'rgba(100, 255, 218, 0.1)';
    });
    
    inquiryModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeInquiry() {
    inquiryModal.classList.remove('show');
    document.body.style.overflow = '';
}

// Close modal when clicking outside
inquiryModal.addEventListener('click', (e) => {
    if (e.target === inquiryModal) closeInquiry();
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeInquiry();
});

// Inquiry form submit handler (sends email)
document.getElementById('inquiry-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all fields
    const validations = [
        validateField('inquiry-name', 'error-inquiry-name', v => v.length >= 2, 'Name must be at least 2 characters'),
        validateField('inquiry-email', 'error-inquiry-email', isEmail, 'Please enter a valid email address'),
        validateField('inquiry-type', 'error-inquiry-type', v => v !== '', 'Please select an inquiry type'),
        validateField('inquiry-message', 'error-inquiry-message', v => v.length >= 10, 'Message must be at least 10 characters')
    ];
    
    if (!validations.every(v => v)) return;
    
    const submitBtn = document.getElementById('inquiry-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    
    const projectName = document.getElementById('inquiry-project-name').textContent;
    
    const inquiryData = {
        from_name: document.getElementById('inquiry-name').value.trim(),
        reply_to: document.getElementById('inquiry-email').value.trim(),
        subject: `Project Inquiry: ${projectName}`,
        message: `Inquiry Type: ${document.getElementById('inquiry-type').value}\n\nMessage:\n${document.getElementById('inquiry-message').value.trim()}`,
        to_name: 'Angelo Gozo',
        email: 'gozangelo814@gmail.com'   // your receiving email
    };
    
    try {
        // Send email via EmailJS
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, inquiryData);
        
        closeInquiry();
        showToast(`✓ Inquiry for "${projectName}" submitted! I will contact you soon.`, 'success');
        this.reset();
    } catch (error) {
        console.error('Error:', error);
        showToast('✗ Failed to send inquiry. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Inquiry';
    }
});