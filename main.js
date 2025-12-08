// main.js - COMPLETE WEBSITE FUNCTIONALITY

// ==========================================================================
// GLOBAL VARIABLES & DATA STORAGE
// ==========================================================================
let cart = JSON.parse(localStorage.getItem('dimdesk_cart')) || [];
let adminLoggedIn = localStorage.getItem('dimdesk_admin') === 'true';

// Sample data - This would be loaded from admin panel in production
const siteData = {
    logo: {
        main: 'logo2.png',
        fallback: 'logo-fallback.png',
        cat: 'cat.png'
    },
    featured: {
        latestRelease: {
            title: 'Project Alpha',
            image: 'https://via.placeholder.com/350x200/2c3e50/ecf0f1?text=LATEST+RELEASE',
            description: 'A thrilling platformer adventure with unique mechanics.'
        },
        upcomingProject: {
            title: 'Dreamscape',
            image: 'https://via.placeholder.com/350x200/8e44ad/ecf0f1?text=UPCOMING+PROJECT',
            description: 'Explore a surreal world where dreams and reality collide.'
        }
    },
    releasedGames: [
        {
            id: 1,
            title: 'Project Alpha',
            image: 'https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+1',
            description: 'A thrilling platformer adventure with unique mechanics and stunning visuals.',
            price: 9.99,
            status: 'released'
        },
        {
            id: 2,
            title: 'Echoes of Time',
            image: 'https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+2',
            description: 'A puzzle adventure game where you manipulate time to solve mysteries.',
            price: 14.99,
            status: 'released'
        },
        {
            id: 3,
            title: 'Neon Runner',
            image: 'https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+3',
            description: 'Fast-paced endless runner set in a cyberpunk world with retro aesthetics.',
            price: 7.99,
            status: 'released'
        }
    ],
    upcomingGames: [
        {
            id: 4,
            title: 'Dreamscape',
            image: 'https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Coming+Soon+1',
            description: 'Explore a surreal world where dreams and reality collide.',
            price: 19.99,
            status: 'upcoming',
            releaseDate: '2025-06-15'
        },
        {
            id: 5,
            title: 'Chrono Knights',
            image: 'https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Coming+Soon+2',
            description: 'Time-traveling knights battle through different historical eras.',
            price: 24.99,
            status: 'upcoming',
            releaseDate: '2025-08-01'
        },
        {
            id: 6,
            title: 'Pixel Legends',
            image: 'https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Coming+Soon+3',
            description: 'Retro-inspired RPG with modern gameplay mechanics.',
            price: 17.99,
            status: 'upcoming',
            releaseDate: '2025-09-30'
        }
    ],
    shopItems: [
        {
            id: 1,
            title: 'Digital Games',
            image: 'https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Digital+Game',
            description: 'Instant download of our completed games for PC and mobile platforms.',
            price: 4.99,
            status: 'released',
            category: 'digital'
        },
        {
            id: 2,
            title: 'Game Assets Pack',
            image: 'https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Game+Assets',
            description: 'Collection of reusable game assets for indie developers.',
            price: 19.99,
            status: 'upcoming',
            category: 'assets',
            releaseDate: '2025-06-01'
        },
        {
            id: 3,
            title: 'Digital Wallpapers',
            image: 'https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Wallpapers',
            description: 'High-resolution wallpapers featuring our artwork.',
            price: 2.99,
            status: 'released',
            category: 'digital'
        },
        {
            id: 4,
            title: 'Custom Commissions',
            image: 'https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Commission',
            description: 'Commission custom artwork or game assets for your projects.',
            price: 0,
            status: 'soon',
            category: 'services'
        }
    ],
    portfolioSkills: {
        art: [
            {
                name: 'Photoshop',
                years: '7+ years',
                description: 'Asset making, illustrations, graphic design, photo editing/morphing',
                progress: 90,
                tags: ['Illustration', 'Graphic Design', 'Photo Editing']
            },
            {
                name: 'Traditional Art',
                years: '8+ years',
                description: 'Painting, color pencils, black & white, pen/markers - Animals, architecture, still life',
                progress: 95,
                tags: ['Painting', 'Drawing', 'Sketching']
            }
        ],
        editing: [
            {
                name: 'Premiere Pro',
                years: '4+ years',
                description: 'Trailers, playthroughs, self tapes - Longest video worked on: 10-14 hours',
                progress: 85,
                tags: ['Video Editing', 'Color Grading', 'Sound Design']
            }
        ],
        development: [
            {
                name: 'Unity & C#',
                years: '5+ months',
                description: '2D PC & Android - Platformers, Endless-Runners, Puzzle Games',
                progress: 60,
                tags: ['Game Design', 'Programming', 'Mobile Dev']
            }
        ],
        music: [
            {
                name: 'FL Studio & Audacity',
                years: 'Beginner',
                description: 'Just starting out - Planning releases on YouTube and Spotify',
                progress: 30,
                tags: ['Music Composition', 'Sound Design', 'Audio Editing']
            }
        ]
    }
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    
    // Check if we're on admin page
    if (window.location.pathname.includes('admin.html')) {
        initializeAdminPanel();
    }
});

