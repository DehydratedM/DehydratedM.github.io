// main.js - Enhanced with improved carousel system and wishlist integration

// ==========================================================================
// GLOBAL VARIABLES
// ==========================================================================
let cart = JSON.parse(localStorage.getItem('dimdesk_cart')) || [];
let websiteData = JSON.parse(localStorage.getItem('dimdesk_data')) || getDefaultData();
let carouselInstances = {};
let wishlist = JSON.parse(localStorage.getItem('dimdesk_wishlist')) || [];

// ==========================================================================
// IMPROVED CAROUSEL CLASS WITH FIXED INDICATORS & LOOPING
// ==========================================================================
class Carousel {
    constructor(containerId, type) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.type = type;
        this.track = this.container.querySelector('.carousel-track');
        this.prevBtn = this.container.querySelector('.carousel-prev');
        this.nextBtn = this.container.querySelector('.carousel-next');
        this.dotsContainer = this.container.querySelector('.carousel-dots');
        
        this.currentIndex = 0;
        this.slidesPerView = this.getSlidesPerView();
        this.totalSlides = 0;
        this.autoSlideInterval = null;
        
        this.init();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.slidesPerView = this.getSlidesPerView();
            this.updateCarousel();
            this.initDots();
        });
    }
    
    getSlidesPerView() {
        const width = window.innerWidth;
        if (width >= 1200) return 3;
        if (width >= 768) return 2;
        return 1;
    }
    
    init() {
        // Load slides from data
        this.loadSlides();
        
        // Add event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Initialize dots
        this.initDots();
        
        // Update carousel
        this.updateCarousel();
        
        // Start auto-slide
        this.startAutoSlide();
        
        // Add touch support
        this.addTouchSupport();
    }
    
    loadSlides() {
        const data = this.type === 'released' ? websiteData.carousels.released : websiteData.carousels.upcoming;
        if (!data || !this.track) return;
        
        this.track.innerHTML = '';
        this.totalSlides = data.length;
        
        data.forEach((item, index) => {
            const isInWishlist = wishlist.some(wishlistItem => wishlistItem.id === item.id);
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `
                <div class="carousel-actions">
                    <button class="carousel-wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}" 
                            data-product-id="${item.id}" 
                            onclick="event.stopPropagation(); toggleWishlist(${item.id})">
                        ${isInWishlist ? '❤️' : '🤍'}
                    </button>
                </div>
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="carousel-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <div class="shop-price">$${item.price.toFixed(2)}</div>
                    <span class="shop-status status-${item.status}">
                        ${item.status === 'released' ? 'Available' : 'Coming Soon'}
                    </span>
                </div>
            `;
            
            slide.addEventListener('click', () => {
                this.showItemModal(item);
            });
            
            this.track.appendChild(slide);
        });
    }
    
    initDots() {
        if (!this.dotsContainer || this.totalSlides === 0) return;
        
        this.dotsContainer.innerHTML = '';
        
        // Calculate total number of dots based on slides per view
        const totalGroups = Math.ceil(this.totalSlides / this.slidesPerView);
        
        for (let i = 0; i < totalGroups; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-indicator';
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide group ${i + 1}`);
            dot.addEventListener('click', () => this.goToGroup(i));
            this.dotsContainer.appendChild(dot);
        }
        
        this.dots = this.dotsContainer.querySelectorAll('.carousel-indicator');
    }
    
    updateCarousel() {
        if (!this.track || this.totalSlides === 0) return;
        
        const slideWidth = 100 / this.slidesPerView;
        const translateX = -(this.currentIndex * slideWidth);
        
        this.track.style.transform = `translateX(${translateX}%)`;
        this.updateDots();
    }
    
    updateDots() {
        if (!this.dots) return;
        
        const currentGroup = Math.floor(this.currentIndex / this.slidesPerView);
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentGroup);
        });
    }
    
    nextSlide() {
        this.stopAutoSlide();
        
        if (this.currentIndex >= this.totalSlides - this.slidesPerView) {
            // Loop back to start
            this.currentIndex = 0;
        } else {
            this.currentIndex += this.slidesPerView;
        }
        
        this.updateCarousel();
        this.startAutoSlide();
    }
    
    prevSlide() {
        this.stopAutoSlide();
        
        if (this.currentIndex <= 0) {
            // Loop to end
            this.currentIndex = this.totalSlides - this.slidesPerView;
        } else {
            this.currentIndex -= this.slidesPerView;
        }
        
        this.updateCarousel();
        this.startAutoSlide();
    }
    
    goToGroup(groupIndex) {
        this.stopAutoSlide();
        this.currentIndex = groupIndex * this.slidesPerView;
        this.updateCarousel();
        this.startAutoSlide();
    }
    
    startAutoSlide() {
        if (this.autoSlideInterval) return;
        
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoSlide();
        });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isDragging = false;
            this.startAutoSlide();
        });
    }
    
    showItemModal(item) {
        const isInWishlist = wishlist.some(wishlistItem => wishlistItem.id === item.id);
        
        const modalHTML = `
            <h2 style="color: lightcoral; margin-bottom: 1rem;">${item.title}</h2>
            <img src="${item.image}" alt="${item.title}" style="width: 100%; border-radius: 10px; margin-bottom: 1rem;" loading="lazy">
            <p style="color: wheat; margin-bottom: 1rem;">${item.description}</p>
            <div style="margin-bottom: 1rem; color: #aaa;">
                <span class="shop-status status-${item.status}" style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 4px;">
                    ${item.status === 'released' ? 'Available Now' : 'Coming Soon'}
                </span>
            </div>
            <div style="text-align: center; color: lightcoral; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
                $${item.price.toFixed(2)}
            </div>
            <div class="modal-actions">
                ${item.status === 'released' ? 
                    `<button onclick="addToCart(${item.id})" style="background: lightcoral; color: #000; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">
                        Add to Cart
                    </button>` : 
                    `<button onclick="toggleWishlist(${item.id})" class="modal-wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}" 
                     style="width: 100%;">
                        ${isInWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                    </button>`
                }
                <button onclick="closeModal()" style="background: transparent; color: lightcoral; border: 1px solid lightcoral; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; width: 100%;">
                    Close
                </button>
            </div>
        `;
        
        const modalBody = document.getElementById('modal-body');
        if (modalBody) {
            modalBody.innerHTML = modalHTML;
            showModal();
        }
    }
}

// ==========================================================================
// WISHLIST FUNCTIONS - ENHANCED
// ==========================================================================
function toggleWishlist(productId) {
    // Find product
    let product = null;
    
    // Check in shop products
    if (websiteData.shop.products) {
        product = websiteData.shop.products.find(p => p.id === productId);
    }
    
    // Check in carousel items
    if (!product && websiteData.carousels) {
        const allCarouselItems = [...websiteData.carousels.released, ...websiteData.carousels.upcoming];
        product = allCarouselItems.find(p => p.id === productId);
    }
    
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    // Check if already in wishlist
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex >= 0) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        showNotification(`Removed ${product.title} from wishlist`);
    } else {
        // Add to wishlist
        wishlist.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            status: product.status,
            addedDate: new Date().toISOString()
        });
        showNotification(`Added ${product.title} to wishlist!`);
    }
    
    // Save to localStorage
    localStorage.setItem('dimdesk_wishlist', JSON.stringify(wishlist));
    
    // Update wishlist button states
    updateWishlistButtons();
    
    // Refresh carousels if they exist
    if (carouselInstances.released) {
        carouselInstances.released.loadSlides();
    }
    if (carouselInstances.upcoming) {
        carouselInstances.upcoming.loadSlides();
    }
    
    // If on wishlist page, reload content
    const page = window.location.pathname.split('/').pop() || 'index.html';
    if (page === 'wishlist.html') {
        loadWishlistContent();
    }
}

function updateWishlistButtons() {
    // Update all wishlist buttons
    document.querySelectorAll('.wishlist-btn, .carousel-wishlist-btn, .modal-wishlist-btn').forEach(btn => {
        const productId = parseInt(btn.dataset.productId);
        if (productId) {
            const isInWishlist = wishlist.some(item => item.id === productId);
            
            if (btn.classList.contains('carousel-wishlist-btn')) {
                if (isInWishlist) {
                    btn.innerHTML = '❤️';
                    btn.classList.add('in-wishlist');
                } else {
                    btn.innerHTML = '🤍';
                    btn.classList.remove('in-wishlist');
                }
            } else {
                if (isInWishlist) {
                    btn.innerHTML = '❤️ In Wishlist';
                    btn.classList.add('in-wishlist');
                } else {
                    btn.innerHTML = '🤍 Add to Wishlist';
                    btn.classList.remove('in-wishlist');
                }
            }
        }
    });
}

// ==========================================================================
// MODAL SYSTEM WITH WISHLIST INTEGRATION
// ==========================================================================
function showProductModal(productId) {
    const product = websiteData.shop.products.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    const isInWishlist = wishlist.some(item => item.id === productId);
    const isAvailable = product.status === 'released';
    
    const modalHTML = `
        <h2 style="color: lightcoral; margin-bottom: 1rem;">${product.title}</h2>
        <img src="${product.image}" alt="${product.title}" style="width: 100%; border-radius: 10px; margin-bottom: 1rem;" loading="lazy">
        <p style="color: wheat; margin-bottom: 1rem;">${product.description}</p>
        <div style="margin-bottom: 1rem; color: #aaa;">
            <span class="shop-status status-${product.status}" style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 4px;">
                ${isAvailable ? 'Available Now' : 'Coming Soon'}
            </span>
            <span style="margin-left: 1rem;">Type: ${product.type}</span>
        </div>
        <div style="text-align: center; color: lightcoral; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
            $${product.price.toFixed(2)}
        </div>
        <div class="modal-actions">
            ${isAvailable ? 
                `<button onclick="addToCart(${product.id})" style="background: lightcoral; color: #000; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">
                    Add to Cart
                </button>` : 
                `<button onclick="toggleWishlist(${product.id})" class="modal-wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}" 
                 style="width: 100%;">
                    ${isInWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                </button>`
            }
            <button onclick="closeModal()" style="background: transparent; color: lightcoral; border: 1px solid lightcoral; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; width: 100%;">
                Close
            </button>
        </div>
    `;
    
    const modalBody = document.getElementById('modal-body');
    if (modalBody) {
        modalBody.innerHTML = modalHTML;
        showModal();
    }
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("Website loaded");
    initializeWebsite();
});

function initializeWebsite() {
    try {
        initNavigation();
        initDynamicContent();
        initCarousels();
        initModalSystem();
        initCartSystem();
        updateWishlistButtons();
        updateCartCount();
        console.log("Website initialization complete");
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

// ==========================================================================
// CAROUSEL INITIALIZATION
// ==========================================================================
function initCarousels() {
    // Initialize carousels based on page
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    if (page === 'index.html' || page === '' || page.includes('SiteTest')) {
        // Home page carousels
        setTimeout(() => {
            if (document.getElementById('released-carousel')) {
                carouselInstances.released = new Carousel('released-carousel', 'released');
            }
            if (document.getElementById('upcoming-carousel')) {
                carouselInstances.upcoming = new Carousel('upcoming-carousel', 'upcoming');
            }
        }, 100);
    } else if (page === 'shop.html') {
        // Shop page carousels
        setTimeout(() => {
            if (document.getElementById('shop-available-carousel')) {
                carouselInstances.shopAvailable = new Carousel('shop-available-carousel', 'released');
            }
            if (document.getElementById('shop-upcoming-carousel')) {
                carouselInstances.shopUpcoming = new Carousel('shop-upcoming-carousel', 'upcoming');
            }
        }, 100);
    }
}

// ==========================================================================
// NAVIGATION
// ==========================================================================
function initNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileToggle || !navLinks) return;
    
    mobileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // Close mobile menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    });
    
    // Highlight current page
    highlightCurrentPage();
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            if (!navLinks.contains(event.target) && !mobileToggle.contains(event.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    });
}

function highlightCurrentPage() {
    const currentPage = window.location.pathname;
    const page = currentPage.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
        link.classList.remove('current-page');
        
        if (page === 'index.html' || page === '' || page.includes('SiteTest')) {
            if (link.getAttribute('href') === 'index.html' || link.getAttribute('href') === './' || link.getAttribute('href') === '') {
                link.classList.add('current-page');
            }
        } else if (page === 'portfolio.html') {
            if (link.getAttribute('href') === 'portfolio.html') {
                link.classList.add('current-page');
            }
        } else if (page === 'shop.html') {
            if (link.getAttribute('href') === 'shop.html') {
                link.classList.add('current-page');
            }
        } else if (page === 'wishlist.html') {
            if (link.getAttribute('href') === 'wishlist.html') {
                link.classList.add('current-page');
            }
        }
    });
}

// ==========================================================================
// DYNAMIC CONTENT LOADING
// ==========================================================================
function initDynamicContent() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    if (page === 'index.html' || page === '' || page.includes('SiteTest')) {
        loadHomeContent();
    } else if (page === 'shop.html') {
        loadShopContent();
    } else if (page === 'portfolio.html') {
        loadPortfolioContent();
    } else if (page === 'wishlist.html') {
        // Wishlist content is handled in wishlist.html's own script
    }
}

function loadHomeContent() {
    const introText = document.getElementById('intro-text');
    if (introText && websiteData.home.intro) {
        introText.innerHTML = websiteData.home.intro.replace(/\n/g, '<br>');
    }
    
    const latestImage = document.getElementById('latest-release-image');
    const latestDesc = document.getElementById('latest-release-desc');
    const upcomingImage = document.getElementById('upcoming-project-image');
    const upcomingDesc = document.getElementById('upcoming-project-desc');
    
    if (latestImage && websiteData.home.featured.latest) {
        latestImage.src = websiteData.home.featured.latest.image;
    }
    if (latestDesc && websiteData.home.featured.latest) {
        latestDesc.textContent = websiteData.home.featured.latest.text;
    }
    if (upcomingImage && websiteData.home.featured.upcoming) {
        upcomingImage.src = websiteData.home.featured.upcoming.image;
    }
    if (upcomingDesc && websiteData.home.featured.upcoming) {
        upcomingDesc.textContent = websiteData.home.featured.upcoming.text;
    }
}

function loadShopContent() {
    const shopIntro = document.getElementById('shop-intro');
    if (shopIntro && websiteData.shop.intro) {
        shopIntro.innerHTML = websiteData.shop.intro.replace(/\^\^/g, '<sup>†</sup>').replace(/\n/g, '<br>');
    }
    
    const shopGrid = document.getElementById('shop-products-grid');
    if (shopGrid && websiteData.shop.products) {
        let html = '';
        websiteData.shop.products.forEach(product => {
            const isInWishlist = wishlist.some(item => item.id === product.id);
            html += `
                <div class="shop-item" onclick="showProductModal(${product.id})">
                    <div class="carousel-actions">
                        <button class="carousel-wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}" 
                                data-product-id="${product.id}" 
                                onclick="event.stopPropagation(); toggleWishlist(${product.id})">
                            ${isInWishlist ? '❤️' : '🤍'}
                        </button>
                    </div>
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                    <div class="shop-item-info">
                        <h3>${product.title}</h3>
                        <p>${product.description}</p>
                        <div class="shop-price">$${product.price.toFixed(2)}</div>
                        <span class="shop-status status-${product.status}">
                            ${product.status === 'released' ? 'Available' : 'Coming Soon'}
                        </span>
                    </div>
                </div>
            `;
        });
        shopGrid.innerHTML = html;
    }
}

function loadPortfolioContent() {
    const portfolioIntro = document.getElementById('portfolio-intro');
    if (portfolioIntro && websiteData.portfolio.intro) {
        portfolioIntro.innerHTML = websiteData.portfolio.intro.replace(/\n/g, '<br>');
    }
    
    const skillsGrid = document.getElementById('portfolio-skills');
    if (skillsGrid && websiteData.portfolio.skills) {
        let html = '';
        websiteData.portfolio.skills.forEach(category => {
            html += `
                <div class="portfolio-category">
                    <h3>${category.category}</h3>
                    <ul class="skill-list">
            `;
            
            category.skills.forEach(skill => {
                html += `
                    <li class="skill-item">
                        <div class="skill-name">
                            <span>${skill.name}</span>
                            <span class="skill-years">${skill.years}</span>
                        </div>
                        <div class="skill-desc">${skill.description}</div>
                        <div class="skill-tags">
                `;
                
                skill.tags.forEach(tag => {
                    html += `<span class="skill-tag">${tag}</span>`;
                });
                
                html += `
                        </div>
                        <div class="skill-progress-container">
                            <div class="skill-progress">
                                <div class="skill-progress-bar" style="width: ${skill.level}%"></div>
                            </div>
                            <div class="skill-progress-percent">${skill.level}%</div>
                        </div>
                    </li>
                `;
            });
            
            html += `
                    </ul>
                </div>
            `;
        });
        
        skillsGrid.innerHTML = html;
    }
}

// ==========================================================================
// CART SYSTEM
// ==========================================================================
function initCartSystem() {
    const cartToggle = document.querySelector('.cart-toggle');
    const closeCart = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart');
    
    if (cartToggle) {
        cartToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    updateCartDisplay();
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
        document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    }
}

function closeCartSidebar() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function addToCart(itemId) {
    let product = null;
    
    // Check in shop products
    if (websiteData.shop.products) {
        product = websiteData.shop.products.find(p => p.id === itemId);
    }
    
    // Check in carousel items
    if (!product && websiteData.carousels) {
        const allCarouselItems = [...websiteData.carousels.released, ...websiteData.carousels.upcoming];
        product = allCarouselItems.find(p => p.id === itemId);
    }
    
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    if (product.status === 'upcoming') {
        showNotification('This product is not available yet!', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('dimdesk_cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
    showNotification(`Added ${product.title} to cart!`);
    closeModal();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('dimdesk_cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
    showNotification('Item removed from cart');
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.textContent = '$0.00';
    } else {
        let itemsHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            itemsHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image" loading="lazy">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                        <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove item">&times;</button>
                </div>
            `;
        });
        
        cartItems.innerHTML = itemsHTML;
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('Cart is already empty');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('dimdesk_cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
        showNotification('Cart cleared');
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const modalHTML = `
        <h2 style="color: lightcoral; margin-bottom: 1rem;">Order Summary</h2>
        <div style="background: rgba(255, 255, 255, 0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Subtotal:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid rgba(255, 255, 255, 0.2); padding-top: 0.5rem;">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        </div>
        <p style="color: wheat; margin-bottom: 1rem; text-align: center;">
            Thank you for your order! This is a demo checkout.
        </p>
        <div style="text-align: center;">
            <button onclick="completeCheckout()" style="background: lightcoral; color: #000; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: bold; cursor: pointer; margin-right: 0.5rem;">
                Complete Purchase
            </button>
            <button onclick="closeModal()" style="background: transparent; color: lightcoral; border: 1px solid lightcoral; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">
                Cancel
            </button>
        </div>
    `;
    
    const modalBody = document.getElementById('modal-body');
    if (modalBody) {
        modalBody.innerHTML = modalHTML;
        showModal();
    }
}

