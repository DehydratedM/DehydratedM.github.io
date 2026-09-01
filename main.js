// main.js - Enhanced with smooth video looping and optimized performance
// ==========================================================================
// GLOBAL VARIABLES
// ==========================================================================
let cart = JSON.parse(localStorage.getItem('dimdesk_cart')) || [];
let websiteData = JSON.parse(localStorage.getItem('dimdesk_data')) || getDefaultData();
let carouselInstances = {};
let wishlist = JSON.parse(localStorage.getItem('dimdesk_wishlist')) || [];
let carouselEnabled = localStorage.getItem('dimdesk_carousel_enabled') !== 'false';
let videoElement = null;
let videoRetryCount = 0;
const MAX_VIDEO_RETRIES = 3;

// ==========================================================================
// ENHANCED VIDEO SYSTEM - SMOOTH LOOPING
// ==========================================================================
function initVideoSystem() {
    videoElement = document.getElementById('bg-video');
    
    if (!videoElement) return;
    
    // Set video properties for smooth playback
    videoElement.preload = 'auto';
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.autoplay = true;
    videoElement.loop = true;
    
    // Remove any existing listeners to prevent duplicates
    videoElement.removeEventListener('timeupdate', handleVideoTimeUpdate);
    videoElement.removeEventListener('ended', handleVideoEnded);
    videoElement.removeEventListener('stalled', handleVideoStalled);
    videoElement.removeEventListener('waiting', handleVideoWaiting);
    videoElement.removeEventListener('error', handleVideoError);
    
    // Add smooth loop handlers
    videoElement.addEventListener('timeupdate', handleVideoTimeUpdate);
    videoElement.addEventListener('ended', handleVideoEnded);
    videoElement.addEventListener('stalled', handleVideoStalled);
    videoElement.addEventListener('waiting', handleVideoWaiting);
    videoElement.addEventListener('error', handleVideoError);
    
    // Try to play
    playVideo();
}

function handleVideoTimeUpdate() {
    if (!videoElement || !videoElement.duration) return;
    
    // Smooth loop before the end to avoid stutter
    const LOOP_THRESHOLD = 0.15; // Loop 150ms before end
    if (videoElement.currentTime >= videoElement.duration - LOOP_THRESHOLD) {
        videoElement.currentTime = 0;
        videoElement.play().catch(() => {});
    }
    
    // Reset retry count when video is playing
    if (!videoElement.paused && !videoElement.ended) {
        videoRetryCount = 0;
    }
}

function handleVideoEnded() {
    if (!videoElement) return;
    videoElement.currentTime = 0;
    playVideo();
}

function handleVideoStalled() {
    console.log('Video stalled, attempting to resume...');
    playVideo();
}

function handleVideoWaiting() {
    // Don't spam retries
    if (videoRetryCount < MAX_VIDEO_RETRIES) {
        videoRetryCount++;
        setTimeout(() => {
            playVideo();
        }, 500 * videoRetryCount); // Increasing delay
    }
}

function handleVideoError(e) {
    console.error('Video error:', e);
    // Hide video if it keeps failing
    if (videoRetryCount >= MAX_VIDEO_RETRIES) {
        const bgVideo = document.querySelector('.background-video');
        if (bgVideo) {
            bgVideo.style.display = 'none';
        }
    }
}

function playVideo() {
    if (!videoElement) return;
    
    const playPromise = videoElement.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                videoRetryCount = 0;
            })
            .catch(error => {
                console.log('Video play failed, retrying...', error);
                if (videoRetryCount < MAX_VIDEO_RETRIES) {
                    videoRetryCount++;
                    setTimeout(() => {
                        playVideo();
                    }, 1000 * videoRetryCount);
                }
            });
    }
}

// Mouse-following sparkle effect
document.addEventListener('mousemove', function(e) {
    // Create sparkle element
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-trail';
    
    // Random sparkle character
    const sparkles = ['✨', '⭐', '💫', '🌟', '✨', '⚡'];
    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    
    // Random position offset
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;
    
    // Set position
    sparkle.style.left = (e.clientX + offsetX) + 'px';
    sparkle.style.top = (e.clientY + offsetY) + 'px';
    
    // Random size
    const size = 10 + Math.random() * 15;
    sparkle.style.fontSize = size + 'px';
    
    // Random rotation
    sparkle.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    // Add to body
    document.body.appendChild(sparkle);
    
    // Remove after animation
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
});