// ==========================================================================
// WEBSITE INITIALIZATION
// ==========================================================================
function initializeWebsite() {
    // Initialize all components
    initNavigation();
    initLogoHandling();
    initCarousels();
    initModalSystem();
    initCartSystem();
    initCountdownTimers();
    initImageLoading();
    initVideoAutoplay();
    initScrollEffects();
    initPortfolioAnimation();
    
    // Load dynamic content based on page
    loadPageSpecificContent();
    
    // Update cart display
    updateCartCount();
}

// ==========================================================================
// NAVIGATION SYSTEM
// ==========================================================================
function initNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const cartToggle = document.querySelector('.cart-toggle');
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Close mobile menu when clicking links
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Highlight current page
    highlightCurrentPage();
    
    // Secondary navigation for desktop
    initSecondaryNavigation();
}

function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pages = [
        { id: 'home-link', secondary: 'secondary-home', page: 'index.html' },
        { id: 'portfolio-link', secondary: 'secondary-portfolio', page: 'portfolio.html' },
        { id: 'shop-link', secondary: 'secondary-shop', page: 'shop.html' }
    ];
    
    pages.forEach(page => {
        const mainLink = document.getElementById(page.id);
        const secondaryLink = document.getElementById(page.secondary);
        
        if (mainLink) {
            mainLink.classList.remove('current-page');
            if (currentPage === page.page) {
                mainLink.classList.add('current-page');
            }
        }
        
        if (secondaryLink) {
            secondaryLink.classList.remove('current-page');
            if (currentPage === page.page) {
                secondaryLink.classList.add('current-page');
            }
        }
    });
}

function initSecondaryNavigation() {
    const secondaryNav = document.querySelector('.desktop-nav-secondary');
    if (secondaryNav && window.innerWidth >= 1400) {
        let isVisible = false;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300 && !isVisible) {
                secondaryNav.style.display = 'block';
                setTimeout(() => {
                    secondaryNav.style.opacity = '1';
                    secondaryNav.style.transform = 'translateY(0)';
                }, 10);
                isVisible = true;
            } else if (window.scrollY <= 300 && isVisible) {
                secondaryNav.style.opacity = '0';
                secondaryNav.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    secondaryNav.style.display = 'none';
                }, 300);
                isVisible = false;
            }
        });
    }
}

// ==========================================================================
// LOGO HANDLING
// ==========================================================================
function initLogoHandling() {
    const mainLogo = document.querySelector('.main-logo');
    const catLogo = document.getElementById('cat-logo');
    const logoLink = document.getElementById('logo-link');
    
    // Handle logo clicks
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            if (catLogo) {
                catLogo.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    catLogo.style.transform = '';
                }, 200);
            }
        });
    }
    
    // Handle logo errors
    if (mainLogo) {
        mainLogo.addEventListener('error', function() {
            console.log('Main logo failed to load, showing fallback');
            const fallback = document.getElementById('main-logo-fallback');
            if (fallback) {
                fallback.style.display = 'block';
                this.style.display = 'none';
            }
        });
        
        // Preload and check logo
        preloadImage(mainLogo.src).then(success => {
            if (!success) {
                mainLogo.dispatchEvent(new Event('error'));
            }
        });
    }
    
    if (catLogo) {
        catLogo.addEventListener('error', function() {
            const fallback = document.getElementById('logo-fallback');
            if (fallback) {
                fallback.style.display = 'block';
                this.style.display = 'none';
            }
        });
    }
}

function preloadImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// ==========================================================================
// IMPROVED CAROUSEL SYSTEM WITH SMOOTH LOOPING
// ==========================================================================
class ImprovedCarousel {
    constructor(containerId, items = [], autoPlay = true) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.items = items;
        this.track = this.container.querySelector('.carousel-track');
        this.prevBtn = this.container.querySelector('.carousel-prev');
        this.nextBtn = this.container.querySelector('.carousel-next');
        this.dotsContainer = this.container.querySelector('.carousel-dots');
        
        this.currentIndex = 1; // Start at 1 because of clone
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlay = autoPlay;
        this.slides = [];
        
        this.init();
    }
    
    init() {
        // Clear existing content
        this.track.innerHTML = '';
        this.dotsContainer.innerHTML = '';
        
        // Create slides
        this.createSlides();
        
        // Setup infinite loop
        this.setupInfiniteLoop();
        
        // Create dots
        this.createDots();
        
        // Add event listeners
        this.addEventListeners();
        
        // Set initial position
        this.goToSlide(1, false);
        
        // Start autoplay if enabled
        if (this.autoPlay) {
            this.startAutoPlay();
        }
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    createSlides() {
        this.items.forEach((item, index) => {
            const slide = this.createSlide(item, index);
            this.track.appendChild(slide);
            this.slides.push(slide);
        });
    }
    
    createSlide(item, index) {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.dataset.index = index;
        
        let content = '';
        if (item.image) {
            content += `<img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200/333/fff?text=Image+Failed'">`;
        }
        
        content += `
            <div class="carousel-info">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
        `;
        
        if (item.price) {
            content += `<div class="shop-price">$${item.price.toFixed(2)}</div>`;
        }
        
        if (item.status) {
            let statusClass = 'status-released';
            if (item.status === 'upcoming') statusClass = 'status-upcoming';
            if (item.status === 'soon') statusClass = 'status-soon';
            content += `<span class="shop-status ${statusClass}">${this.getStatusText(item.status)}</span>`;
        }
        
        if (item.status === 'upcoming' && item.releaseDate) {
            content += `<div class="release-countdown" data-date="${item.releaseDate}"></div>`;
        }
        
        content += `</div></div>`;
        
        slide.innerHTML = content;
        
        // Add click event for modal
        slide.addEventListener('click', () => {
            this.openItemModal(item);
        });
        
        return slide;
    }
    
    getStatusText(status) {
        const statusMap = {
            released: 'Available',
            upcoming: 'Coming Soon',
            soon: 'Limited Slots'
        };
        return statusMap[status] || status;
    }
    
    setupInfiniteLoop() {
        if (this.slides.length < 2) return;
        
        // Clone first and last slides
        const firstClone = this.slides[0].cloneNode(true);
        const lastClone = this.slides[this.slides.length - 1].cloneNode(true);
        
        firstClone.classList.add('clone');
        lastClone.classList.add('clone');
        
        this.track.appendChild(firstClone);
        this.track.insertBefore(lastClone, this.slides[0]);
        
        // Update slides array
        this.slides = Array.from(this.track.children);
    }
    
    createDots() {
        const realSlides = this.slides.filter(slide => !slide.classList.contains('clone'));
        
        realSlides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => this.goToSlide(index + 1));
            this.dotsContainer.appendChild(dot);
        });
        
        this.dots = Array.from(this.dotsContainer.children);
    }
    
    addEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch/swipe support
        this.addTouchEvents();
        
        // Pause on hover
        if (this.autoPlay) {
            this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
            this.container.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    addTouchEvents() {
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        const threshold = 50;
        const allowedTime = 300;
        let startTime = 0;
        let isSwiping = false;
        
        this.track.addEventListener('touchstart', (e) => {
            const touch = e.changedTouches[0];
            startX = touch.pageX;
            startY = touch.pageY;
            startTime = Date.now();
            isSwiping = true;
            
            if (this.autoPlay) {
                this.pauseAutoPlay();
            }
        });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            e.preventDefault();
        });
        
        this.track.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            
            const touch = e.changedTouches[0];
            distX = touch.pageX - startX;
            distY = touch.pageY - startY;
            const elapsedTime = Date.now() - startTime;
            
            if (elapsedTime <= allowedTime) {
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= threshold) {
                    if (distX > 0) {
                        this.prevSlide();
                    } else {
                        this.nextSlide();
                    }
                }
            }
            
            isSwiping = false;
            
            if (this.autoPlay) {
                setTimeout(() => this.startAutoPlay(), 1000);
            }
        });
    }
    
    getSlideWidth() {
        return this.slides[0].offsetWidth + 30; // Include gap
    }
    
    goToSlide(index, animate = true) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentIndex = index;
        
        const slideWidth = this.getSlideWidth();
        const translateX = -slideWidth * this.currentIndex;
        
        this.track.style.transition = animate ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        this.track.style.transform = `translateX(${translateX}px)`;
        
        this.updateDots();
        
        // Handle infinite loop
        setTimeout(() => {
            const totalSlides = this.slides.length;
            const realSlidesCount = totalSlides - 2; // Minus clones
            
            if (this.currentIndex === 0) {
                // Jump to last real slide (simulating infinite scroll left)
                this.track.style.transition = 'none';
                this.currentIndex = realSlidesCount;
                this.track.style.transform = `translateX(${-slideWidth * this.currentIndex}px)`;
                this.updateDots();
            } else if (this.currentIndex === totalSlides - 1) {
                // Jump to first real slide (simulating infinite scroll right)
                this.track.style.transition = 'none';
                this.currentIndex = 1;
                this.track.style.transform = `translateX(${-slideWidth * this.currentIndex}px)`;
                this.updateDots();
            }
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 50);
        }, 800);
    }
    
    nextSlide() {
        if (this.isAnimating) return;
        this.goToSlide(this.currentIndex + 1);
    }
    
    prevSlide() {
        if (this.isAnimating) return;
        this.goToSlide(this.currentIndex - 1);
    }
    
    updateDots() {
        if (!this.dots || this.dots.length === 0) return;
        
        const realSlidesCount = this.slides.length - 2;
        let dotIndex = this.currentIndex - 1;
        
        if (dotIndex < 0) dotIndex = realSlidesCount - 1;
        if (dotIndex >= realSlidesCount) dotIndex = 0;
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === dotIndex);
        });
    }
    
    startAutoPlay() {
        if (!this.autoPlay) return;
        
        this.pauseAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    handleResize() {
        // Recalculate position
        this.goToSlide(this.currentIndex, false);
    }
    
    openItemModal(item) {
        showItemModal(item);
    }
}

