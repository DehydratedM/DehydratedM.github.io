// admin.js - Enhanced with proper carousel toggle functionality and restored UI
// ==========================================================================
const ADMIN_CREDENTIALS = {
    username: "dimdesk_admin",
    password: "DimDeskSecure2024!",
    email: "admin@example.com"
};

let websiteData = JSON.parse(localStorage.getItem('dimdesk_data')) || getDefaultData();

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("Admin panel loaded");
    
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Check if already logged in
    const isLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
    
    if (isLoggedIn) {
        showAdminPanel();
        initAdminTabs();
    } else {
        showLoginScreen();
    }
    
    // Login button handler
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
        
        // Add Enter key support
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        if (usernameInput) {
            usernameInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') handleLogin();
            });
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') handleLogin();
            });
        }
    }
    
    // Logout button handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('admin_logged_in');
            showLoginScreen();
            showMessage('Logged out successfully', 'success');
        });
    }
    
    // Load admin email if saved
    const savedEmail = localStorage.getItem('dimdesk_admin_email');
    if (savedEmail) {
        ADMIN_CREDENTIALS.email = savedEmail;
        const emailInput = document.getElementById('admin-email');
        if (emailInput) {
            emailInput.value = savedEmail;
        }
    }
    
    // Add admin page specific styles
    addAdminStyles();
});

function addAdminStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .admin-control-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .admin-category-controls {
            background: rgba(30, 30, 30, 0.9);
            padding: 1.5rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            border: 1px solid rgba(240, 128, 128, 0.2);
        }
        
        .admin-category-items {
            margin-top: 1.5rem;
        }
        
        .admin-message {
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .admin-message.success {
            background: rgba(40, 167, 69, 0.2);
            color: #28a745;
            border: 1px solid #28a745;
        }
        
        .admin-message.error {
            background: rgba(220, 53, 69, 0.2);
            color: #dc3545;
            border: 1px solid #dc3545;
        }
    `;
    document.head.appendChild(style);
}

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('login-error');
    
    if (!username || !password) {
        loginError.textContent = 'Please enter both username and password';
        return;
    }
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('admin_logged_in', 'true');
        showAdminPanel();
        showMessage('Login successful!', 'success');
        initAdminTabs();
    } else {
        loginError.textContent = 'Invalid username or password';
        loginError.style.color = '#ff6b6b';
    }
}

// ==========================================================================
// TAB SYSTEM
// ==========================================================================
function initAdminTabs() {
    const tabsContainer = document.getElementById('admin-tabs');
    if (!tabsContainer) return;
    
    // Create tabs if they don't exist
    if (!tabsContainer.querySelector('.admin-tab')) {
        tabsContainer.innerHTML = `
            <button class="admin-tab active" data-tab="home">🏠 Home</button>
            <button class="admin-tab" data-tab="carousel">🎮 Games</button>
            <button class="admin-tab" data-tab="shop">🛍️ Shop</button>
            <button class="admin-tab" data-tab="portfolio">📊 Portfolio</button>
            <button class="admin-tab" data-tab="settings">⚙️ Settings</button>
            <button class="admin-tab" data-tab="security">🔒 Security</button>
            <button class="admin-tab" data-tab="data">💾 Data</button>
        `;
    }
    
    // Add tab styles if not already added
    if (!document.querySelector('#admin-tabs-styles')) {
        const tabStyle = document.createElement('style');
        tabStyle.id = 'admin-tabs-styles';
        tabStyle.textContent = `
            .admin-tabs {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-bottom: 2rem;
                padding: 1rem;
                background: rgba(20, 20, 20, 0.8);
                border-radius: 10px;
                border: 1px solid rgba(240, 128, 128, 0.2);
            }
            
            .admin-tab {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: wheat;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .admin-tab:hover {
                background: rgba(240, 128, 128, 0.2);
                transform: translateY(-2px);
            }
            
            .admin-tab.active {
                background: lightcoral;
                color: #000;
                border-color: lightcoral;
                box-shadow: 0 5px 15px rgba(240, 128, 128, 0.3);
            }
            
            .admin-section {
                display: none;
                animation: fadeIn 0.3s ease;
            }
            
            .admin-section.active {
                display: block;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(tabStyle);
    }
    
    // Hide all sections, show active one
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));
    const homeSection = document.getElementById('admin-section-home');
    if (homeSection) homeSection.classList.add('active');
    
    // Add tab click handlers
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Show active section
            const activeSection = document.getElementById(`admin-section-${tabId}`);
            if (activeSection) {
                activeSection.classList.add('active');
            }
            
            // Load data if needed
            switch(tabId) {
                case 'carousel':
                    loadCarouselItems(websiteData.carousels);
                    break;
                case 'shop':
                    loadShopItems(websiteData.shop.products);
                    break;
                case 'portfolio':
                    loadPortfolioSkills(websiteData.portfolio.skills);
                    break;
                case 'settings':
                    loadSettings();
                    break;
            }
        });
    });
    
    // Load initial data
    loadAdminData();
}

