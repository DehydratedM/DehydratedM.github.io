// main.js - Enhanced with dynamic loading and carousel system
console.log("DimDesk Studios - Main Script Loaded");

// ==========================================================================
// GLOBAL VARIABLES
// ==========================================================================
let cart = JSON.parse(localStorage.getItem('dimdesk_cart')) || [];
let websiteData = JSON.parse(localStorage.getItem('dimdesk_data')) || getDefaultData();
let carouselInstances = {};

// ==========================================================================
// DEFAULT DATA STRUCTURE
// ==========================================================================
function getDefaultData() {
    return {
        // Home Page
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
        
        // Shop Page
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
                    type: "game"
                },
                {
                    id: 2,
                    title: "Digital Artbook",
                    description: "100+ pages of concept art, sketches, and development insights.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Digital+Artbook",
                    price: 14.99,
                    status: "released",
                    type: "digital"
                },
                {
                    id: 3,
                    title: "Original Soundtrack",
                    description: "Complete game soundtrack with 25+ tracks in high quality formats.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Soundtrack",
                    price: 7.99,
                    status: "released",
                    type: "digital"
                },
                {
                    id: 4,
                    title: "Physical Collector's Edition",
                    description: "Limited edition physical release with exclusive merchandise.",
                    image: "https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Physical+Edition",
                    price: 49.99,
                    status: "upcoming",
                    type: "physical"
                }
            ]
        },
        
        // Portfolio Page
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
                        }
                    ]
                }
            ]
        },
        
        // Carousel Games
        carousels: {
            released: [
                {
                    id: 1,
                    title: "Project Alpha",
                    description: "A thrilling platformer adventure with unique mechanics and stunning visuals.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+1",
                    price: 9.99,
                    status: "released"
                },
                {
                    id: 2,
                    title: "Echoes of Time",
                    description: "A puzzle adventure game where you manipulate time to solve mysteries.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+2",
                    price: 14.99,
                    status: "released"
                },
                {
                    id: 3,
                    title: "Neon Runner",
                    description: "Fast-paced endless runner set in a cyberpunk world with retro aesthetics.",
                    image: "https://via.placeholder.com/300x200/2c3e50/ecf0f1?text=Game+3",
                    price: 7.99,
                    status: "released"
                }
            ],
            upcoming: [
                {
                    id: 4,
                    title: "Dreamscape",
                    description: "Explore a surreal world where dreams and reality collide in this atmospheric adventure.",
                    image: "https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Coming+Soon+1",
                    price: 19.99,
                    status: "upcoming"
                },
                {
                    id: 5,
                    title: "Chrono Knights",
                    description: "Time-traveling knights battle through different historical eras in this action RPG.",
                    image: "https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Coming+Soon+2",
                    price: 24.99,
                    status: "upcoming"
                },
                {
                    id: 6,
                    title: "Pixel Legends",
                    description: "Retro-inspired RPG with modern gameplay mechanics and epic storytelling.",
                    image: "https://via.placeholder.com/300x200/8e44ad/ecf0f1?text=Coming+Soon+3",
                    price: 17.99,
                    status: "upcoming"
                }
            ]
        }
    };
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Loaded - Initializing website");
    initializeWebsite();
});

