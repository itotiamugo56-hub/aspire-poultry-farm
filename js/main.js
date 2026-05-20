// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement;

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

darkModeToggle.addEventListener('click', () => {
    if (htmlElement.getAttribute('data-theme') === 'dark') {
        htmlElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile hamburger menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Live stats counter animation
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.innerHTML = currentValue.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Intersection Observer for stats
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const eggCountElement = document.getElementById('eggCount');
            const revenueElement = document.getElementById('revenue');
            const dailyEggsElement = document.getElementById('dailyEggs');
            
            if (eggCountElement && eggCountElement.innerHTML === '247') {
                animateValue(eggCountElement, 0, 247, 2000);
            }
            if (revenueElement && revenueElement.innerHTML === '1,247') {
                animateValue(revenueElement, 0, 1247, 2000);
            }
            if (dailyEggsElement && dailyEggsElement.innerHTML === '247') {
                animateValue(dailyEggsElement, 0, 247, 2000);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const splitSection = document.querySelector('.split-screen');
if (splitSection) {
    statsObserver.observe(splitSection);
}

// Scroll reveal animations
const fadeElements = document.querySelectorAll('.product-card, .split-left, .split-right, .testimonial-container, .glass-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

fadeElements.forEach(el => {
    el.classList.add('fade-up');
    revealObserver.observe(el);
});

// Newsletter form submission
const newsletterForm = document.getElementById('newsletterForm');
const newsletterSuccess = document.getElementById('newsletterSuccess');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    if (email) {
        newsletterSuccess.classList.add('show');
        newsletterForm.reset();
        setTimeout(() => {
            newsletterSuccess.classList.remove('show');
        }, 3000);
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Floating animation for product cards
const productCards = document.querySelectorAll('.product-card');
productCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Lazy loading images
const images = document.querySelectorAll('img[loading="lazy"]');
if ('loading' in HTMLImageElement.prototype) {
    images.forEach(img => {
        img.loading = 'lazy';
    });
}

// Add glitch-free dark mode transition
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    const heroImage = new Image();
    heroImage.src = 'assets/images/hero/hero_background.jpg';
});

// ============================================ //
// ASPIRE POULTRY FARM – BUSINESS LOGIC         //
// ============================================ //

// Business hours data (Monday - Sunday)
const businessHours = {
    monday: { open: 8, close: 18, isOpen: true },
    tuesday: { open: 8, close: 18, isOpen: true },
    wednesday: { open: 8, close: 18, isOpen: true },
    thursday: { open: 8, close: 18, isOpen: true },
    friday: { open: 8, close: 18, isOpen: true },
    saturday: { open: 8, close: 16, isOpen: true },
    sunday: { open: null, close: null, isOpen: false }
};

// Get current status - FIXED (removed toLocaleDateString error)
function getBusinessStatus() {
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[now.getDay()];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeDecimal = currentHour + currentMinute / 60;
    
    const todayHours = businessHours[dayName];
    
    if (!todayHours || !todayHours.isOpen) {
        return { status: 'closed', text: 'Closed today', nextOpen: 'Monday at 8 AM' };
    }
    
    const isOpen = currentTimeDecimal >= todayHours.open && currentTimeDecimal < todayHours.close;
    
    if (isOpen) {
        const closeHour = todayHours.close;
        const closeMinute = (todayHours.close % 1) * 60;
        const closeTimeString = `${Math.floor(closeHour)}:${closeMinute.toString().padStart(2, '0')}`;
        return { status: 'open', text: `Open until ${closeTimeString}`, nextOpen: null };
    } else {
        return { status: 'closed', text: `Closed · Opens at ${todayHours.open}:00`, nextOpen: `${todayHours.open}:00` };
    }
}

// Update status badge
function updateStatusBadge() {
    const status = getBusinessStatus();
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    if (statusDot && statusText) {
        if (status.status === 'open') {
            statusDot.classList.remove('closed');
            statusText.innerHTML = status.text;
        } else {
            statusDot.classList.add('closed');
            statusText.innerHTML = status.text;
        }
    }
}

// Render hours timeline - FIXED (no lowercase error)
function renderHoursTimeline() {
    const container = document.getElementById('hoursTimeline');
    if (!container) return;
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const now = new Date();
    const currentDayIndex = now.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[currentDayIndex].toLowerCase();
    
    let html = '';
    days.forEach((day, index) => {
        const hours = businessHours[day];
        const isToday = day === todayName;
        const dayDisplay = dayNames[index];
        
        let hoursDisplay = hours.isOpen ? `${hours.open}:00 – ${hours.close}:00` : 'Closed';
        
        html += `
            <div class="hours-row ${isToday ? 'today' : ''}">
                <span class="hours-day">${dayDisplay}</span>
                <span class="hours-time">${hoursDisplay}</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Review data
const googleReviews = [
    {
        rating: 5,
        text: "Best source for improved kienyeji chicken in Nakuru. The chicks are healthy and their farming guidance is excellent.",
        author: "James M."
    },
    {
        rating: 4,
        text: "Quality fertilized eggs at wholesale price. Very responsive on phone. Will definitely order again.",
        author: "Mary W."
    },
    {
        rating: 5,
        text: "Treated my flock's disease quickly and effectively. Aspire knows poultry medicine. Highly recommend.",
        author: "Peter K."
    },
    {
        rating: 4,
        text: "Healthy jogoo's and reasonable prices. Customer satisfaction is real here.",
        author: "Grace N."
    }
];

// Render reviews
function renderReviews() {
    const container = document.getElementById('reviewGrid');
    if (!container) return;
    
    let html = '';
    googleReviews.slice(0, 3).forEach(review => {
        const stars = '★'.repeat(Math.floor(review.rating)) + '☆'.repeat(5 - Math.floor(review.rating));
        html += `
            <div class="review-card">
                <div class="review-rating">${stars}</div>
                <div class="review-text">"${review.text}"</div>
                <div class="review-author">— ${review.author}</div>
                <div style="margin-top: 12px;"><i class="fab fa-google" style="color: #EA4335; font-size: 12px;"></i> <span style="font-size: 10px; opacity: 0.5;">Google Review</span></div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Quick actions bar
function addQuickActionsBar() {
    const quickActionsHTML = `
        <div class="quick-actions">
            <button class="quick-action-btn" id="quickCallBtn">
                <i class="fas fa-phone"></i>
                <span>Call</span>
            </button>
            <button class="quick-action-btn" id="quickDirectionsBtn">
                <i class="fas fa-location-dot"></i>
                <span>Directions</span>
            </button>
            <button class="quick-action-btn" id="quickMessageBtn">
                <i class="fas fa-comment"></i>
                <span>Message</span>
            </button>
            <button class="quick-action-btn" id="quickShareBtn">
                <i class="fas fa-share"></i>
                <span>Share</span>
            </button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', quickActionsHTML);
    
    document.getElementById('quickCallBtn')?.addEventListener('click', () => {
        window.location.href = 'tel:0728136574';
    });
    
    document.getElementById('quickDirectionsBtn')?.addEventListener('click', () => {
        window.open('https://maps.apple.com/?address=@Aspire_poultry006,Nakuru', '_blank');
    });
    
    document.getElementById('quickMessageBtn')?.addEventListener('click', () => {
        window.location.href = 'sms:0728136574?body=Hi%20Aspire%20Poultry%20Farm%2C%20I%27m%20interested%20in%20your%20products.';
    });
    
    document.getElementById('quickShareBtn')?.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'Aspire Poultry Farm',
                text: 'Check out Aspire Poultry Farm in Nakuru!',
                url: window.location.href
            });
        } else {
            alert('Copy this link: ' + window.location.href);
        }
    });
}

// Initialize all business features
function initBusinessFeatures() {
    updateStatusBadge();
    renderHoursTimeline();
    renderReviews();
    addQuickActionsBar();
    
    setInterval(updateStatusBadge, 60000);
}

// Call this when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBusinessFeatures);
} else {
    initBusinessFeatures();
}

// Console greeting
console.log('%c🐔 Flock – Raise better. Sell smarter.', 'color: #D4A259; font-size: 16px; font-weight: bold;');
console.log('%cDesigned for the modern farm. © 2026', 'color: #8B9A6E; font-size: 12px;');