// ==========================================================================
// SETTINGS SECTION WITH CAROUSEL TOGGLE - FIXED
// ==========================================================================
function loadSettings() {
    const container = document.getElementById('admin-section-settings');
    if (!container) return;
    
    const carouselEnabled = localStorage.getItem('dimdesk_carousel_enabled') !== 'false';
    const featuredTitle = websiteData.home.featured.title || 'Featured Projects';
    const youtubeVideoId = websiteData.home.youtubeVideoId || 'b2lC7cbFmXE';
    
    container.innerHTML = `
        <h2>Website Settings</h2>
        <div class="admin-control">
            <label style="display: flex; align-items: center; gap: 1rem;">
                <input type="checkbox" id="carousel-toggle" ${carouselEnabled ? 'checked' : ''}>
                Enable Carousels
            </label>
            <small style="color: #aaa; display: block; margin-top: 0.5rem;">
                Toggle carousels on/off. When off, the homepage will show a simpler layout.
            </small>
        </div>
        <div class="admin-control">
            <label>Featured Section Title:</label>
            <input type="text" id="featured-title" placeholder="Featured Projects" 
                   value="${featuredTitle}">
        </div>
        <div class="admin-control">
            <label>YouTube Video ID:</label>
            <input type="text" id="youtube-video-id" placeholder="b2lC7cbFmXE" 
                   value="${youtubeVideoId}">
            <small style="color: #aaa; display: block; margin-top: 0.5rem;">
                The ID after "youtube.com/watch?v=" in the URL
            </small>
        </div>
        <button class="admin-save-btn" onclick="saveSettings()">Save Settings</button>
    `;
    
    // Add event listener for carousel toggle
    const carouselToggle = document.getElementById('carousel-toggle');
    if (carouselToggle) {
        carouselToggle.addEventListener('change', function() {
            toggleCarouselSetting(this.checked);
        });
    }
}

function toggleCarouselSetting(enabled) {
    localStorage.setItem('dimdesk_carousel_enabled', enabled);
    showMessage(`Carousels ${enabled ? 'enabled' : 'disabled'}. Refresh the main site to see changes.`, 'success');
}

function saveSettings() {
    websiteData.home.featured.title = document.getElementById('featured-title').value;
    websiteData.home.youtubeVideoId = document.getElementById('youtube-video-id').value;
    
    localStorage.setItem('dimdesk_data', JSON.stringify(websiteData));
    showMessage('Settings saved!', 'success');
}

// ==========================================================================
// SECURITY FUNCTIONS
// ==========================================================================
function changePassword() {
    const newPassword = document.getElementById('new-password').value;
    
    if (!newPassword || newPassword.length < 8) {
        showMessage('Password must be at least 8 characters long', 'error');
        return;
    }
    
    // Update credentials
    ADMIN_CREDENTIALS.password = newPassword;
    
    // Show success message
    showMessage('Password changed successfully!', 'success');
    
    // Clear the field
    document.getElementById('new-password').value = '';
}

function saveAdminEmail() {
    const email = document.getElementById('admin-email').value;
    
    if (!email || !email.includes('@')) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Save email
    ADMIN_CREDENTIALS.email = email;
    localStorage.setItem('dimdesk_admin_email', email);
    
    showMessage('Email saved successfully!', 'success');
}

// ==========================================================================
// UI FUNCTIONS
// ==========================================================================
function showLoginScreen() {
    const loginScreen = document.getElementById('login-screen');
    const adminPanel = document.getElementById('admin-panel');
    
    if (loginScreen) loginScreen.style.display = 'block';
    if (adminPanel) adminPanel.style.display = 'none';
    
    // Clear password field
    const passwordField = document.getElementById('password');
    if (passwordField) passwordField.value = '';
}

function showAdminPanel() {
    const loginScreen = document.getElementById('login-screen');
    const adminPanel = document.getElementById('admin-panel');
    
    if (loginScreen) loginScreen.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';
}

