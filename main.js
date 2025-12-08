// main.js - Enhanced with better carousel and integration
console.log("DimDesk Studios - Enhanced Main Script Loaded");

// ==========================================================================
// GLOBAL VARIABLES
// ==========================================================================
let cart = JSON.parse(localStorage.getItem('dimdesk_cart')) || [];
let websiteData = JSON.parse(localStorage.getItem('dimdesk_data')) || getDefaultData();
let isAdmin = localStorage.getItem('dimdesk_admin') === 'true';

// ==========================================================================
// DEFAULT DATA STRUCTURE
// ==========================================================================
function getDefaultData() {
    return {
        content: {
            intro: "Hi, I'm M, the heart and soul behind this one-person indie studio...",
            featured: {
                latest: {
                    image: "https://via.placeholder.com/350x200/2c3e50/ecf0f1?text=LATEST+RELEASE",
                    text: "Check out our most recent game release!"
                },
                upcoming: {
                    image: "https://via.placeholder.com/350x200/8e44ad/ecf0f1?text=UPCOMING+PROJECT",
                    text: "An exciting new adventure is in development!"
                }
            }
        },
        carousels: {
            released: [
                {
                    id: 1,
                    title: "Project Alpha",
                    description: "A thrilling platformer adventure with unique mechanics.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+1",
                    price: 9.99,
                    status: "released"
                },
                {
                    id: 2,
                    title: "Echoes of Time",
                    description: "A puzzle adventure game where you manipulate time.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+2",
                    price: 14.99,
                    status: "released"
                }
            ],
            upcoming: [
                {
                    id: 3,
                    title: "Dreamscape",
                    description: "Explore a surreal world where dreams and reality collide.",
                    image: "https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Coming+Soon+1",
                    price: 19.99,
                    status: "upcoming"
                }
            ]
        },
        shop: {
            products: [
                {
                    id: 101,
                    title: "Digital Artbook",
                    description: "100+ pages of concept art and sketches.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Artbook",
                    price: 14.99,
                    status: "available",
                    category: "digital"
                }
            ]
        }
    };
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Loaded - Initializing enhanced website");
    initializeEnhancedWebsite();
});