// Throttle sparkle creation for performance
let lastSparkleTime = 0;
document.addEventListener('mousemove', function(e) {
    const now = Date.now();
    if (now - lastSparkleTime < 150) return; // Only create sparkle every 150ms
    lastSparkleTime = now;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-trail';
    const sparkles = ['✨', '⭐', '💫', '🌟'];
    sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    sparkle.style.left = (e.clientX + (Math.random() - 0.5) * 15) + 'px';
    sparkle.style.top = (e.clientY + (Math.random() - 0.5) * 15) + 'px';
    sparkle.style.fontSize = (8 + Math.random() * 12) + 'px';
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
});

// ==========================================================================
// SMOOTH CAROUSEL CLASS WITH IMPROVED PERFORMANCE
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
        this.autoSlideDelay = 5000;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchCurrentX = 0;
        
        this.init();
        
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.slidesPerView = this.getSlidesPerView();
                this.updateCarousel();
                this.initDots();
            }, 250);
        });
    }
    
    getSlidesPerView() {
        const width = window.innerWidth;
        if (width >= 1200) return 3;
        if (width >= 768) return 2;
        return 1;
    }
    
    init() {
        this.loadSlides();
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.initDots();
        this.updateCarousel();
        this.startAutoSlide();
        this.addTouchSupport();
    }
    
    loadSlides() {
        const data = this.type === 'released' ? websiteData.carousels.released : websiteData.carousels.upcoming;
        if (!data || !this.track) return;
        
        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        this.totalSlides = data.length;
        
        data.forEach((item) => {
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
                    ${item.externalLinks ? this.renderExternalLinks(item.externalLinks) : ''}
                </div>
            `;
            
            slide.addEventListener('click', () => {
                this.showItemModal(item);
            });
            
            fragment.appendChild(slide);
        });
        
        this.track.innerHTML = '';
        this.track.appendChild(fragment);
        this.updateSlideWidths();
    }
    
    updateSlideWidths() {
        const slides = this.track.querySelectorAll('.carousel-slide');
        const slideWidthPercentage = 100 / this.slidesPerView;
        const gap = 20; // pixels
        
        slides.forEach(slide => {
            slide.style.flex = `0 0 calc(${slideWidthPercentage}% - ${gap}px)`;
            slide.style.minWidth = `calc(${slideWidthPercentage}% - ${gap}px)`;
            slide.style.maxWidth = `calc(${slideWidthPercentage}% - ${gap}px)`;
        });
    }
    
    renderExternalLinks(links) {
        if (!links || Object.keys(links).length === 0) return '';
        
        let html = '<div class="external-links">';
        for (const [platform, url] of Object.entries(links)) {
            const icon = this.getPlatformIcon(platform);
            html += `
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="external-link" 
                   onclick="event.stopPropagation();" title="Available on ${platform}">
                    ${icon}
                </a>
            `;
        }
        html += '</div>';
        return html;
    }
    
    getPlatformIcon(platform) {
        const icons = {
            'steam': '🎮',
            'itch.io': '🎯',
            'gog': '📀',
            'epic': '🏪',
            'humble': '🎁',
            'direct': '🌐'
        };
        return icons[platform.toLowerCase()] || '🔗';
    }
    
    initDots() {
        if (!this.dotsContainer || this.totalSlides === 0) return;
        
        const totalGroups = Math.ceil(this.totalSlides / this.slidesPerView);
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < totalGroups; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-indicator';
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide group ${i + 1}`);
            dot.addEventListener('click', () => this.goToGroup(i));
            fragment.appendChild(dot);
        }
        
        this.dotsContainer.innerHTML = '';
        this.dotsContainer.appendChild(fragment);
        this.dots = this.dotsContainer.querySelectorAll('.carousel-indicator');
    }
    
    updateCarousel() {
        if (!this.track || this.totalSlides === 0 || this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        const slideWidth = 100 / this.slidesPerView;
        const translateX = -(this.currentIndex * slideWidth);
        
        this.track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        this.track.style.transform = `translateX(${translateX}%)`;
        
        this.updateDots();
        
        // Reset transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    updateDots() {
        if (!this.dots) return;
        
        const currentGroup = Math.floor(this.currentIndex / this.slidesPerView);
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentGroup);
        });
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        this.stopAutoSlide();
        
        if (this.currentIndex >= this.totalSlides - this.slidesPerView) {
            this.currentIndex = 0;
        } else {
            this.currentIndex += this.slidesPerView;
        }
        
        this.updateCarousel();
        this.startAutoSlide();
    }
    
    prevSlide() {
        if (this.isTransitioning) return;
        this.stopAutoSlide();
        
        if (this.currentIndex <= 0) {
            this.currentIndex = this.totalSlides - this.slidesPerView;
        } else {
            this.currentIndex -= this.slidesPerView;
        }
        
        this.updateCarousel();
        this.startAutoSlide();
    }
    
    goToGroup(groupIndex) {
        if (this.isTransitioning) return;
        this.stopAutoSlide();
        this.currentIndex = groupIndex * this.slidesPerView;
        this.updateCarousel();
        this.startAutoSlide();
    }
    
    startAutoSlide() {
        if (this.autoSlideInterval) return;
        
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoSlideDelay);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    addTouchSupport() {
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.stopAutoSlide();
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            this.touchCurrentX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', () => {
            const diff = this.touchStartX - this.touchCurrentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            this.startAutoSlide();
        }, { passive: true });
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
            ${item.externalLinks ? this.renderModalExternalLinks(item.externalLinks) : ''}
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
    
    renderModalExternalLinks(links) {
        if (!links || Object.keys(links).length === 0) return '';
        
        let html = '<div style="margin-bottom: 1rem; display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap;">';
        for (const [platform, url] of Object.entries(links)) {
            const icon = this.getPlatformIcon(platform);
            html += `
                <a href="${url}" target="_blank" rel="noopener noreferrer" 
                   style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(255, 255, 255, 0.1); border-radius: 8px; color: wheat; text-decoration: none; border: 1px solid rgba(255, 255, 255, 0.2); transition: all 0.3s ease;">
                    ${icon}
                    <span>${platform}</span>
                </a>
            `;
        }
        html += '</div>';
        return html;
    }
}