function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('admin-message');
    if (!messageDiv) return;
    
    messageDiv.textContent = message;
    messageDiv.className = `admin-message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// ==========================================================================
// DATA LOADING FOR ADMIN
// ==========================================================================
function loadAdminData() {
    // Load home content
    if (document.getElementById('intro-text')) {
        document.getElementById('intro-text').value = websiteData.home.intro;
    }
    if (document.getElementById('latest-release-image')) {
        document.getElementById('latest-release-image').value = websiteData.home.featured.latest.image;
    }
    if (document.getElementById('latest-release-desc')) {
        document.getElementById('latest-release-desc').value = websiteData.home.featured.latest.text;
    }
    if (document.getElementById('upcoming-project-image')) {
        document.getElementById('upcoming-project-image').value = websiteData.home.featured.upcoming.image;
    }
    if (document.getElementById('upcoming-project-desc')) {
        document.getElementById('upcoming-project-desc').value = websiteData.home.featured.upcoming.text;
    }
    
    // Load carousel items
    loadCarouselItems(websiteData.carousels);
    
    // Load shop items
    loadShopItems(websiteData.shop.products);
    
    // Load portfolio skills
    loadPortfolioSkills(websiteData.portfolio.skills);
}

function loadCarouselItems(carousels) {
    const container = document.getElementById('carousel-items');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!carousels || (!carousels.released && !carousels.upcoming)) {
        container.innerHTML = '<p style="color: wheat; padding: 1rem;">No carousel data available.</p>';
        return;
    }
    
    // Released games
    if (carousels.released && carousels.released.length > 0) {
        const releasedTitle = document.createElement('h3');
        releasedTitle.textContent = 'Released Games';
        releasedTitle.style.color = 'lightcoral';
        releasedTitle.style.marginTop = '2rem';
        container.appendChild(releasedTitle);
        
        carousels.released.forEach((item, index) => {
            addCarouselItemElement(item, 'released', index, container);
        });
    }
    
    // Upcoming games
    if (carousels.upcoming && carousels.upcoming.length > 0) {
        const upcomingTitle = document.createElement('h3');
        upcomingTitle.textContent = 'Upcoming Games';
        upcomingTitle.style.color = 'lightcoral';
        upcomingTitle.style.marginTop = '2rem';
        container.appendChild(upcomingTitle);
        
        carousels.upcoming.forEach((item, index) => {
            addCarouselItemElement(item, 'upcoming', index, container);
        });
    }
}

function loadShopItems(products) {
    const container = document.getElementById('shop-items');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!products || products.length === 0) {
        container.innerHTML = '<p style="color: wheat; padding: 1rem;">No shop products yet. Add some!</p>';
        return;
    }
    
    products.forEach((item, index) => {
        addShopItemElement(item, index, container);
    });
}

function loadPortfolioSkills(skills) {
    const container = document.getElementById('portfolio-skills-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!skills || skills.length === 0) {
        container.innerHTML = '<p style="color: wheat; padding: 1rem;">No portfolio skills yet. Add some!</p>';
        return;
    }
    
    skills.forEach((category, catIndex) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'admin-category-controls';
        categoryDiv.innerHTML = `
            <div class="admin-control">
                <label>Category Name:</label>
                <input type="text" class="category-name" placeholder="Category Name" value="${category.category}" data-index="${catIndex}" data-field="category">
            </div>
            <div class="admin-category-items" data-category-index="${catIndex}" style="margin-bottom: 1.5rem;"></div>
            <button class="admin-add-btn" onclick="addSkillToCategory(${catIndex})" style="margin-bottom: 2rem;">Add Skill to ${category.category}</button>
        `;
        container.appendChild(categoryDiv);
        
        const itemsContainer = categoryDiv.querySelector('.admin-category-items');
        if (category.skills && category.skills.length > 0) {
            category.skills.forEach((skill, skillIndex) => {
                addSkillItemElement(skill, catIndex, skillIndex, itemsContainer);
            });
        }
    });
}

// ==========================================================================
// ELEMENT CREATION FUNCTIONS
// ==========================================================================
function addCarouselItemElement(item, type, index, container) {
    const div = document.createElement('div');
    div.className = 'admin-item';
    div.innerHTML = `
        <div class="admin-item-header">
            <h4 style="color: wheat;">${item.title || 'New Game'}</h4>
            <button class="admin-remove-btn" onclick="removeCarouselItem(${index}, '${type}')">Remove</button>
        </div>
        <div class="admin-control">
            <label>Title:</label>
            <input type="text" class="carousel-title" placeholder="Game Title" value="${item.title || ''}" data-index="${index}" data-type="${type}" data-field="title">
        </div>
        <div class="admin-control">
            <label>Description:</label>
            <textarea class="carousel-desc" placeholder="Game Description" data-index="${index}" data-type="${type}" data-field="description">${item.description || ''}</textarea>
        </div>
        <div class="admin-control">
            <label>Image URL:</label>
            <input type="text" class="carousel-image" placeholder="https://example.com/image.jpg" value="${item.image || ''}" data-index="${index}" data-type="${type}" data-field="image">
            <small style="color: #aaa; display: block; margin-top: 0.25rem;">Change this URL to update the image</small>
        </div>
        <div class="admin-control-row">
            <div class="admin-control">
                <label>Price:</label>
                <input type="number" class="carousel-price" placeholder="Price" value="${item.price || 0}" step="0.01" data-index="${index}" data-type="${type}" data-field="price">
            </div>
            <div class="admin-control">
                <label>Status:</label>
                <select class="carousel-status" data-index="${index}" data-type="${type}" data-field="status">
                    <option value="released" ${item.status === 'released' ? 'selected' : ''}>Released</option>
                    <option value="upcoming" ${item.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
                </select>
            </div>
        </div>
        <div class="admin-control">
            <label>External Links (JSON format):</label>
            <textarea class="carousel-links" placeholder='{"Steam": "https://...", "itch.io": "https://..."}' data-index="${index}" data-type="${type}" data-field="externalLinks">${item.externalLinks ? JSON.stringify(item.externalLinks, null, 2) : ''}</textarea>
            <small style="color: #aaa; display: block; margin-top: 0.25rem;">Enter platform links in JSON format</small>
        </div>
    `;
    
    if (container) {
        container.appendChild(div);
    }
    
    // Add change listeners
    const inputs = div.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('change', updateCarouselItem);
    });
}

function addShopItemElement(item, index, container) {
    const div = document.createElement('div');
    div.className = 'admin-item';
    div.innerHTML = `
        <div class="admin-item-header">
            <h4 style="color: wheat;">${item.title || 'New Product'}</h4>
            <button class="admin-remove-btn" onclick="removeShopItem(${index})">Remove</button>
        </div>
        <div class="admin-control">
            <label>Title:</label>
            <input type="text" class="shop-title" placeholder="Product Title" value="${item.title || ''}" data-index="${index}" data-field="title">
        </div>
        <div class="admin-control">
            <label>Description:</label>
            <textarea class="shop-desc" placeholder="Product Description" data-index="${index}" data-field="description">${item.description || ''}</textarea>
        </div>
        <div class="admin-control">
            <label>Image URL:</label>
            <input type="text" class="shop-image" placeholder="https://example.com/image.jpg" value="${item.image || ''}" data-index="${index}" data-field="image">
            <small style="color: #aaa; display: block; margin-top: 0.25rem;">Change this URL to update the product image</small>
        </div>
        <div class="admin-control-row">
            <div class="admin-control">
                <label>Price:</label>
                <input type="number" class="shop-price" placeholder="Price" value="${item.price || 0}" step="0.01" data-index="${index}" data-field="price">
            </div>
            <div class="admin-control">
                <label>Status:</label>
                <select class="shop-status" data-index="${index}" data-field="status">
                    <option value="released" ${item.status === 'released' ? 'selected' : ''}>Released</option>
                    <option value="upcoming" ${item.status === 'upcoming' ? 'selected' : ''}>Coming Soon</option>
                </select>
            </div>
            <div class="admin-control">
                <label>Type:</label>
                <select class="shop-type" data-index="${index}" data-field="type">
                    <option value="game" ${item.type === 'game' ? 'selected' : ''}>Game</option>
                    <option value="digital" ${item.type === 'digital' ? 'selected' : ''}>Digital</option>
                    <option value="physical" ${item.type === 'physical' ? 'selected' : ''}>Physical</option>
                </select>
            </div>
        </div>
        <div class="admin-control">
            <label>External Links (JSON format):</label>
            <textarea class="shop-links" placeholder='{"Steam": "https://...", "itch.io": "https://..."}' data-index="${index}" data-field="externalLinks">${item.externalLinks ? JSON.stringify(item.externalLinks, null, 2) : ''}</textarea>
            <small style="color: #aaa; display: block; margin-top: 0.25rem;">Enter platform links in JSON format</small>
        </div>
    `;
    
    if (container) {
        container.appendChild(div);
    }
    
    const inputs = div.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('change', updateShopItem);
    });
}

function addSkillItemElement(skill, catIndex, skillIndex, container) {
    const div = document.createElement('div');
    div.className = 'admin-item';
    div.innerHTML = `
        <div class="admin-item-header">
            <h4 style="color: wheat;">${skill.name || 'New Skill'}</h4>
            <button class="admin-remove-btn" onclick="removeSkillItem(${catIndex}, ${skillIndex})">Remove</button>
        </div>
        <div class="admin-control">
            <label>Skill Name:</label>
            <input type="text" class="skill-name" placeholder="Skill Name" value="${skill.name || ''}" data-cat-index="${catIndex}" data-skill-index="${skillIndex}" data-field="name">
        </div>
        <div class="admin-control">
            <label>Years Experience:</label>
            <input type="text" class="skill-years" placeholder="e.g., 5+ years" value="${skill.years || ''}" data-cat-index="${catIndex}" data-skill-index="${skillIndex}" data-field="years">
        </div>
        <div class="admin-control">
            <label>Description:</label>
            <textarea class="skill-desc" placeholder="Skill Description" data-cat-index="${catIndex}" data-skill-index="${skillIndex}" data-field="description">${skill.description || ''}</textarea>
        </div>
        <div class="admin-control-row">
            <div class="admin-control">
                <label>Tags (comma separated):</label>
                <input type="text" class="skill-tags" placeholder="Tag1, Tag2, Tag3" value="${skill.tags ? skill.tags.join(', ') : ''}" data-cat-index="${catIndex}" data-skill-index="${skillIndex}" data-field="tags">
            </div>
            <div class="admin-control">
                <label>Skill Level (0-100):</label>
                <input type="number" class="skill-level" placeholder="Level" value="${skill.level || 50}" min="0" max="100" data-cat-index="${catIndex}" data-skill-index="${skillIndex}" data-field="level">
            </div>
        </div>
    `;
    
    if (container) {
        container.appendChild(div);
    }
    
    const inputs = div.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', updateSkillItem);
    });
}

// ==========================================================================
// ADD NEW ITEMS FUNCTIONS
// ==========================================================================
function addCarouselItem() {
    const newItem = {
        id: Date.now(),
        title: "New Game",
        description: "Game description here",
        image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=New+Game",
        price: 9.99,
        status: "released",
        externalLinks: {}
    };
    
    if (!websiteData.carousels.released) {
        websiteData.carousels.released = [];
    }
    
    websiteData.carousels.released.push(newItem);
    localStorage.setItem('dimdesk_data', JSON.stringify(websiteData));
    loadCarouselItems(websiteData.carousels);
    showMessage('New game added successfully!');
}

function addShopItem() {
    const newItem = {
        id: Date.now(),
        title: "New Product",
        description: "Product description here",
        image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=New+Product",
        price: 9.99,
        status: "released",
        type: "digital",
        externalLinks: {}
    };
    
    if (!websiteData.shop.products) {
        websiteData.shop.products = [];
    }
    
    websiteData.shop.products.push(newItem);
    localStorage.setItem('dimdesk_data', JSON.stringify(websiteData));
    loadShopItems(websiteData.shop.products);
    showMessage('New product added successfully!');
}

function addSkillItem() {
    const newCategory = {
        category: "New Category",
        skills: [{
            name: "New Skill",
            years: "0+ years",
            description: "Skill description here",
            tags: ["Tag1", "Tag2"],
            level: 50
        }]
    };
    
    if (!websiteData.portfolio.skills) {
        websiteData.portfolio.skills = [];
    }
    
    websiteData.portfolio.skills.push(newCategory);
    localStorage.setItem('dimdesk_data', JSON.stringify(websiteData));
    loadPortfolioSkills(websiteData.portfolio.skills);
    showMessage('New category added successfully!');
}

function addSkillToCategory(catIndex) {
    const newSkill = {
        name: "New Skill",
        years: "0+ years",
        description: "Skill description here",
        tags: ["New Tag"],
        level: 50
    };
    
    if (!websiteData.portfolio.skills[catIndex].skills) {
        websiteData.portfolio.skills[catIndex].skills = [];
    }
    
    websiteData.portfolio.skills[catIndex].skills.push(newSkill);
    localStorage.setItem('dimdesk_data', JSON.stringify(websiteData));
    loadPortfolioSkills(websiteData.portfolio.skills);
    showMessage('New skill added successfully!');
}

// ==========================================================================
// UPDATE ITEMS FUNCTIONS
// ==========================================================================
function updateCarouselItem(event) {
    const target = event.target;
    const index = parseInt(target.dataset.index);
    const type = target.dataset.type;
    const field = target.dataset.field;
    let value = target.value;
    
    try {
        if (field === 'price') {
            value = parseFloat(value);
        } else if (field === 'externalLinks') {
            if (value.trim()) {
                value = JSON.parse(value);
            } else {
                value = {};
            }
        } else if (field === 'id') {
            value = parseInt(value);
        }
        
        if (type === 'released') {
            websiteData.carousels.released[index][field] = value;
        } else if (type === 'upcoming') {
            websiteData.carousels.upcoming[index][field] = value;
        }
        
        localStorage.setItem('dimdesk_data', JSON.stringify(websiteData));
        showMessage('Carousel item updated!', 'success');
    } catch (error) {
        showMessage('Error updating item: ' + error.message, 'error');
    }
}

function updateShopItem(event) {
    const target = event.target;
    const index = parseInt(target.dataset.index);
    const field = target.dataset.field;
    let value = target.value;
    
    try {
        if (field === 'price') {
            value = parseFloat(value);
        } else if (field === 'externalLinks') {
            if (value.trim()) {
                value = JSON.parse(value);
            } else {
                value = {};
            }
        } else if (field === 'tags') {
            value = value.split(',').map(tag => tag.trim());
        }
        
        websiteData.shop.products[index][field] = value;
        localStorage.setItem('dimdesk_data', JSON.stringify(websiteData));
        showMessage('Shop item updated!', 'success');
    } catch (error) {
        showMessage('Error updating item: ' + error.message, 'error');
    }
}

function updateSkillItem(event) {
    const target = event.target;
    const catIndex = parseInt(target.dataset.catIndex);
    const skillIndex = parseInt(target.dataset.skillIndex);
    const field = target.dataset.field;
    let value = target.value;
    
    try {
        if (field === 'tags') {
            value = value.split(',').map(tag => tag.trim());
        } else if (field === 'level') {
            value = parseInt(value);
        } else if (field === 'category') {
            websiteData.portfolio.skills[catIndex].category = value;
        } else {
            websiteData.portfolio.skills[catIndex].skills[skillIndex][field] = value;
        }
        
        localStorage.setItem('dimdesk_data', JSON.stringify(websiteData));
        showMessage('Skill updated!', 'success');
    } catch (error) {
        showMessage('Error updating skill: ' + error.message, 'error');
    }
}

// ==========================================================================
// REMOVE ITEMS FUNCTIONS
// ==========================================================================
function removeCarouselItem(index, type) {
    if (!confirm('Are you sure you want to remove this item?')) return;
    
    if (type === 'released') {
        websiteData.carousels.released.splice(index, 1);
    } else if (type === 'upcoming') {
        websiteData.carousels.upcoming.splice(index, 1);
    }
    
    localStorage.setItem('dimdesk_data', JSON.stringify(websiteData));
    loadCarouselItems(websiteData.carousels);
    showMessage('Item removed successfully!');
}

function removeShopItem(index) {
    if (!confirm('Are you sure you want to remove this product?')) return;
    
    websiteData.shop.products.splice(index, 1);
    localStorage.setItem('dimdesk_data', JSON.stringify(websiteData));
    loadShopItems(websiteData.shop.products);
    showMessage('Product removed successfully!');
}

function removeSkillItem(catIndex, skillIndex) {
    if (!confirm('Are you sure you want to remove this skill?')) return;
    
    websiteData.portfolio.skills[catIndex].skills.splice(skillIndex, 1);
    
    // If category is empty, remove it
    if (websiteData.portfolio.skills[catIndex].skills.length === 0) {
        websiteData.portfolio.skills.splice(catIndex, 1);
    }
    
    localStorage.setItem('dimdesk_data', JSON.stringify(websiteData));
    loadPortfolioSkills(websiteData.portfolio.skills);
    showMessage('Skill removed successfully!');
}

// ==========================================================================
// SAVE FUNCTIONS
// ==========================================================================
function saveHomeContent() {
    websiteData.home.intro = document.getElementById('intro-text').value;
    websiteData.home.featured.latest.image = document.getElementById('latest-release-image').value;
    websiteData.home.featured.latest.text = document.getElementById('latest-release-desc').value;
    websiteData.home.featured.upcoming.image = document.getElementById('upcoming-project-image').value;
    websiteData.home.featured.upcoming.text = document.getElementById('upcoming-project-desc').value;
    
    localStorage.setItem('dimdesk_data', JSON.stringify(websiteData));
    showMessage('Home content saved successfully!');
}

// ==========================================================================
// DATA MANAGEMENT
// ==========================================================================
function exportData() {
    const dataStr = JSON.stringify(websiteData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'dimdesk_data_backup.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showMessage('Data exported successfully!');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                websiteData = importedData;
                localStorage.setItem('dimdesk_data', JSON.stringify(importedData));
                loadAdminData();
                showMessage('Data imported successfully!');
            } catch (error) {
                showMessage('Error importing data: ' + error.message, 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

function resetData() {
    if (confirm('Are you sure you want to reset all data to default? This cannot be undone!')) {
        websiteData = getDefaultData();
        localStorage.setItem('dimdesk_data', JSON.stringify(websiteData));
        loadAdminData();
        showMessage('Data reset to default!', 'success');
    }
}

// ==========================================================================
// DEFAULT DATA
// ==========================================================================
function getDefaultData() {
    return {
        home: {
            intro: "Hi, I'm M, the heart and soul behind this one-person indie studio. Games and art have been my passions for as long as I can remember, and they've shaped not just my creative journey but also the vision for this studio.\n\nMy dream is to craft meaningful experiences through games that blend creativity, storytelling, and artistry. It's a challenging road, but I'm committed to pouring my heart into every project, no matter how small or ambitious.\n\nYour support means more than words can express. By joining me on this journey, you'll be helping bring these dreams to life—and as a thank-you, you'll earn a special spot in the credits, early access to merch, game releases and some exclusive goodies along the way.\n\nThank you for believing in indie creators like me. Together, we can build something unforgettable.\n\n—M",
            featured: {
                title: "Featured Projects",
                latest: {
                    image: "https://via.placeholder.com/350x200/2c3e50/ecf0f1?text=LATEST+RELEASE",
                    text: "Check out our most recent game release, available now on itch.io and other platforms!"
                },
                upcoming: {
                    image: "https://via.placeholder.com/350x200/8e44ad/ecf0f1?text=UPCOMING+PROJECT",
                    text: "An exciting new adventure is in development. Stay tuned for updates and announcements!"
                }
            },
            youtubeVideoId: "b2lC7cbFmXE"
        },
        shop: {
            intro: "^^ Please understand the slow process! We're working hard to bring you quality products.\nIn the meantime, check out what we have available and what's coming soon!",
            products: [
                {
                    id: 1,
                    title: "Project Alpha",
                    description: "Complete game download with all features and future updates included.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+Download",
                    price: 9.99,
                    status: "released",
                    type: "game",
                    externalLinks: {
                        "Steam": "https://store.steampowered.com/",
                        "itch.io": "https://dimdesk.itch.io/",
                        "Direct Download": "#"
                    }
                },
                {
                    id: 2,
                    title: "Digital Artbook",
                    description: "100+ pages of concept art, sketches, and development insights.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Digital+Artbook",
                    price: 14.99,
                    status: "released",
                    type: "digital",
                    externalLinks: {
                        "itch.io": "https://dimdesk.itch.io/",
                        "Direct Download": "#"
                    }
                },
                {
                    id: 3,
                    title: "Original Soundtrack",
                    description: "Complete game soundtrack with 25+ tracks in high quality formats.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Soundtrack",
                    price: 7.99,
                    status: "released",
                    type: "digital",
                    externalLinks: {
                        "Bandcamp": "#",
                        "Spotify": "#",
                        "Apple Music": "#"
                    }
                },
                {
                    id: 4,
                    title: "Physical Collector's Edition",
                    description: "Limited edition physical release with exclusive merchandise.",
                    image: "https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Physical+Edition",
                    price: 49.99,
                    status: "upcoming",
                    type: "physical",
                    externalLinks: {
                        "Coming Soon": "#"
                    }
                }
            ]
        },
        portfolio: {
            intro: "Hi there, I'm M! I've always been passionate about games and art for as long as I can remember. These two things have shaped who I am, and I dream of building something meaningful in these fields, even with the challenges they come with.\n\nYour support would mean the world to me, in being part of this journey. As of now I'm on YouTube, Blue-sky, Cara and Patreon! I hope to see you around!\nI'm the sole person currently working in Dimdesk. studios, an indie studio producing Games, art and more (as much as a single person can do, lol)\n\nThank you so much for taking the time to read this, and even more if you choose to help!\n\n—M",
            skills: [
                {
                    category: "🎨 Art & Design",
                    skills: [
                        {
                            name: "Photoshop",
                            years: "7+ years",
                            description: "Asset making, illustrations, graphic design, photo editing/morphing",
                            tags: ["Illustration", "Graphic Design", "Photo Editing"],
                            level: 90
                        },
                        {
                            name: "Traditional Art",
                            years: "8+ years",
                            description: "Painting, color pencils, black & white, pen/markers - Animals, architecture, still life",
                            tags: ["Painting", "Drawing", "Sketching"],
                            level: 95
                        },
                        {
                            name: "Digital Illustration",
                            years: "5+ years",
                            description: "Character design, concept art, digital painting using various software",
                            tags: ["Character Design", "Concept Art", "Digital Painting"],
                            level: 85
                        }
                    ]
                },
                {
                    category: "🎬 Video Editing",
                    skills: [
                        {
                            name: "Premiere Pro",
                            years: "4+ years",
                            description: "Trailers, playthroughs, self tapes - Longest video worked on: 10-14 hours",
                            tags: ["Video Editing", "Color Grading", "Sound Design"],
                            level: 85
                        },
                        {
                            name: "After Effects",
                            years: "3+ years",
                            description: "Motion graphics, visual effects, title animations",
                            tags: ["Motion Graphics", "Visual Effects", "Animation"],
                            level: 75
                        }
                    ]
                },
                {
                    category: "🎮 Game Development",
                    skills: [
                        {
                            name: "Unity & C#",
                            years: "5+ months",
                            description: "2D PC & Android - Platformers, Endless-Runners, Puzzle Games",
                            tags: ["Game Design", "Programming", "Mobile Dev"],
                            level: 60
                        },
                        {
                            name: "HTML & CSS",
                            years: "1+ month",
                            description: "Web development for game promotion and portfolio sites",
                            tags: ["Web Design", "Responsive UI", "Frontend"],
                            level: 50
                        },
                        {
                            name: "Game Design",
                            years: "2+ years",
                            description: "Concept development, level design, game mechanics, prototyping",
                            tags: ["Level Design", "Mechanics", "Prototyping"],
                            level: 70
                        }
                    ]
                },
                {
                    category: "🎵 Audio Production",
                    skills: [
                        {
                            name: "FL Studio",
                            years: "3+ years",
                            description: "Music composition, sound design, audio mixing for games",
                            tags: ["Music Composition", "Sound Design", "Mixing"],
                            level: 65
                        }
                    ]
                }
            ]
        },
        carousels: {
            released: [
                {
                    id: 101,
                    title: "Project Alpha",
                    description: "A thrilling platformer adventure with unique mechanics and stunning visuals.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+1",
                    price: 9.99,
                    status: "released",
                    externalLinks: {
                        "Steam": "https://store.steampowered.com/",
                        "itch.io": "https://dimdesk.itch.io/"
                    }
                },
                {
                    id: 102,
                    title: "Echoes of Time",
                    description: "A puzzle adventure game where you manipulate time to solve mysteries.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+2",
                    price: 14.99,
                    status: "released",
                    externalLinks: {
                        "Steam": "https://store.steampowered.com/",
                        "GOG": "https://www.gog.com/"
                    }
                },
                {
                    id: 103,
                    title: "Neon Runner",
                    description: "Fast-paced endless runner set in a cyberpunk world with retro aesthetics.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+3",
                    price: 7.99,
                    status: "released",
                    externalLinks: {
                        "itch.io": "https://dimdesk.itch.io/",
                        "Google Play": "https://play.google.com/"
                    }
                }
            ],
            upcoming: [
                {
                    id: 104,
                    title: "Dreamscape",
                    description: "Explore a surreal world where dreams and reality collide in this atmospheric adventure.",
                    image: "https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Coming+Soon+1",
                    price: 19.99,
                    status: "upcoming",
                    externalLinks: {
                        "Wishlist on Steam": "https://store.steampowered.com/"
                    }
                },
                {
                    id: 105,
                    title: "Chrono Knights",
                    description: "Time-traveling knights battle through different historical eras in this action RPG.",
                    image: "https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Coming+Soon+2",
                    price: 24.99,
                    status: "upcoming",
                    externalLinks: {
                        "Coming Soon": "#"
                    }
                },
                {
                    id: 106,
                    title: "Pixel Legends",
                    description: "Retro-inspired RPG with modern gameplay mechanics and epic storytelling.",
                    image: "https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Coming+Soon+3",
                    price: 17.99,
                    status: "upcoming",
                    externalLinks: {
                        "Coming Soon": "#"
                    }
                }
            ]
        }
    };
}
