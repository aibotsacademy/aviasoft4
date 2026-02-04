// State
let lastScrollY = 0;
let currentSky = 'sunrise';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initScroll();
    initNavigation();
    initRAMPDashboard();
    initWheelchairDashboard();
    initMonitorDashboard();
    initKiosk();
    initButtonEffects();
});

// Scroll Management
function initScroll() {
    const airplane = document.querySelector('.airplane-indicator');
    const sky = document.querySelector('.sky-background');
    const sections = document.querySelectorAll('.section');
    
    updateAirplanePosition();
    
    window.addEventListener('scroll', () => {
        updateAirplanePosition();
        updateScrollDirection();
        updateSkyTransition(sections, sky);
        updateNavActive(sections);
    });
}

function updateAirplanePosition() {
    const airplane = document.querySelector('.airplane-indicator');
    const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const position = 120 + (progress * (window.innerHeight - 240));
    airplane.style.top = `${position}px`;
}

function updateScrollDirection() {
    const airplane = document.querySelector('.airplane-indicator');
    const scrollY = window.scrollY;
    
    if (scrollY > lastScrollY) {
        airplane.classList.add('scrolling-down');
        airplane.classList.remove('scrolling-up');
    } else if (scrollY < lastScrollY) {
        airplane.classList.add('scrolling-up');
        airplane.classList.remove('scrolling-down');
    }
    
    lastScrollY = scrollY;
}

function updateSkyTransition(sections, sky) {
    const scrollY = window.scrollY + window.innerHeight / 2;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        
        if (scrollY >= top && scrollY < bottom) {
            const newSky = section.dataset.sky || 'day';
            if (currentSky !== newSky) {
                currentSky = newSky;
                sky.className = 'sky-background ' + newSky;
            }
        }
    });
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const navHeight = document.querySelector('.main-nav').offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Hero CTA
    document.querySelectorAll('.btn-hero, .btn-primary').forEach(btn => {
        if (!btn.classList.contains('nav-cta')) {
            btn.addEventListener('click', () => {
                const firstSection = document.getElementById('ramp-report');
                if (firstSection) {
                    const navHeight = document.querySelector('.main-nav').offsetHeight;
                    window.scrollTo({
                        top: firstSection.offsetTop - navHeight,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
}

function updateNavActive(sections) {
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollY = window.scrollY + window.innerHeight / 2;
    
    sections.forEach((section, index) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        
        if (scrollY >= top && scrollY < bottom) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLinks[index]) {
                navLinks[index].classList.add('active');
            }
        }
    });
}

// RAMP Dashboard with Data Switching
function initRAMPDashboard() {
    const metricCards = document.querySelectorAll('#ramp-metrics .metric-card');
    const viewToggles = document.querySelectorAll('#ramp-report .view-toggle');
    
    // Metric data sets
    const metricData = {
        turnaround: {
            title: 'Active Turnarounds',
            flights: [
                { number: 'AA 2847', route: 'JFK → LHR', gate: 'Gate 24B', time: '38 min', status: 'success', progress: 72, premium: true },
                { number: 'BA 0117', route: 'LHR → JFK', gate: 'Gate 12C', time: '45 min', status: 'success', progress: 58 },
                { number: 'LH 0400', route: 'FRA → JFK', gate: 'Gate 8A', time: '52 min', status: 'warning', progress: 89 }
            ]
        },
        gpu: {
            title: 'Ground Power Units',
            flights: [
                { number: 'AA 2847', route: 'Connected', gate: 'Gate 24B', time: '42 min', status: 'success', progress: 100, premium: true },
                { number: 'EK 0215', route: 'Connected', gate: 'Gate 15F', time: '28 min', status: 'success', progress: 100 },
                { number: 'QR 0701', route: 'Connecting', gate: 'Gate 9G', time: '5 min', status: 'warning', progress: 45 }
            ]
        },
        fuel: {
            title: 'Fuel Services',
            flights: [
                { number: 'BA 0117', route: 'Fueling', gate: 'Gate 12C', time: '18 min', status: 'success', progress: 65, premium: true },
                { number: 'LH 0400', route: 'Complete', gate: 'Gate 8A', time: 'Done', status: 'success', progress: 100 },
                { number: 'AF 0083', route: 'Scheduled', gate: 'Gate 7E', time: '12 min', status: 'scheduled', progress: 0 }
            ]
        },
        catering: {
            title: 'Catering Services',
            flights: [
                { number: 'AA 2847', route: 'In Progress', gate: 'Gate 24B', time: '15 min', status: 'success', progress: 78, premium: true },
                { number: 'EK 0215', route: 'Complete', gate: 'Gate 15F', time: 'Done', status: 'success', progress: 100 },
                { number: 'BA 0117', route: 'Loading', gate: 'Gate 12C', time: '22 min', status: 'success', progress: 54 }
            ]
        },
        baggage: {
            title: 'Baggage Operations',
            flights: [
                { number: 'LH 0400', route: '156 bags', gate: 'Gate 8A', time: '28 min', status: 'success', progress: 85, premium: true },
                { number: 'QR 0701', route: '203 bags', gate: 'Gate 9G', time: '35 min', status: 'warning', progress: 92 },
                { number: 'AF 0083', route: '87 bags', gate: 'Gate 7E', time: '18 min', status: 'success', progress: 67 }
            ]
        },
        cleaning: {
            title: 'Cabin Services',
            flights: [
                { number: 'AA 2847', route: 'Deep Clean', gate: 'Gate 24B', time: '32 min', status: 'success', progress: 88, premium: true },
                { number: 'BA 0117', route: 'Quick Turn', gate: 'Gate 12C', time: '15 min', status: 'success', progress: 95 },
                { number: 'EK 0215', route: 'Complete', gate: 'Gate 15F', time: 'Done', status: 'success', progress: 100 }
            ]
        }
    };
    
    metricCards.forEach(card => {
        card.addEventListener('click', () => {
            const metric = card.dataset.metric;
            
            metricCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            updateFlightDetails(metric, metricData[metric]);
        });
    });
    
    // View toggles
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            viewToggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
            
            // Simulate view change with animation
            const detailsPanel = document.getElementById('ramp-details');
            detailsPanel.style.opacity = '0';
            setTimeout(() => {
                detailsPanel.style.transition = 'opacity 0.4s ease';
                detailsPanel.style.opacity = '1';
            }, 200);
        });
    });
}

