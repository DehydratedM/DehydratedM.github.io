// main.js - SIMPLIFIED WORKING VERSION
console.log("DimDesk Studios - Main script loaded");

// ==========================================================================
// GLOBAL VARIABLES
// ==========================================================================
let cart = JSON.parse(localStorage.getItem('dimdesk_cart')) || [];

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Loaded - Initializing website");
    initializeWebsite();
});

// ==========================================================================
// WEBSITE INITIALIZATION
// ==========================================================================
function initializeWebsite() {
    console.log("Initializing website components");
    
    try {
        initNavigation();
        initLogoHandling();
        initCarousels();
        initModalSystem();
        initCartSystem();
        initVideoAutoplay();
        initImageLoading();
        initScrollEffects();
        
        // Load dynamic content
        loadPageSpecificContent();
        
        // Update cart
        updateCartCount();
        
        console.log("Website initialization complete");
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

// ==========================================================================
// BASIC NAVIGATION
// ==========================================================================
function initNavigation() {
    console.log("Initializing navigation");
    
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileToggle || !navLinks) {
        console.warn("Navigation elements not found");
        return;
    }
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    });
    
    // Highlight current page
    highlightCurrentPage();
}

function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log("Current page:", currentPage);
    
    // Remove all current-page classes
    document.querySelectorAll('.current-page').forEach(el => {
        el.classList.remove('current-page');
    });
    
    // Add current-page class based on page
    const pageMap = {
        'index.html': '#home-link',
        'portfolio.html': '#portfolio-link',
        'shop.html': '#shop-link'
    };
    
    const selector = pageMap[currentPage] || pageMap['index.html'];
    if (selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('current-page');
        }
    }
}

// ==========================================================================
// LOGO HANDLING - SIMPLIFIED
// ==========================================================================
function initLogoHandling() {
    const logoLink = document.getElementById('logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            const logoImg = document.getElementById('cat-logo');
            if (logoImg) {
                logoImg.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    logoImg.style.transform = '';
                }, 200);
            }
        });
    }
    
    // Handle logo errors
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
            this.style.opacity = '0.5';
        });
    });
}

// ==========================================================================
// SIMPLE CAROUSEL - NO INFINITE LOOP (Easier to debug)
// ==========================================================================
class SimpleCarousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn("Carousel container not found:", containerId);
            return;
        }
        
        console.log("Initializing carousel:", containerId);
        
        this.track = this.container.querySelector('.carousel-track');
        this.slides = Array.from(this.track.children);
        this.prevBtn = this.container.querySelector('.carousel-prev');
        this.nextBtn = this.container.querySelector('.carousel-next');
        this.dotsContainer = this.container.querySelector('.carousel-dots');
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        
        this.init();
    }
    
    init() {
        // Create dots
        if (this.dotsContainer) {
            this.dotsContainer.innerHTML = '';
            this.slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
            this.dots = Array.from(this.dotsContainer.children);
        }
        
        // Event listeners for buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Initial update
        this.updateCarousel();
        
        console.log("Carousel initialized with", this.totalSlides, "slides");
    }
    
    updateCarousel() {
        if (!this.track) return;
        
        const slideWidth = this.slides[0]?.offsetWidth || 300;
        const translateX = -slideWidth * this.currentIndex;
        
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
    }
    
    nextSlide() {
        if (this.currentIndex >= this.totalSlides - 1) {
            this.currentIndex = 0; // Loop back to start
        } else {
            this.currentIndex++;
        }
        this.updateCarousel();
    }
    
    prevSlide() {
        if (this.currentIndex <= 0) {
            this.currentIndex = this.totalSlides - 1; // Loop to end
        } else {
            this.currentIndex--;
        }
        this.updateCarousel();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentIndex = index;
            this.updateCarousel();
        }
    }
}