function initCarousels() {
    // Initialize released games carousel
    const releasedCarousel = document.getElementById('released-carousel');
    if (releasedCarousel) {
        new ImprovedCarousel('released-carousel', siteData.releasedGames);
    }
    
    // Initialize upcoming games carousel
    const upcomingCarousel = document.getElementById('upcoming-carousel');
    if (upcomingCarousel) {
        new ImprovedCarousel('upcoming-carousel', siteData.upcomingGames);
    }
    
    // Initialize shop carousels if on shop page
    if (window.location.pathname.includes('shop.html')) {
        const releasedProducts = siteData.shopItems.filter(item => item.status === 'released');
        const upcomingProducts = siteData.shopItems.filter(item => item.status !== 'released');
        
        const releasedShopCarousel = document.getElementById('released-carousel');
        if (releasedShopCarousel) {
            new ImprovedCarousel('released-carousel', releasedProducts);
        }
        
        const upcomingShopCarousel = document.getElementById('upcoming-carousel');
        if (upcomingShopCarousel) {
            new ImprovedCarousel('upcoming-carousel', upcomingProducts);
        }
    }
}

// ==========================================================================
// MODAL SYSTEM
// ==========================================================================
function initModalSystem() {
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
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    
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
    
    let modalHTML = `
        <h2 class="modal-title">${item.title}</h2>
        
        <img src="${item.image}" alt="${item.title}" class="modal-image" 
             onerror="this.src='https://via.placeholder.com/800x400/333/fff?text=Image+Failed'">
        
        <div class="modal-description">
            <p>${item.description}</p>
        </div>
        
        <div class="modal-price">
            ${item.price ? `$${item.price.toFixed(2)}` : 'Contact for Quote'}
        </div>
        
        <div class="modal-actions">
    `;
    
    if (item.status === 'released') {
        modalHTML += `
            <button class="modal-btn modal-btn-primary" onclick="addToCart(${item.id})">
                Add to Cart
            </button>
            <button class="modal-btn modal-btn-secondary" onclick="closeModal()">
                Continue Shopping
            </button>
        `;
    } else if (item.status === 'upcoming') {
        modalHTML += `
            <button class="modal-btn modal-btn-secondary" onclick="setReminder(${item.id})">
                Set Reminder
            </button>
            <button class="modal-btn modal-btn-secondary" onclick="closeModal()">
                Close
            </button>
        `;
    } else {
        modalHTML += `
            <button class="modal-btn modal-btn-secondary" onclick="contactForCommission(${item.id})">
                Contact Us
            </button>
            <button class="modal-btn modal-btn-secondary" onclick="closeModal()">
                Close
            </button>
        `;
    }
    
    modalHTML += `</div>`;
    
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
// CART SYSTEM
// ==========================================================================
function initCartSystem() {
    // Create cart icon if it doesn't exist
    const navLinks = document.querySelector('.nav-links ul');
    if (navLinks && !document.querySelector('.cart-toggle')) {
        const cartIcon = `
            <li class="cart-toggle" id="cart-toggle">
                <a href="#" class="cart-icon">
                    🛒
                    <span class="cart-count" id="cart-count">0</span>
                </a>
            </li>
        `;
        navLinks.insertAdjacentHTML('beforeend', cartIcon);
        
        // Add cart toggle event
        const cartToggle = document.getElementById('cart-toggle');
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
                <div class="cart-items" id="cart-items"></div>
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
        const closeCart = document.getElementById('close-cart');
        const checkoutBtn = document.getElementById('checkout-btn');
        const clearCartBtn = document.getElementById('clear-cart');
        
        if (closeCart) {
            closeCart.addEventListener('click', closeCartSidebar);
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', checkout);
        }
        
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }
    }
    
    // Update cart display
    updateCartDisplay();
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
        document.body.classList.toggle('cart-open');
    }
}

