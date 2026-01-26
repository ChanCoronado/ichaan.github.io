const Storage = {

    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage: ${error}`);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage: ${error}`);
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
    }
};

const IDGenerator = {

    generate(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};

window.Storage = Storage;
window.DateUtils = DateUtils;
window.DOM = DOM;
window.NumberUtils = NumberUtils;
window.AnimationUtils = AnimationUtils;
window.Validators = Validators;
window.IDGenerator = IDGenerator;