function initCarousels() {
    console.log("Initializing carousels");
    
    // Initialize all carousels on page
    const carouselIds = ['released-carousel', 'upcoming-carousel'];
    
    carouselIds.forEach(id => {
        if (document.getElementById(id)) {
            new SimpleCarousel(id);
        }
    });
    
    // For shop page, also initialize shop carousels
    if (window.location.pathname.includes('shop.html')) {
        // Shop page might have different carousel IDs
        const shopCarousels = document.querySelectorAll('.carousel-container');
        shopCarousels.forEach((container, index) => {
            if (!container.id) {
                container.id = `shop-carousel-${index}`;
                new SimpleCarousel(container.id);
            }
        });
    }
}

// ==========================================================================
// SIMPLE MODAL SYSTEM
// ==========================================================================
function initModalSystem() {
    console.log("Initializing modal system");
    
    // Create modal HTML if it doesn't exist
    if (!document.getElementById('modal-overlay')) {
        const modalHTML = `
            <div class="modal-overlay" id="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close" id="modal-close">&times;</button>
                    <div class="modal-body" id="modal-body"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Add event listeners
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
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function showItemModal(item) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    
    if (!modalOverlay || !modalBody) return;
    
    const modalHTML = `
        <h2 class="modal-title">${item.title}</h2>
        <img src="${item.image}" alt="${item.title}" class="modal-image">
        <div class="modal-description">
            <p>${item.description}</p>
            <div class="modal-price">$${item.price?.toFixed(2) || 'Contact for Quote'}</div>
        </div>
        <div class="modal-actions">
            <button class="modal-btn modal-btn-primary" onclick="addToCart(${item.id})">
                Add to Cart
            </button>
            <button class="modal-btn modal-btn-secondary" onclick="closeModal()">
                Close
            </button>
        </div>
    `;
    
    modalBody.innerHTML = modalHTML;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==========================================================================
// SIMPLE CART SYSTEM
// ==========================================================================
function initCartSystem() {
    console.log("Initializing cart system");
    
    // Only add cart to shop page or if we're on a page with shop items
    if (window.location.pathname.includes('shop.html') || 
        window.location.pathname.includes('index.html')) {
        
        // Add cart icon to navigation
        const navUl = document.querySelector('.nav-links ul');
        if (navUl && !document.querySelector('.cart-toggle')) {
            const cartIcon = `
                <li class="cart-toggle">
                    <a href="#" class="cart-icon">
                        🛒
                        <span class="cart-count" id="cart-count">0</span>
                    </a>
                </li>
            `;
            navUl.insertAdjacentHTML('beforeend', cartIcon);
            
            // Add click event to cart icon
            const cartToggle = document.querySelector('.cart-toggle');
            if (cartToggle) {
                cartToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    toggleCart();
                });
            }
        }
        
        // Create cart sidebar if it doesn't exist
        if (!document.getElementById('cart-sidebar')) {
            const cartHTML = `
                <div class="cart-sidebar" id="cart-sidebar">
                    <div class="cart-header">
                        <h2>Your Cart</h2>
                        <button class="close-cart" id="close-cart">&times;</button>
                    </div>
                    <div class="cart-items" id="cart-items">
                        <div class="empty-cart">Your cart is empty</div>
                    </div>
                    <div class="cart-total">
                        <span class="cart-total-label">Total:</span>
                        <span class="cart-total-price" id="cart-total">$0.00</span>
                    </div>
                    <div class="cart-actions">
                        <button class="cart-btn cart-btn-checkout" id="checkout-btn">Checkout</button>
                        <button class="cart-btn cart-btn-clear" id="clear-cart">Clear Cart</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', cartHTML);
            
            // Add cart event listeners
            document.getElementById('close-cart').addEventListener('click', closeCartSidebar);
            document.getElementById('checkout-btn').addEventListener('click', checkout);
            document.getElementById('clear-cart').addEventListener('click', clearCart);
        }
        
        // Update cart display
        updateCartDisplay();
    }
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
    console.log("Adding to cart:", itemId);
    
    // Sample items - in real app, this would come from your database
    const items = [
        { id: 1, title: 'Project Alpha', price: 9.99, image: 'https://via.placeholder.com/100x100' },
        { id: 2, title: 'Digital Artbook', price: 14.99, image: 'https://via.placeholder.com/100x100' },
        { id: 3, title: 'Game Soundtrack', price: 7.99, image: 'https://via.placeholder.com/100x100' },
        { id: 4, title: 'Digital Games', price: 4.99, image: 'https://via.placeholder.com/100x100' }
    ];
    
    const item = items.find(i => i.id === itemId);
    if (!item) {
        alert('Item not found!');
        return;
    }
    
    // Check if item already in cart
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('dimdesk_cart', JSON.stringify(cart));
    
    // Update display
    updateCartDisplay();
    updateCartCount();
    
    // Show feedback
    showNotification(`Added ${item.title} to cart!`);
    
    // Close modal if open
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
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">&times;</button>
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
    if (cart.length === 0) return;
    
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
    showNotification(`Thank you for your order! Total: $${total.toFixed(2)}`);
    
    // Clear cart after checkout
    cart = [];
    localStorage.setItem('dimdesk_cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
    closeCartSidebar();
}