function closeCartSidebar() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
        document.body.classList.remove('cart-open');
    }
}

function addToCart(itemId) {
    // Find the item
    let item;
    
    // Check released games
    item = siteData.releasedGames.find(g => g.id === itemId);
    
    // Check upcoming games
    if (!item) {
        item = siteData.upcomingGames.find(g => g.id === itemId);
    }
    
    // Check shop items
    if (!item) {
        item = siteData.shopItems.find(i => i.id === itemId);
    }
    
    if (!item) return;
    
    // Check if item is available
    if (item.status !== 'released') {
        showNotification('This item is not available for purchase yet.', 'warning');
        return;
    }
    
    // Add to cart
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
    saveCart();
    
    // Update display
    updateCartDisplay();
    
    // Show notification
    showNotification(`Added ${item.title} to cart!`, 'success');
    
    // Close modal if open
    closeModal();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
    showNotification('Item removed from cart', 'info');
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update count
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Update items list
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        } else {
            let itemsHTML = '';
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                itemsHTML += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.title}" class="cart-item-image"
                             onerror="this.src='https://via.placeholder.com/100x100/333/fff?text=Item'">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.title}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                        </div>
                        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">&times;</button>
                    </div>
                `;
            });
            
            cartItems.innerHTML = itemsHTML;
            
            // Update total
            if (cartTotal) {
                cartTotal.textContent = `$${total.toFixed(2)}`;
            }
        }
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

function saveCart() {
    localStorage.setItem('dimdesk_cart', JSON.stringify(cart));
}

function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
        showNotification('Cart cleared', 'info');
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }
    
    // In a real application, this would redirect to a checkout page
    // For now, we'll show a success message
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    showNotification(`Thank you for your order! Total: $${total.toFixed(2)}`, 'success');
    
    // Clear cart after checkout
    cart = [];
    saveCart();
    updateCartDisplay();
    closeCartSidebar();
}

// ==========================================================================
// COUNTDOWN TIMERS
// ==========================================================================
function initCountdownTimers() {
    const countdownElements = document.querySelectorAll('.release-countdown[data-date]');
    
    countdownElements.forEach(element => {
        const releaseDate = new Date(element.dataset.date);
        updateCountdown(element, releaseDate);
        
        // Update every second
        setInterval(() => {
            updateCountdown(element, releaseDate);
        }, 1000);
    });
}

function updateCountdown(element, releaseDate) {
    const now = new Date();
    const timeRemaining = releaseDate - now;
    
    if (timeRemaining <= 0) {
        element.innerHTML = '<span class="countdown-value">Released!</span>';
        return;
    }
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    element.innerHTML = `
        <div class="countdown-item">
            <span class="countdown-value">${days}</span>
            <span class="countdown-label">Days</span>
        </div>
        <div class="countdown-item">
            <span class="countdown-value">${hours}</span>
            <span class="countdown-label">Hours</span>
        </div>
        <div class="countdown-item">
            <span class="countdown-value">${minutes}</span>
            <span class="countdown-label">Minutes</span>
        </div>
        <div class="countdown-item">
            <span class="countdown-value">${seconds}</span>
            <span class="countdown-label">Seconds</span>
        </div>
    `;
}

// ==========================================================================
// IMAGE LOADING
// ==========================================================================
function initImageLoading() {
    // Add lazy loading to all images
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add error handling
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
            
            // Don't replace placeholder images
            if (!this.src.includes('via.placeholder.com')) {
                this.style.opacity = '0.5';
                this.title = 'Image failed to load';
            }
        });
    });
}

// ==========================================================================
// VIDEO AUTOPLAY
// ==========================================================================
function initVideoAutoplay() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Try to autoplay
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay failed, add play button
                addVideoPlayButton(video);
            });
        }
    });
}

function addVideoPlayButton(video) {
    const container = video.parentElement;
    const playButton = document.createElement('button');
    playButton.className = 'video-play-button';
    playButton.innerHTML = '▶';
    playButton.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        background: rgba(240, 128, 128, 0.8);
        border: none;
        border-radius: 50%;
        color: #000;
        font-size: 24px;
        cursor: pointer;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    `;
    
    playButton.addEventListener('mouseenter', () => {
        playButton.style.background = 'rgba(240, 128, 128, 1)';
        playButton.style.transform = 'translate(-50%, -50%) scale(1.1)';
    });
    
    playButton.addEventListener('mouseleave', () => {
        playButton.style.background = 'rgba(240, 128, 128, 0.8)';
        playButton.style.transform = 'translate(-50%, -50%)';
    });
    
    playButton.addEventListener('click', () => {
        video.play();
        playButton.style.display = 'none';
    });
    
    container.style.position = 'relative';
    container.appendChild(playButton);
}

