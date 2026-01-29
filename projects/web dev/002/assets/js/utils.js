const Storage = {
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage: ${error}`);
            showToast('Failed to load data', 'error');
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage: ${error}`);
            if (error.name === 'QuotaExceededError') {
                showToast('Storage limit exceeded. Please delete some data.', 'error');
            } else {
                showToast('Failed to save data', 'error');
            }
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage: ${error}`);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error(`Error clearing localStorage: ${error}`);
            return false;
        }
    },

    getSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return (total / 1024).toFixed(2);
    }
};

const DateUtils = {
    getCurrentDate() {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date().toLocaleDateString('en-US', options);
    },

    getCurrentTime() {
        const options = { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        };
        return new Date().toLocaleTimeString('en-US', options);
    },

    getCurrentDay() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[new Date().getDay()];
    },

    formatDate(date) {
        const d = new Date(date);
        const options = { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        };
        return d.toLocaleDateString('en-US', options);
    },

    formatTime(date) {
        const d = new Date(date);
        const options = { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        };
        return d.toLocaleTimeString('en-US', options);
    },

    getTimestamp() {
        return new Date().toISOString();
    },

    isToday(date) {
        const today = new Date();
        const compareDate = new Date(date);
        return today.toDateString() === compareDate.toDateString();
    },

    getDaysDifference(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((date1 - date2) / oneDay));
    }
};

const DOM = {
    createElement(tag, classes = [], attributes = {}) {
        const element = document.createElement(tag);
        
        if (classes.length > 0) {
            element.classList.add(...classes);
        }
        
        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });
        
        return element;
    },

    clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },

    showElement(element, animationClass = 'slide-in') {
        element.classList.add(animationClass);
        element.style.display = 'block';
    },

    hideElement(element, callback) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            element.style.display = 'none';
            if (callback) callback();
        }, 300);
    }
};

const NumberUtils = {
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    },

    parseCurrency(str) {
        return parseFloat(str.replace(/[^0-9.-]+/g, '')) || 0;
    },

    formatPercentage(value, total) {
        if (total === 0) return '0%';
        const percentage = (value / total) * 100;
        return `${Math.min(Math.round(percentage), 100)}%`;
    },

    formatNumber(num) {
        return new Intl.NumberFormat('en-US').format(num);
    }
};

const AnimationUtils = {
    animateCounter(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = NumberUtils.formatCurrency(current);
        }, 16);
    },

    animateProgressBar(element, percentage) {
        element.style.width = '0%';
        setTimeout(() => {
            element.style.width = `${Math.min(percentage, 100)}%`;
        }, 100);
    },

    pulseElement(element) {
        element.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    },

    shakeElement(element) {
        element.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
};

const Validators = {
    isEmpty(str) {
        return !str || str.trim().length === 0;
    },

    isValidNumber(value) {
        return !isNaN(value) && isFinite(value) && value >= 0;
    },

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    sanitize(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};


const IDGenerator = {
    generate(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};

const Toast = {
    container: null,

    init() {
        this.container = document.getElementById('toastContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toastContainer';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 3000) {
        if (!this.container) this.init();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${iconMap[type] || 'fa-info-circle'}"></i>
            <span class="toast-message">${Validators.sanitize(message)}</span>
            <button class="toast-close" aria-label="Close">&times;</button>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.remove(toast));

        this.container.appendChild(toast);

        setTimeout(() => {
            this.remove(toast);
        }, duration);

        return toast;
    },

    remove(toast) {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
};

const ThemeManager = {
    THEME_KEY: 'app_theme',
    
    init() {
        const savedTheme = Storage.get(this.THEME_KEY) || 'light';
        this.setTheme(savedTheme);
        this.setupToggle();
    },

    setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        Storage.set(this.THEME_KEY, theme);
        this.updateToggleIcon(theme);
    },

    toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },

    updateToggleIcon(theme) {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    },

    setupToggle() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }
};

const FormValidator = {
    validate(formElement) {
        const inputs = formElement.querySelectorAll('[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    },

    validateInput(input) {
        const value = input.value.trim();
        let isValid = true;

        if (input.hasAttribute('required') && Validators.isEmpty(value)) {
            isValid = false;
        }

        if (input.type === 'number' && !Validators.isValidNumber(parseFloat(value))) {
            isValid = false;
        }

        if (input.type === 'email' && !Validators.isValidEmail(value)) {
            isValid = false;
        }

        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }

        return isValid;
    },

    clearValidation(formElement) {
        const inputs = formElement.querySelectorAll('.is-valid, .is-invalid');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
    }
};

const LoadingState = {
    show(button) {
        button.disabled = true;
        button.classList.add('btn-loading');
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    },

    hide(button) {
        button.disabled = false;
        button.classList.remove('btn-loading');
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }
    }
};

function showToast(message, type = 'info', duration = 3000) {
    return Toast.show(message, type, duration);
}

window.Storage = Storage;
window.DateUtils = DateUtils;
window.DOM = DOM;
window.NumberUtils = NumberUtils;
window.AnimationUtils = AnimationUtils;
window.Validators = Validators;
window.IDGenerator = IDGenerator;
window.Toast = Toast;
window.ThemeManager = ThemeManager;
window.FormValidator = FormValidator;
window.LoadingState = LoadingState;
window.showToast = showToast;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Toast.init();
        ThemeManager.init();
    });
} else {
    Toast.init();
    ThemeManager.init();
}