function completeCheckout() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cart = [];
    localStorage.setItem('dimdesk_cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
    
    showNotification(`Purchase successful! Thank you for your order of $${total.toFixed(2)}`);
    closeModal();
    closeCartSidebar();
}

// ==========================================================================
// MODAL SYSTEM
// ==========================================================================
function initModalSystem() {
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function showModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==========================================================================
// NOTIFICATION SYSTEM
// ==========================================================================
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'rgba(220, 53, 69, 0.9)' : 
                    type === 'warning' ? 'rgba(255, 193, 7, 0.9)' : 
                    'rgba(40, 167, 69, 0.9)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// ==========================================================================
// DEFAULT DATA
// ==========================================================================
function getDefaultData() {
    return {
        home: {
            intro: "Hi, I'm M, the heart and soul behind this one-person indie studio. Games and art have been my passions for as long as I can remember, and they've shaped not just my creative journey but also the vision for this studio.\n\nMy dream is to craft meaningful experiences through games that blend creativity, storytelling, and artistry. It's a challenging road, but I'm committed to pouring my heart into every project, no matter how small or ambitious.\n\nYour support means more than words can express. By joining me on this journey, you'll be helping bring these dreams to life—and as a thank-you, you'll earn a special spot in the credits, early access to merch, game releases and some exclusive goodies along the way.\n\nThank you for believing in indie creators like me. Together, we can build something unforgettable.\n\n—M",
            featured: {
                latest: {
                    image: "https://via.placeholder.com/350x200/2c3e50/ecf0f1?text=LATEST+RELEASE",
                    text: "Check out our most recent game release, available now on itch.io and other platforms!"
                },
                upcoming: {
                    image: "https://via.placeholder.com/350x200/8e44ad/ecf0f1?text=UPCOMING+PROJECT",
                    text: "An exciting new adventure is in development. Stay tuned for updates and announcements!"
                }
            }
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
                    launchDate: "2024-01-01"
                },
                {
                    id: 2,
                    title: "Digital Artbook",
                    description: "100+ pages of concept art, sketches, and development insights.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Digital+Artbook",
                    price: 14.99,
                    status: "released",
                    type: "digital",
                    launchDate: "2024-01-01"
                },
                {
                    id: 3,
                    title: "Original Soundtrack",
                    description: "Complete game soundtrack with 25+ tracks in high quality formats.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Soundtrack",
                    price: 7.99,
                    status: "released",
                    type: "digital",
                    launchDate: "2024-01-01"
                },
                {
                    id: 4,
                    title: "Physical Collector's Edition",
                    description: "Limited edition physical release with exclusive merchandise.",
                    image: "https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Physical+Edition",
                    price: 49.99,
                    status: "upcoming",
                    type: "physical",
                    launchDate: "2024-12-31"
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
                    id: 1,
                    title: "Project Alpha",
                    description: "A thrilling platformer adventure with unique mechanics and stunning visuals.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+1",
                    price: 9.99,
                    status: "released",
                    launchDate: "2024-01-01"
                },
                {
                    id: 2,
                    title: "Echoes of Time",
                    description: "A puzzle adventure game where you manipulate time to solve mysteries.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+2",
                    price: 14.99,
                    status: "released",
                    launchDate: "2024-01-01"
                },
                {
                    id: 3,
                    title: "Neon Runner",
                    description: "Fast-paced endless runner set in a cyberpunk world with retro aesthetics.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+3",
                    price: 7.99,
                    status: "released",
                    launchDate: "2024-01-01"
                }
            ],
            upcoming: [
                {
                    id: 4,
                    title: "Dreamscape",
                    description: "Explore a surreal world where dreams and reality collide in this atmospheric adventure.",
                    image: "https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Coming+Soon+1",
                    price: 19.99,
                    status: "upcoming",
                    launchDate: "2024-12-31"
                },
                {
                    id: 5,
                    title: "Chrono Knights",
                    description: "Time-traveling knights battle through different historical eras in this action RPG.",
                    image: "https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Coming+Soon+2",
                    price: 24.99,
                    status: "upcoming",
                    launchDate: "2024-12-31"
                },
                {
                    id: 6,
                    title: "Pixel Legends",
                    description: "Retro-inspired RPG with modern gameplay mechanics and epic storytelling.",
                    image: "https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Coming+Soon+3",
                    price: 17.99,
                    status: "upcoming",
                    launchDate: "2024-12-31"
                }
            ]
        }
    };
}

// ==========================================================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ==========================================================================
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.checkout = checkout;
window.completeCheckout = completeCheckout;
window.closeModal = closeModal;
window.toggleCart = toggleCart;
window.closeCartSidebar = closeCartSidebar;
window.showProductModal = showProductModal;
window.toggleWishlist = toggleWishlist;
