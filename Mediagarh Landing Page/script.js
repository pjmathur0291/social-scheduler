// Mediagarh Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Loading Animation
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loading);
    
    // Hide loading after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loading.classList.add('hidden');
            setTimeout(() => {
                loading.remove();
            }, 500);
        }, 1000);
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('shadow-lg');
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.style.background = 'white';
            navbar.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Add scroll animation to elements
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .podcast-card, .stat-card, .believer-card');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
    
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    function animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const suffix = element.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 30);
    }
    
    // Form handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Show success message
                showNotification('Thank you for your interest! We will get back to you soon.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroSection.style.transform = `translateY(${parallax}px)`;
        });
    }
    
    // Floating cards hover effect
    const floatingCards = document.querySelectorAll('.floating-cards .card');
    floatingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Service cards hover effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
        });
    });
    
    // Testimonial cards carousel effect
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    function rotateTestimonials() {
        testimonialCards.forEach((card, index) => {
            if (index === currentTestimonial) {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0.7';
                card.style.transform = 'scale(0.95)';
            }
        });
        
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    }
    
    // Start testimonial rotation
    if (testimonialCards.length > 0) {
        setInterval(rotateTestimonials, 3000);
    }
    
    // Podcast cards click effect
    const podcastCards = document.querySelectorAll('.podcast-card');
    podcastCards.forEach(card => {
        card.addEventListener('click', function() {
            showNotification('Podcast feature coming soon!', 'info');
        });
    });
    
    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'btn btn-primary position-fixed';
    backToTopBtn.style.cssText = 'bottom: 20px; right: 20px; z-index: 999; width: 50px; height: 50px; border-radius: 50%; display: none;';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Back to top functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing effect after page load
        setTimeout(typeWriter, 1000);
    }
    
    // Mobile menu close on link click
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Lazy loading for images (if any are added later)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debouncing to scroll events
    const debouncedScrollHandler = debounce(() => {
        // Scroll-based animations and effects
    }, 10);
    
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // Initialize tooltips if Bootstrap tooltips are used
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers if Bootstrap popovers are used
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Video functionality
    const heroVideo = document.querySelector('.hero-video');
    const playBtn = document.querySelector('.video-play-btn');
    const playIcon = document.getElementById('playIcon');
    let isPlaying = false;

    // Auto-hide play button after video starts
    if (heroVideo) {
        heroVideo.addEventListener('play', function() {
            playBtn.style.opacity = '0';
            playBtn.style.pointerEvents = 'none';
            isPlaying = true;
        });

        heroVideo.addEventListener('pause', function() {
            playBtn.style.opacity = '1';
            playBtn.style.pointerEvents = 'auto';
            isPlaying = false;
        });

        // Show play button on hover when paused
        const videoWrapper = document.querySelector('.hero-video-wrapper');
        if (videoWrapper) {
            videoWrapper.addEventListener('mouseenter', function() {
                if (!isPlaying) {
                    playBtn.style.opacity = '1';
                }
            });

            videoWrapper.addEventListener('mouseleave', function() {
                if (!isPlaying) {
                    playBtn.style.opacity = '0.7';
                }
            });
        }
    }

    // Global function for video toggle
    window.toggleVideo = function() {
        if (heroVideo) {
            if (heroVideo.paused) {
                heroVideo.play();
                playIcon.className = 'fas fa-pause';
            } else {
                heroVideo.pause();
                playIcon.className = 'fas fa-play';
            }
        }
    };

    // Intersection Observer for video autoplay
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Video is in view, ensure it's playing
                if (heroVideo && heroVideo.paused) {
                    heroVideo.play().catch(e => {
                        console.log('Autoplay prevented:', e);
                    });
                }
            } else {
                // Video is out of view, pause it
                if (heroVideo && !heroVideo.paused) {
                    heroVideo.pause();
                }
            }
        });
    }, { threshold: 0.5 });

    if (heroVideo) {
        videoObserver.observe(heroVideo);
    }

    // Owl Carousel functionality
    $(document).ready(function() {
        console.log('jQuery loaded, initializing Owl Carousel...');
        
        // Check if Owl Carousel is available
        if (typeof $.fn.owlCarousel === 'undefined') {
            console.error('Owl Carousel not loaded!');
            return;
        }
        
        // Initialize Owl Carousel for each row
        try {
            $('#carousel-row-1').owlCarousel({
                items: 6,
                loop: true,
                autoplay: true,
                autoplayTimeout: 4000,
                autoplayHoverPause: true,
                autoplaySpeed: 3000,
                nav: false,
                dots: false,
                margin: 20,
                smartSpeed: 1000,
                stagePadding: 0,
                responsive: {
                    0: { items: 2, margin: 15 },
                    576: { items: 3, margin: 20 },
                    768: { items: 4, margin: 20 },
                    992: { items: 5, margin: 20 },
                    1200: { items: 6, margin: 20 }
                },
                onInitialized: function() {
                    console.log('Row 1 initialized with', this.items().length, 'items');
                }
            });
            console.log('Carousel row 1 initialized');
            console.log('Row 1 items count:', $('#carousel-row-1 .item').length);

            $('#carousel-row-2').owlCarousel({
                items: 6,
                loop: true,
                autoplay: true,
                autoplayTimeout: 4500,
                autoplayHoverPause: true,
                autoplaySpeed: 3500,
                nav: false,
                dots: false,
                margin: 20,
                smartSpeed: 1200,
                stagePadding: 0,
                rtl: true, // Reverse direction for row 2
                responsive: {
                    0: { items: 2, margin: 15 },
                    576: { items: 3, margin: 20 },
                    768: { items: 4, margin: 20 },
                    992: { items: 5, margin: 20 },
                    1200: { items: 6, margin: 20 }
                }
            });
            console.log('Carousel row 2 initialized');
            console.log('Row 2 items count:', $('#carousel-row-2 .item').length);

            $('#carousel-row-3').owlCarousel({
                items: 6,
                loop: true,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                autoplaySpeed: 4000,
                nav: false,
                dots: false,
                margin: 20,
                smartSpeed: 1500,
                stagePadding: 0,
                responsive: {
                    0: { items: 2, margin: 15 },
                    576: { items: 3, margin: 20 },
                    768: { items: 4, margin: 20 },
                    992: { items: 5, margin: 20 },
                    1200: { items: 6, margin: 20 }
                }
            });
            console.log('Carousel row 3 initialized');
            console.log('Row 3 items count:', $('#carousel-row-3 .item').length);
            
            console.log('All Owl Carousels initialized successfully!');
        } catch (error) {
            console.error('Error initializing Owl Carousel:', error);
            // Fallback: Show logos without carousel
            $('.owl-carousel-container .owl-carousel').addClass('fallback-carousel');
            $('.owl-carousel-container .owl-carousel .item').show();
        }
    });
    
    // Fallback: If Owl Carousel doesn't load within 3 seconds, show static logos
    setTimeout(function() {
        if (!$('.owl-carousel').hasClass('owl-loaded')) {
            console.log('Owl Carousel failed to load, showing fallback');
            $('.owl-carousel-container .owl-carousel').addClass('fallback-carousel');
            $('.owl-carousel-container .owl-carousel .item').show();
        }
    }, 3000);

    // Debug image loading
    const logoImages = document.querySelectorAll('.believer-logo img');
    logoImages.forEach((img, index) => {
        img.addEventListener('load', function() {
            console.log(`Logo ${index + 1} loaded successfully:`, this.src);
        });
        img.addEventListener('error', function() {
            console.error(`Logo ${index + 1} failed to load:`, this.src);
        });
    });

    // Podcast video functionality
    window.playPodcast = function(videoUrl) {
        const modal = new bootstrap.Modal(document.getElementById('podcastModal'));
        const video = document.getElementById('podcastVideo');
        video.src = videoUrl;
        modal.show();
        
        // Play video when modal is shown
        document.getElementById('podcastModal').addEventListener('shown.bs.modal', function () {
            video.play();
        });
        
        // Pause video when modal is hidden
        document.getElementById('podcastModal').addEventListener('hidden.bs.modal', function () {
            video.pause();
            video.currentTime = 0;
        });
    };

    console.log('Mediagarh Landing Page loaded successfully!');
});