function initializeWebsite() {
    try {
        initNavigation();
        initDynamicContent();
        initCarousels();
        initModalSystem();
        initCartSystem();
        initScrollAnimations();
        
        updateCartCount();
        
        console.log("Website initialization complete");
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

// ==========================================================================
// DYNAMIC CONTENT LOADING
// ==========================================================================
function initDynamicContent() {
    // Load based on current page
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    if (page === 'index.html' || page === '' || page.includes('SiteTest')) {
        loadHomeContent();
    } else if (page === 'shop.html') {
        loadShopContent();
    } else if (page === 'portfolio.html') {
        loadPortfolioContent();
    }
}

function loadHomeContent() {
    // Load intro text
    const introText = document.getElementById('intro-text');
    if (introText && websiteData.home.intro) {
        // Replace newlines with <br> tags for HTML display
        introText.innerHTML = websiteData.home.intro.replace(/\n/g, '<br>');
    }
    
    // Load featured sections
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
    // Load shop intro
    const shopIntro = document.getElementById('shop-intro');
    if (shopIntro && websiteData.shop.intro) {
        // Replace ^^ with superscript
        shopIntro.innerHTML = websiteData.shop.intro.replace(/\^\^/g, '<sup>†</sup>');
    }
    
    // Load shop products
    const shopGrid = document.getElementById('shop-products-grid');
    if (shopGrid && websiteData.shop.products) {
        let html = '';
        websiteData.shop.products.forEach(product => {
            html += `
                <div class="shop-item" onclick="showProductModal(${product.id})">
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
    // Load portfolio intro
    const portfolioIntro = document.getElementById('portfolio-intro');
    if (portfolioIntro && websiteData.portfolio.intro) {
        portfolioIntro.innerHTML = websiteData.portfolio.intro.replace(/\n/g, '<br>');
    }
    
    // Load skills
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
// ENHANCED CAROUSEL SYSTEM
// ==========================================================================
function initCarousels() {
    // Initialize carousels based on page
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    if (page === 'index.html' || page === '' || page.includes('SiteTest')) {
        // Home page carousels
        if (document.getElementById('released-carousel')) {
            carouselInstances.released = new Carousel('released-carousel', 'released');
        }
        if (document.getElementById('upcoming-carousel')) {
            carouselInstances.upcoming = new Carousel('upcoming-carousel', 'upcoming');
        }
    } else if (page === 'shop.html') {
        // Shop page carousels
        if (document.getElementById('shop-available-carousel')) {
            carouselInstances.shopAvailable = new Carousel('shop-available-carousel', 'released');
        }
        if (document.getElementById('shop-upcoming-carousel')) {
            carouselInstances.shopUpcoming = new Carousel('shop-upcoming-carousel', 'upcoming');
        }
    }
}

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
        this.startAutoSlide();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.slidesPerView = this.getSlidesPerView();
            this.updateCarousel();
        });
    }
    
    getSlidesPerView() {
        const width = window.innerWidth;
        if (width >= 1200) return 3; // Desktop
        if (width >= 992) return 2;  // Laptop
        if (width >= 768) return 2;  // Tablet
        return 1;                    // Mobile
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
    }
    
    loadSlides() {
        const data = this.type === 'released' ? websiteData.carousels.released : websiteData.carousels.upcoming;
        if (!data || !this.track) return;
        
        this.track.innerHTML = '';
        this.totalSlides = data.length;
        
        data.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `
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
        this.dots = [];
        
        const totalDots = Math.ceil(this.totalSlides / this.slidesPerView);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to slide group ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i * this.slidesPerView));
            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        }
        
        this.updateDots();
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
        
        const currentDot = Math.floor(this.currentIndex / this.slidesPerView);
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentDot);
        });
    }
    
    nextSlide() {
        if (this.currentIndex >= this.totalSlides - this.slidesPerView) {
            this.currentIndex = 0; // Loop back to start
        } else {
            this.currentIndex += this.slidesPerView;
        }
        this.updateCarousel();
    }
    
    prevSlide() {
        if (this.currentIndex <= 0) {
            this.currentIndex = this.totalSlides - this.slidesPerView; // Loop to end
        } else {
            this.currentIndex -= this.slidesPerView;
        }
        this.updateCarousel();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentIndex = index;
            this.updateCarousel();
        }
    }
    
    startAutoSlide() {
        if (window.innerWidth <= 768) return; // Don't auto-slide on mobile
        
        this.stopAutoSlide();
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
    
    showItemModal(item) {
        const modalHTML = `
            <h2 style="color: lightcoral; margin-bottom: 1rem;">${item.title}</h2>
            <img src="${item.image}" alt="${item.title}" style="width: 100%; border-radius: 10px; margin-bottom: 1rem;" loading="lazy">
            <p style="color: wheat; margin-bottom: 1rem;">${item.description}</p>
            <div style="text-align: center;">
                <div style="color: lightcoral; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
                    $${item.price.toFixed(2)}
                </div>
                <button onclick="addToCart(${item.id})" style="background: lightcoral; color: #000; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: bold; cursor: pointer; margin-right: 0.5rem;">
                    Add to Cart
                </button>
                <button onclick="closeModal()" style="background: transparent; color: lightcoral; border: 1px solid lightcoral; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">
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
// NAVIGATION
// ==========================================================================
function initNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileToggle || !navLinks) return;
    
    mobileToggle.addEventListener('click', function() {
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
        if (!navLinks.contains(event.target) && !mobileToggle.contains(event.target)) {
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
            if (link.getAttribute('href') === 'index.html' || link.getAttribute('href') === './') {
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
        }
    });
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
    
    // Close modal with Escape key
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

// Show product modal for shop items
function showProductModal(productId) {
    const product = websiteData.shop.products.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found!', 'error');
        return;
    }
    
    const modalHTML = `
        <h2 style="color: lightcoral; margin-bottom: 1rem;">${product.title}</h2>
        <img src="${product.image}" alt="${product.title}" style="width: 100%; border-radius: 10px; margin-bottom: 1rem;" loading="lazy">
        <p style="color: wheat; margin-bottom: 1rem;">${product.description}</p>
        <div style="margin-bottom: 1rem; color: #aaa;">
            <span class="shop-status status-${product.status}" style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 4px;">
                ${product.status === 'released' ? 'Available Now' : 'Coming Soon'}
            </span>
            <span style="margin-left: 1rem;">Type: ${product.type}</span>
        </div>
        <div style="text-align: center;">
            <div style="color: lightcoral; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
                $${product.price.toFixed(2)}
            </div>
            ${product.status === 'released' ? 
                `<button onclick="addToCart(${product.id})" style="background: lightcoral; color: #000; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: bold; cursor: pointer; margin-right: 0.5rem;">
                    Add to Cart
                </button>` : 
                `<button style="background: #666; color: #ccc; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: bold; cursor: not-allowed;" disabled>
                    Coming Soon
                </button>`
            }
            <button onclick="closeModal()" style="background: transparent; color: lightcoral; border: 1px solid lightcoral; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">
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
// CART SYSTEM
// ==========================================================================
function initCartSystem() {
    const cartToggle = document.querySelector('.cart-toggle');
    const closeCart = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
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
    
    // Close cart when clicking outside
    if (cartSidebar) {
        cartSidebar.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCartSidebar();
            }
        });
    }
    
    // Update cart display
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
    // Find product in website data
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
    
    // Don't add upcoming products to cart
    if (product.status === 'upcoming') {
        showNotification('This product is not available yet!', 'error');
        return;
    }
    
    // Check if item already in cart
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
    
    // Save to localStorage
    localStorage.setItem('dimdesk_cart', JSON.stringify(cart));
    
    // Update display
    updateCartDisplay();
    updateCartCount();
    
    // Show feedback
    showNotification(`Added ${product.title} to cart!`);
    
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
    const cartSubtotal = document.getElementById('cart-subtotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.textContent = '$0.00';
        if (cartSubtotal) cartSubtotal.textContent = '$0.00';
    } else {
        let itemsHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
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
        
        // Calculate tax (example: 10%)
        const tax = subtotal * 0.1;
        const total = subtotal + tax;
        
        cartItems.innerHTML = itemsHTML;
        cartTotal.textContent = `$${total.toFixed(2)}`;
        if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
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
    
    // In a real implementation, this would redirect to a payment processor
    // For now, we'll just show a success message
    const modalHTML = `
        <h2 style="color: lightcoral; margin-bottom: 1rem;">Order Summary</h2>
        <div style="background: rgba(255, 255, 255, 0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Subtotal:</span>
                <span>$${(total * 0.9).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Tax (10%):</span>
                <span>$${(total * 0.1).toFixed(2)}</span>
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
    
    // Clear cart after checkout
    cart = [];
    localStorage.setItem('dimdesk_cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
    
    // Show success message
    showNotification(`Purchase successful! Thank you for your order of $${total.toFixed(2)}`);
    
    // Close both modals and cart sidebar
    closeModal();
    closeCartSidebar();
}

// ==========================================================================
// UTILITY FUNCTIONS
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
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements for animation
    document.querySelectorAll('.featured-card, .portfolio-category, .shop-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add this to your code if you want simple password protection
const ADMIN_PASSWORD = "dimdesk2024"; // Change this to your actual password

function checkPassword() {
    const password = prompt("Enter admin password:");
    if (password === ADMIN_PASSWORD) {
        showNotification("Access granted!", "success");
        // Enable admin features here
        return true;
    } else {
        showNotification("Incorrect password", "error");
        return false;
    }
}

// Call this when needed
// checkPassword();

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