// ==========================================================================
// VIDEO AUTOPLAY
// ==========================================================================
function initVideoAutoplay() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.play().catch(e => {
            console.log("Video autoplay failed:", e);
        });
    });
}

// ==========================================================================
// IMAGE LOADING
// ==========================================================================
function initImageLoading() {
    // Add lazy loading
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
}

// ==========================================================================
// SCROLL EFFECTS
// ==========================================================================
function initScrollEffects() {
    // Simple fade-in on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.featured-card, .portfolio-category, .shop-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial setup for animation
    document.querySelectorAll('.featured-card, .portfolio-category, .shop-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger animations
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
}

// ==========================================================================
// PAGE SPECIFIC CONTENT
// ==========================================================================
function loadPageSpecificContent() {
    console.log("Loading page-specific content");
    
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadHomePageContent();
    }
    
    if (window.location.pathname.includes('shop.html')) {
        loadShopContent();
    }
}

function loadHomePageContent() {
    console.log("Loading home page content");
    
    // Add click events to carousel slides
    document.querySelectorAll('.carousel-slide').forEach(slide => {
        slide.addEventListener('click', function() {
            const title = this.querySelector('h3')?.textContent || 'Item';
            const description = this.querySelector('p')?.textContent || 'Description';
            const priceText = this.querySelector('.shop-price')?.textContent || '$0.00';
            const price = parseFloat(priceText.replace('$', '')) || 0;
            const image = this.querySelector('img')?.src || 'https://via.placeholder.com/300x200';
            
            const item = {
                id: Math.floor(Math.random() * 1000),
                title: title,
                description: description,
                price: price,
                image: image
            };
            
            showItemModal(item);
        });
    });
}

function loadShopContent() {
    console.log("Loading shop page content");
    
    // Add click events to shop items
    document.querySelectorAll('.shop-item').forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h3')?.textContent || 'Item';
            const description = this.querySelector('p')?.textContent || 'Description';
            const priceText = this.querySelector('.shop-price')?.textContent || '$0.00';
            const price = parseFloat(priceText.replace('$', '')) || 0;
            const image = this.querySelector('img')?.src || 'https://via.placeholder.com/300x200';
            
            const itemData = {
                id: Math.floor(Math.random() * 1000),
                title: title,
                description: description,
                price: price,
                image: image
            };
            
            showItemModal(itemData);
        });
    });
}

// ==========================================================================
// NOTIFICATION SYSTEM
// ==========================================================================
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(240, 128, 128, 0.9);
        color: #000;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
        border: 2px solid rgba(255, 255, 255, 0.3);
    `;
    
    // Add animation style
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
    
    // Auto-remove
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==========================================================================
// EXPORT FUNCTIONS FOR HTML USE
// ==========================================================================
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.checkout = checkout;
window.closeModal = closeModal;
window.toggleCart = toggleCart;
window.closeCartSidebar = closeCartSidebar;
window.showItemModal = showItemModal;