// ==========================================================================
// SCROLL EFFECTS
// ==========================================================================
function initScrollEffects() {
    // Add scroll animation to elements
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
    
    // Initial setup
    document.querySelectorAll('.featured-card, .portfolio-category, .shop-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
}

// ==========================================================================
// PORTFOLIO ANIMATION
// ==========================================================================
function initPortfolioAnimation() {
    if (!window.location.pathname.includes('portfolio.html')) return;
    
    const progressBars = document.querySelectorAll('.skill-progress-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width || getComputedStyle(bar).width;
                
                // Reset and animate
                bar.style.width = '0%';
                bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// ==========================================================================
// NOTIFICATION SYSTEM
// ==========================================================================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 
                     type === 'warning' ? 'rgba(255, 193, 7, 0.9)' : 
                     type === 'error' ? 'rgba(244, 67, 54, 0.9)' : 
                     'rgba(33, 150, 243, 0.9)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.2);
        font-weight: 600;
        max-width: 300px;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        
        // Add slideOut animation
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(slideOutStyle);
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ==========================================================================
// PAGE SPECIFIC CONTENT LOADING
// ==========================================================================
function loadPageSpecificContent() {
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path === '/') {
        loadHomePageContent();
    } else if (path.includes('portfolio.html')) {
        loadPortfolioContent();
    } else if (path.includes('shop.html')) {
        loadShopContent();
    }
}

function loadHomePageContent() {
    // Load featured images
    const latestRelease = document.getElementById('latest-release');
    const upcomingProject = document.getElementById('upcoming-project');
    
    if (latestRelease && siteData.featured.latestRelease) {
        latestRelease.innerHTML = `
            <img src="${siteData.featured.latestRelease.image}" 
                 alt="${siteData.featured.latestRelease.title}"
                 onerror="this.src='https://via.placeholder.com/350x200/2c3e50/ecf0f1?text=LATEST+RELEASE'">
        `;
    }
    
    if (upcomingProject && siteData.featured.upcomingProject) {
        upcomingProject.innerHTML = `
            <img src="${siteData.featured.upcomingProject.image}" 
                 alt="${siteData.featured.upcomingProject.title}"
                 onerror="this.src='https://via.placeholder.com/350x200/8e44ad/ecf0f1?text=UPCOMING+PROJECT'">
        `;
    }
}

function loadPortfolioContent() {
    // Portfolio content is already in HTML, just animate it
    initPortfolioAnimation();
}

function loadShopContent() {
    // Shop content is already loaded by carousels
    // Add click events to shop grid items
    document.querySelectorAll('.shop-item').forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const itemData = siteData.shopItems.find(i => i.title === title);
            
            if (itemData) {
                showItemModal(itemData);
            }
        });
    });
}