function initializeEnhancedWebsite() {
    try {
        initNavigation();
        initEnhancedCarousels();
        initModalSystem();
        initCartSystem();
        initAdminSystem();
        initDynamicContent();
        initScrollAnimations();
        
        // Load data-based content
        loadDynamicContent();
        updateCartCount();
        
        console.log("Enhanced website initialization complete");
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

// ==========================================================================
// ENHANCED RESPONSIVE CAROUSEL
// ==========================================================================
class EnhancedCarousel {
    constructor(containerId, type) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn("Carousel container not found:", containerId);
            return null;
        }
        
        this.type = type;
        this.track = this.container.querySelector('.carousel-track');
        this.prevBtn = this.container.querySelector('.carousel-prev');
        this.nextBtn = this.container.querySelector('.carousel-next');
        this.dotsContainer = this.container.querySelector('.carousel-dots');
        
        this.slides = [];
        this.currentIndex = 0;
        this.autoSlideInterval = null;
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = null;
        
        this.init();
    }
    
    init() {
        // Load slides from data
        this.loadSlides();
        
        // Create initial slide structure
        this.createSlides();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initialize dots
        this.initDots();
        
        // Start auto-slide on desktop
        if (window.innerWidth > 768) {
            this.startAutoSlide();
        }
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        console.log(`Enhanced carousel initialized (${this.type}) with ${this.slides.length} slides`);
    }
    
    loadSlides() {
        const data = websiteData.carousels[this.type] || [];
        this.slides = [...data];
    }
    
    createSlides() {
        if (!this.track) return;
        
        this.track.innerHTML = '';
        
        this.slides.forEach((slide, index) => {
            const slideHTML = `
                <div class="carousel-slide" data-index="${index}">
                    <img src="${slide.image}" 
                         alt="${slide.title}" 
                         onerror="this.src='https://via.placeholder.com/300x200/333/fff?text=Image+Not+Found'">
                    <div class="carousel-info">
                        <h3>${slide.title}</h3>
                        <p>${slide.description}</p>
                        <div class="shop-price">$${slide.price.toFixed(2)}</div>
                        <span class="shop-status status-${slide.status}">
                            ${slide.status === 'released' ? 'Available' : 'Coming Soon'}
                        </span>
                    </div>
                </div>
            `;
            this.track.insertAdjacentHTML('beforeend', slideHTML);
            
            // Add click event to slide
            const slideElement = this.track.lastElementChild;
            slideElement.addEventListener('click', () => {
                this.showItemModal(slide);
            });
        });
        
        this.updateCarousel();
    }
    
    addEventListeners() {
        // Button navigation
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Touch/mouse events for dragging
        this.track.addEventListener('mousedown', this.touchStart.bind(this));
        this.track.addEventListener('touchstart', this.touchStart.bind(this));
        
        this.track.addEventListener('mousemove', this.touchMove.bind(this));
        this.track.addEventListener('touchmove', this.touchMove.bind(this));
        
        this.track.addEventListener('mouseup', this.touchEnd.bind(this));
        this.track.addEventListener('mouseleave', this.touchEnd.bind(this));
        this.track.addEventListener('touchend', this.touchEnd.bind(this));
        
        // Pause auto-slide on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.container.addEventListener('mouseleave', () => this.startAutoSlide());
    }
    
    touchStart(e) {
        if (window.innerWidth <= 768) return;
        
        this.isDragging = true;
        this.startPos = this.getPositionX(e);
        this.prevTranslate = this.currentTranslate;
        this.animationID = requestAnimationFrame(this.animation.bind(this));
        this.container.style.cursor = 'grabbing';
    }
    
    touchMove(e) {
        if (!this.isDragging) return;
        
        const currentPosition = this.getPositionX(e);
        this.currentTranslate = this.prevTranslate + currentPosition - this.startPos;
    }
    
    touchEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        cancelAnimationFrame(this.animationID);
        this.container.style.cursor = 'grab';
        
        const movedBy = this.currentTranslate - this.prevTranslate;
        const slideWidth = this.track.children[0]?.offsetWidth || 300;
        
        if (movedBy < -100 && this.currentIndex < this.slides.length - 1) {
            this.nextSlide();
        } else if (movedBy > 100 && this.currentIndex > 0) {
            this.prevSlide();
        } else {
            this.updateCarousel();
        }
    }
    
    getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }
    
    animation() {
        if (this.isDragging) {
            this.setSliderPosition();
            requestAnimationFrame(this.animation.bind(this));
        }
    }
    
    setSliderPosition() {
        if (!this.isDragging) {
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        }
    }
    
    updateCarousel() {
        if (!this.track || this.slides.length === 0) return;
        
        const slideWidth = this.track.children[0]?.offsetWidth || 300;
        const gap = 20;
        const translateX = -(this.currentIndex * (slideWidth + gap));
        
        this.track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        if (this.dots) {
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
        
        // Reset dragging
        this.currentTranslate = translateX;
        this.prevTranslate = translateX;
    }
    
    initDots() {
        if (!this.dotsContainer || this.slides.length === 0) return;
        
        this.dotsContainer.innerHTML = '';
        this.dots = [];
        
        for (let i = 0; i < this.slides.length; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        }
        
        this.updateDots();
    }
    
    updateDots() {
        if (!this.dots) return;
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateCarousel();
        this.updateDots();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
        this.updateDots();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentIndex = index;
            this.updateCarousel();
            this.updateDots();
        }
    }
    
    startAutoSlide() {
        if (window.innerWidth <= 768) return;
        
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    handleResize() {
        this.updateCarousel();
        
        // Stop auto-slide on mobile, start on desktop
        if (window.innerWidth <= 768) {
            this.stopAutoSlide();
        } else if (!this.autoSlideInterval) {
            this.startAutoSlide();
        }
    }
    
    showItemModal(item) {
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
        
        const modalBody = document.getElementById('modal-body');
        if (modalBody) {
            modalBody.innerHTML = modalHTML;
            showModal();
        }
    }
}

function initEnhancedCarousels() {
    console.log("Initializing enhanced carousels");
    
    const carousels = [
        { id: 'released-carousel', type: 'released' },
        { id: 'upcoming-carousel', type: 'upcoming' }
    ];
    
    window.carouselInstances = {};
    
    carousels.forEach(({ id, type }) => {
        if (document.getElementById(id)) {
            window.carouselInstances[id] = new EnhancedCarousel(id, type);
        }
    });
}

// ==========================================================================
// DYNAMIC CONTENT LOADING
// ==========================================================================
function loadDynamicContent() {
    // Load introduction text
    const introText = document.querySelector('.websiteIntro p');
    if (introText && websiteData.content.intro) {
        introText.textContent = websiteData.content.intro;
    }
    
    // Load featured sections
    loadFeaturedSections();
    
    // Load shop content if on shop page
    if (window.location.pathname.includes('shop.html')) {
        loadShopContent();
    }
}

function loadFeaturedSections() {
    const featured = websiteData.content.featured;
    
    // Latest release
    const latestImg = document.querySelector('#latest-release img');
    const latestText = document.querySelector('#latest-release + p');
    
    if (latestImg && featured.latest) {
        latestImg.src = featured.latest.image;
        if (latestText) latestText.textContent = featured.latest.text;
    }
    
    // Upcoming project
    const upcomingImg = document.querySelector('#upcoming-project img');
    const upcomingText = document.querySelector('#upcoming-project + p');
    
    if (upcomingImg && featured.upcoming) {
        upcomingImg.src = featured.upcoming.image;
        if (upcomingText) upcomingText.textContent = featured.upcoming.text;
    }
}

