// EmotionAI - Main JavaScript for 2026 UI

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.createToggleButton();
        this.bindEvents();
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update toggle button icon
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
        }
    }

    toggleTheme() {
        this.setTheme(this.theme === 'light' ? 'dark' : 'light');
    }

    createToggleButton() {
        // Add theme toggle to navigation
        const navButtons = document.querySelector('.nav-buttons');
        if (navButtons && !document.querySelector('.theme-toggle')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'theme-toggle';
            toggleBtn.innerHTML = this.theme === 'light' ? '🌙' : '☀️';
            toggleBtn.title = 'Toggle theme';
            navButtons.appendChild(toggleBtn);
        }
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-toggle')) {
                this.toggleTheme();
            }
        });
    }
}

// Live Demo Functionality
class LiveDemo {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const demoInput = document.getElementById('live-demo-input');
        const demoBtn = document.getElementById('live-demo-btn');

        if (demoBtn) {
            demoBtn.addEventListener('click', () => this.analyzeDemo());
        }

        if (demoInput) {
            demoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.analyzeDemo();
                }
            });
        }
    }

    async analyzeDemo() {
        const input = document.getElementById('live-demo-input');
        const result = document.getElementById('live-demo-result');

        if (!input || !result) return;

        const text = input.value.trim();
        if (!text) {
            alert('Please enter some text to analyze');
            return;
        }

        // Show loading state
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="result-header">
                <h3>Analysis Result</h3>
            </div>
            <div class="result-content">
                <div style="text-align: center; padding: 2rem;">
                    <div class="loading-spinner"></div>
                    <p>Analyzing emotions...</p>
                </div>
            </div>
        `;

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.displayResult(data);
            } else {
                throw new Error(data.error || 'Analysis failed');
            }
        } catch (error) {
            result.innerHTML = `
                <div class="result-header">
                    <h3>Analysis Result</h3>
                </div>
                <div class="result-content">
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <h3>Analysis Failed</h3>
                        <p>${error.message}</p>
                        <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
                    </div>
                </div>
            `;
        }
    }

    displayResult(data) {
        const result = document.getElementById('live-demo-result');
        const emotions = data.all_emotions;
        const topEmotion = Object.keys(emotions).reduce((a, b) =>
            emotions[a] > emotions[b] ? a : b
        );

        // Create emotion distribution HTML
        const distributionHtml = Object.entries(emotions)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([emotion, prob]) => `
                <div class="emotion-item">
                    <span class="emotion-name">${emotion}</span>
                    <span class="emotion-prob">${(prob * 100).toFixed(1)}%</span>
                </div>
            `).join('');

        result.innerHTML = `
            <div class="result-header">
                <h3>Analysis Result</h3>
            </div>
            <div class="result-content">
                <div class="emotion-badge">${topEmotion}</div>
                <div class="confidence-meter">
                    <div class="meter-label">Confidence</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(data.confidence * 100).toFixed(1)}%">${(data.confidence * 100).toFixed(1)}%</div>
                    </div>
                </div>
                <div class="emotion-distribution">
                    ${distributionHtml}
                </div>
            </div>
        `;
    }
}

// API Documentation Interactive Demo
class APIDemo {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('try-api')) {
                const endpoint = e.target.dataset.endpoint;
                this.tryEndpoint(endpoint);
            }
        });
    }

    async tryEndpoint(endpoint) {
        const btn = document.querySelector(`[data-endpoint="${endpoint}"]`);
        if (!btn) return;

        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        btn.disabled = true;

        try {
            let response;
            if (endpoint === 'predict') {
                response = await fetch('/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: "I'm so excited about this new opportunity!" })
                });
            } else if (endpoint === 'emotions') {
                response = await fetch('/emotions');
            } else if (endpoint === 'health') {
                response = await fetch('/health');
            }

            const data = await response.json();

            // Show success message
            btn.innerHTML = '<i class="fas fa-check"></i> Success!';
            btn.style.background = '#10b981';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 2000);

        } catch (error) {
            btn.innerHTML = '<i class="fas fa-times"></i> Failed';
            btn.style.background = '#dc2626';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 2000);
        }
    }
}

// Smooth Scrolling
class SmoothScroll {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Loading Spinner CSS
const loadingSpinnerCSS = `
.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--bg-tertiary);
    border-top: 4px solid var(--accent-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Add loading spinner styles
const style = document.createElement('style');
style.textContent = loadingSpinnerCSS;
document.head.appendChild(style);

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new LiveDemo();
    new APIDemo();
    new SmoothScroll().init();

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('uil-bars');
                icon.classList.toggle('uil-multiply');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('uil-bars');
                    icon.classList.remove('uil-multiply');
                }
            }
        });
    }

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .endpoint-card, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Utility functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success feedback
        const notification = document.createElement('div');
        notification.textContent = 'Copied to clipboard!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-primary);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    });
}

function shareResult() {
    if (navigator.share) {
        navigator.share({
            title: 'EmotionAI Analysis',
            text: 'Check out this emotion analysis result!',
            url: window.location.href
        });
    } else {
        copyToClipboard(window.location.href);
    }
}

// Add slideIn animation
const slideInCSS = `
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

const slideStyle = document.createElement('style');
slideStyle.textContent = slideInCSS;
document.head.appendChild(slideStyle);