// ==========================================================================
// HELPER FUNCTIONS FOR MODAL ACTIONS
// ==========================================================================
function setReminder(itemId) {
    // Find the item
    let item = siteData.upcomingGames.find(g => g.id === itemId);
    if (!item) {
        item = siteData.shopItems.find(i => i.id === itemId);
    }
    
    if (!item || !item.releaseDate) return;
    
    // In a real app, this would set up email/notification reminders
    // For now, we'll just show a confirmation
    const releaseDate = new Date(item.releaseDate);
    const formattedDate = releaseDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    showNotification(`Reminder set for ${item.title} releasing on ${formattedDate}`, 'success');
    closeModal();
}

function contactForCommission(itemId) {
    // In a real app, this would open a contact form or email client
    // For now, we'll show a message
    showNotification('Please email us at dimdesk.Contact@gmail.com for commission inquiries', 'info');
    closeModal();
}

// ==========================================================================
// ADMIN PANEL
// ==========================================================================
function initializeAdminPanel() {
    // Check if user is logged in
    if (!adminLoggedIn && !window.location.pathname.includes('admin-login.html')) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // If on login page, handle login
    if (window.location.pathname.includes('admin-login.html')) {
        setupAdminLogin();
        return;
    }
    
    // Setup admin panel
    setupAdminControls();
}

function setupAdminLogin() {
    const loginForm = document.getElementById('admin-login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;
            
            // Simple authentication (in production, use proper authentication)
            if (username === 'admin' && password === 'dimdesk2025') {
                localStorage.setItem('dimdesk_admin', 'true');
                adminLoggedIn = true;
                window.location.href = 'admin.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }
}

function setupAdminControls() {
    // Load existing data
    loadAdminData();
    
    // Setup logout
    const logoutBtn = document.getElementById('admin-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('dimdesk_admin');
            window.location.href = 'admin-login.html';
        });
    }
    
    // Setup save buttons
    document.querySelectorAll('.admin-save-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.admin-section').id;
            saveSectionData(section);
        });
    });
    
    // Setup image previews
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = input.closest('.admin-control').querySelector('.image-preview');
                    if (preview) {
                        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    });
}