// ==========================================================================
// ADMIN SYSTEM
// ==========================================================================
function initAdminSystem() {
    const adminAccessBtn = document.getElementById('admin-access');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminCancelBtn = document.querySelector('.admin-cancel-btn');
    const adminLogoutBtn = document.getElementById('admin-logout');
    const adminPanel = document.getElementById('admin-panel-overlay');
    
    if (!adminAccessBtn || !adminLoginModal) {
        console.warn("Admin elements not found");
        return;
    }
    
    // Show/hide admin access button based on login status
    adminAccessBtn.style.display = isAdmin ? 'none' : 'flex';
    
    // Admin access button click
    adminAccessBtn.addEventListener('click', () => {
        if (isAdmin) {
            adminPanel?.classList.add('active');
        } else {
            adminLoginModal.classList.add('active');
        }
    });
    
    // Admin login form
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;
            
            // Default credentials (change in production!)
            if (username === 'admin' && password === 'dimdesk2025') {
                isAdmin = true;
                localStorage.setItem('dimdesk_admin', 'true');
                adminLoginModal.classList.remove('active');
                adminPanel?.classList.add('active');
                adminAccessBtn.style.display = 'none';
                showNotification('Admin access granted!', 'success');
            } else {
                showNotification('Invalid credentials!', 'error');
            }
        });
    }
    
    // Cancel login
    if (adminCancelBtn) {
        adminCancelBtn.addEventListener('click', () => {
            adminLoginModal.classList.remove('active');
        });
    }
    
    // Logout
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            isAdmin = false;
            localStorage.removeItem('dimdesk_admin');
            adminPanel?.classList.remove('active');
            adminAccessBtn.style.display = 'flex';
            showNotification('Logged out successfully!', 'success');
        });
    }
    
    // Close admin panel with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isAdmin) {
            adminPanel?.classList.remove('active');
        }
    });
    
    // Load admin data
    if (isAdmin && adminPanel) {
        loadAdminData();
    }
}

function loadAdminData() {
    // Load content into admin form
    const introTextarea = document.getElementById('admin-intro-text');
    if (introTextarea && websiteData.content.intro) {
        introTextarea.value = websiteData.content.intro;
    }
    
    // Load featured content
    const featured1Img = document.getElementById('admin-featured-1-img');
    const featured1Text = document.getElementById('admin-featured-1-text');
    
    if (featured1Img && websiteData.content.featured.latest) {
        featured1Img.value = websiteData.content.featured.latest.image;
    }
    if (featured1Text && websiteData.content.featured.latest) {
        featured1Text.value = websiteData.content.featured.latest.text;
    }
    
    // Load carousel items
    loadAdminCarouselItems();
    
    // Load shop items
    loadAdminShopItems();
}

function saveContentChanges() {
    // Save intro text
    const introTextarea = document.getElementById('admin-intro-text');
    if (introTextarea) {
        websiteData.content.intro = introTextarea.value;
    }
    
    // Save featured content
    const featured1Img = document.getElementById('admin-featured-1-img');
    const featured1Text = document.getElementById('admin-featured-1-text');
    
    if (featured1Img && featured1Text) {
        websiteData.content.featured.latest = {
            image: featured1Img.value,
            text: featured1Text.value
        };
    }
    
    // Save to localStorage
    localStorage.setItem('dimdesk_data', JSON.stringify(websiteData));
    
    // Update live content
    loadDynamicContent();
    
    showNotification('Content saved successfully!', 'success');
}

// ==========================================================================
// OTHER FUNCTIONS (Navigation, Cart, Modal, etc.)
// ==========================================================================
// [Keep all your existing functions from the previous main.js, including:]
// - initNavigation()
// - highlightCurrentPage()
// - initModalSystem()
// - showModal(), closeModal()
// - initCartSystem()
// - addToCart(), removeFromCart(), updateCartDisplay(), etc.
// - showNotification()
// - initScrollAnimations()

// ==========================================================================
// SCROLL ANIMATIONS
// ==========================================================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.featured-card, .portfolio-category, .shop-item').forEach(el => {
        observer.observe(el);
    });
}

// ==========================================================================
// EXPORT FUNCTIONS
// ==========================================================================
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.checkout = checkout;
window.closeModal = closeModal;
window.toggleCart = toggleCart;
window.closeCartSidebar = closeCartSidebar;
window.showItemModal = showItemModal;
window.saveContentChanges = saveContentChanges;