function updateFlightDetails(metric, data) {
    const detailsPanel = document.getElementById('ramp-details');
    const activeContent = detailsPanel.querySelector('.detail-content.active');
    
    if (!activeContent || !data) return;
    
    activeContent.style.opacity = '0';
    activeContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        activeContent.innerHTML = `
            <h4>${data.title}</h4>
            <div class="flight-list">
                ${data.flights.map(flight => `
                    <div class="flight-row ${flight.premium ? 'premium' : ''}">
                        <div class="flight-primary">
                            <span class="flight-number">${flight.number}</span>
                            <span class="flight-route">${flight.route}</span>
                        </div>
                        <div class="flight-meta">
                            <span class="gate">${flight.gate}</span>
                            <span class="timer">${flight.time}</span>
                        </div>
                        <span class="status-badge ${flight.status}">${
                            flight.status === 'success' ? 'On Schedule' :
                            flight.status === 'warning' ? 'Monitoring' :
                            'Scheduled'
                        }</span>
                        <div class="progress-bar">
                            <div class="progress-fill ${flight.status === 'warning' ? 'warning' : ''}" 
                                 style="width: ${flight.progress}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        activeContent.style.transition = 'all 0.5s ease';
        activeContent.style.opacity = '1';
        activeContent.style.transform = 'translateY(0)';
    }, 300);
}

// Wheelchair Dashboard
function initWheelchairDashboard() {
    const viewToggles = document.querySelectorAll('#wheelchair .view-toggle');
    const selects = document.querySelectorAll('.elegant-select');
    
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            viewToggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
            
            const view = toggle.dataset.view;
            switchWheelchairView(view);
        });
    });
    
    selects.forEach(select => {
        select.addEventListener('change', () => {
            filterServices();
        });
    });
}

function switchWheelchairView(view) {
    const serviceList = document.getElementById('wheelchair-list');
    serviceList.style.opacity = '0';
    
    setTimeout(() => {
        // Different data sets based on view
        if (view === 'history') {
            showHistoricalServices();
        } else if (view === 'teams') {
            showTeamPerformance();
        } else {
            showActiveServices();
        }
        
        serviceList.style.transition = 'opacity 0.5s ease';
        serviceList.style.opacity = '1';
    }, 300);
}

function showActiveServices() {
    // Current implementation already shows active services
    const items = document.querySelectorAll('.service-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

function showHistoricalServices() {
    console.log('Showing historical services');
    // Would load historical data
}

function showTeamPerformance() {
    console.log('Showing team performance');
    // Would load team data
}

function filterServices() {
    const items = document.querySelectorAll('.service-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        setTimeout(() => {
            item.style.opacity = '1';
        }, index * 80);
    });
}

// Monitor Dashboard
function initMonitorDashboard() {
    const viewToggles = document.querySelectorAll('#monitor .view-toggle');
    const timers = document.querySelectorAll('.row-timer.live');
    
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            viewToggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
        });
    });
    
    // Update timers
    setInterval(() => {
        timers.forEach(timer => {
            let seconds = parseInt(timer.dataset.seconds);
            seconds++;
            timer.dataset.seconds = seconds;
            
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timer.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            
            updateSLAStatus(timer, seconds);
        });
    }, 1000);
}

function updateSLAStatus(timer, seconds) {
    const row = timer.closest('.table-row');
    const badge = row.querySelector('.status-badge');
    const perfBar = row.querySelector('.performance-fill');
    
    if (seconds > 600) { // 10 minutes
        timer.classList.add('critical');
        row.classList.add('critical-state');
        row.classList.remove('warning-state');
        badge.className = 'status-badge critical';
        badge.textContent = 'Priority';
        perfBar.className = 'performance-fill critical';
        perfBar.style.width = '98%';
    } else if (seconds > 480) { // 8 minutes
        row.classList.add('warning-state');
        row.classList.remove('critical-state');
        badge.className = 'status-badge warning';
        badge.textContent = 'Monitoring';
        perfBar.className = 'performance-fill warning';
        perfBar.style.width = '87%';
    }
}

// Kiosk
function initKiosk() {
    const video = document.querySelector('.kiosk-video');
    const messages = document.querySelectorAll('.message');
    
    if (video) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(err => console.log('Video autoplay prevented'));
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(video);
    }
    
    // Stagger message animations
    messages.forEach((msg, index) => {
        msg.style.opacity = '0';
        setTimeout(() => {
            msg.style.transition = 'opacity 0.6s ease';
            msg.style.opacity = '1';
        }, 1000 + (index * 1200));
    });
}

// Button Effects
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary, .view-toggle, .metric-card, .elegant-select');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add ripple CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth entrance animations
window.addEventListener('load', () => {
    animateOnScroll();
});

function animateOnScroll() {
    const elements = document.querySelectorAll('.showcase-card, .benefit-tile, .service-item, .flight-row');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}