function loadAdminData() {
    // Load logo data
    document.getElementById('logo-main').value = siteData.logo.main;
    document.getElementById('logo-cat').value = siteData.logo.cat;
    
    // Load featured content
    document.getElementById('featured-latest-title').value = siteData.featured.latestRelease.title;
    document.getElementById('featured-latest-image').value = siteData.featured.latestRelease.image;
    document.getElementById('featured-latest-desc').value = siteData.featured.latestRelease.description;
    
    document.getElementById('featured-upcoming-title').value = siteData.featured.upcomingProject.title;
    document.getElementById('featured-upcoming-image').value = siteData.featured.upcomingProject.image;
    document.getElementById('featured-upcoming-desc').value = siteData.featured.upcomingProject.description;
    
    // Load games data
    loadGamesData();
    
    // Load shop items
    loadShopItemsData();
    
    // Load skills data
    loadSkillsData();
}

function loadGamesData() {
    // This would load games from a database in production
    // For now, we'll populate with sample data
    const gamesContainer = document.getElementById('games-list');
    if (gamesContainer) {
        let gamesHTML = '';
        
        [...siteData.releasedGames, ...siteData.upcomingGames].forEach(game => {
            gamesHTML += `
                <div class="admin-game-item">
                    <h3>${game.title}</h3>
                    <input type="text" value="${game.title}" placeholder="Title">
                    <input type="text" value="${game.image}" placeholder="Image URL">
                    <textarea placeholder="Description">${game.description}</textarea>
                    <input type="number" value="${game.price}" placeholder="Price" step="0.01">
                    <select>
                        <option value="released" ${game.status === 'released' ? 'selected' : ''}>Released</option>
                        <option value="upcoming" ${game.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
                    </select>
                    <input type="date" value="${game.releaseDate || ''}">
                </div>
            `;
        });
        
        gamesContainer.innerHTML = gamesHTML;
    }
}

function loadShopItemsData() {
    // Similar to games, load shop items
}

function loadSkillsData() {
    // Load skills data
}

function saveSectionData(section) {
    switch(section) {
        case 'logo-section':
            saveLogoData();
            break;
        case 'featured-section':
            saveFeaturedData();
            break;
        case 'games-section':
            saveGamesData();
            break;
        case 'shop-section':
            saveShopData();
            break;
        case 'skills-section':
            saveSkillsData();
            break;
    }
    
    showNotification('Changes saved successfully!', 'success');
}

function saveLogoData() {
    siteData.logo.main = document.getElementById('logo-main').value;
    siteData.logo.cat = document.getElementById('logo-cat').value;
    // In production, save to database
    console.log('Logo data saved:', siteData.logo);
}

function saveFeaturedData() {
    siteData.featured.latestRelease.title = document.getElementById('featured-latest-title').value;
    siteData.featured.latestRelease.image = document.getElementById('featured-latest-image').value;
    siteData.featured.latestRelease.description = document.getElementById('featured-latest-desc').value;
    
    siteData.featured.upcomingProject.title = document.getElementById('featured-upcoming-title').value;
    siteData.featured.upcomingProject.image = document.getElementById('featured-upcoming-image').value;
    siteData.featured.upcomingProject.description = document.getElementById('featured-upcoming-desc').value;
    
    console.log('Featured data saved:', siteData.featured);
}

function saveGamesData() {
    // This would save to database in production
    console.log('Games data saved');
}

function saveShopData() {
    console.log('Shop data saved');
}

function saveSkillsData() {
    console.log('Skills data saved');
}

// ==========================================================================
// EXPORT FUNCTIONS FOR HTML USE
// ==========================================================================
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.checkout = checkout;
window.closeModal = closeModal;
window.setReminder = setReminder;
window.contactForCommission = contactForCommission;
window.toggleCart = toggleCart;
window.closeCartSidebar = closeCartSidebar;