// ==========================================================================
// SMOOTH NAVIGATION
// ==========================================================================
function initNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileToggle || !navLinks) return;
    
    // Smooth mobile menu toggle
    mobileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Add smooth animation
        if (navLinks.classList.contains('active')) {
            navLinks.style.transition = 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    });
    
    // Close menu when clicking links with smooth animation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.style.transition = 'right 0.3s ease';
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                // Reset transition after animation
                setTimeout(() => {
                    navLinks.style.transition = '';
                }, 300);
            }
        });
    });
    
    highlightCurrentPage();
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnToggle = mobileToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
    
    // Handle window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }, 250);
    });
    
    // ESC key to close menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// ==========================================================================
// SMOOTH MODAL SYSTEM
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
        modalOverlay.style.display = 'flex';
        modalOverlay.style.opacity = '0';
        modalOverlay.classList.add('active');
        
        // Smooth fade in
        requestAnimationFrame(() => {
            modalOverlay.style.transition = 'opacity 0.3s ease';
            modalOverlay.style.opacity = '1';
        });
        
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        // Smooth fade out
        modalOverlay.style.transition = 'opacity 0.3s ease';
        modalOverlay.style.opacity = '0';
        
        setTimeout(() => {
            modalOverlay.style.display = 'none';
            modalOverlay.classList.remove('active');
        }, 300);
        
        document.body.style.overflow = '';
    }
}

// ==========================================================================
// SMOOTH NOTIFICATION SYSTEM
// ==========================================================================
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => existing.remove(), 300);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'rgba(220, 53, 69, 0.95)' : 
                    type === 'warning' ? 'rgba(255, 193, 7, 0.95)' : 
                    'rgba(40, 167, 69, 0.95)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 300px;
        word-wrap: break-word;
        backdrop-filter: blur(10px);
    `;
    
    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
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
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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
        initVideoSystem(); // Initialize video first
        initNavigation();
        initDynamicContent();
        checkCarouselStatus();
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
window.removeFromWishlist = removeFromWishlist;
window.addToCartFromWishlist = addToCartFromWishlist;
window.clearWishlist = clearWishlist;
window.toggleCarousels = toggleCarousels;
window.initCarousels = initCarousels;
window.playVideo = playVideo;
