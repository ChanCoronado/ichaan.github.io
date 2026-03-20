(function() {
    'use strict';
    
  
    function initMobileNavigation() {
        if (window.innerWidth > 1023) {
            return; 
        }
        
      
        if (!document.querySelector('.mobile-bottom-nav')) {
            createMobileBottomNav();
        }
        
        setupMobileNavListeners();
    }
    
    function createMobileBottomNav() {
        const nav = document.createElement('div');
        nav.className = 'mobile-bottom-nav';
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Mobile navigation');
        
        const taskCount = document.getElementById('taskCounter')?.textContent || '0';
        
        nav.innerHTML = `
            <button class="mobile-nav-item active" data-target="overview" aria-label="Overview">
                <i class="fas fa-home"></i>
                <span>Overview</span>
            </button>
            <button class="mobile-nav-item" data-target="tasks" aria-label="Tasks">
                <i class="fas fa-tasks"></i>
                <span>Tasks</span>
                ${taskCount !== '0' ? `<span class="mobile-nav-badge">${taskCount}</span>` : ''}
            </button>
            <button class="mobile-nav-item" data-target="schedule" aria-label="Schedule">
                <i class="fas fa-calendar-alt"></i>
                <span>Schedule</span>
            </button>
            <button class="mobile-nav-item" data-target="budget" aria-label="Budget">
                <i class="fas fa-wallet"></i>
                <span>Budget</span>
            </button>
        `;
        
        document.body.appendChild(nav);
    }
    

    function setupMobileNavListeners() {
        const navItems = document.querySelectorAll('.mobile-nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                
               
                navItems.forEach(nav => nav.classList.remove('active'));
                
                
                this.classList.add('active');
                
             
                showTab(target);
            });
        });
    }
    
  
    function showTab(tabName) {
       
        const tabPanes = document.querySelectorAll('.tab-pane');
        tabPanes.forEach(pane => {
            pane.classList.remove('show', 'active');
        });
        
   
        const targetPane = document.getElementById(tabName);
        if (targetPane) {
            targetPane.classList.add('show', 'active');
        }
        
       
        const desktopTab = document.getElementById(tabName + '-tab');
        if (desktopTab) {
            const tabs = document.querySelectorAll('.custom-tabs .nav-link');
            tabs.forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });
            desktopTab.classList.add('active');
            desktopTab.setAttribute('aria-selected', 'true');
        }
    }
    
    function updateMobileNavBadge() {
        const taskCounter = document.getElementById('taskCounter');
        const mobileNavBadge = document.querySelector('.mobile-nav-item[data-target="tasks"] .mobile-nav-badge');
        
        if (taskCounter && window.innerWidth <= 1023) {
            const count = taskCounter.textContent;
            
            if (count === '0') {
                if (mobileNavBadge) {
                    mobileNavBadge.remove();
                }
            } else {
                if (mobileNavBadge) {
                    mobileNavBadge.textContent = count;
                } else {
                    const tasksNavItem = document.querySelector('.mobile-nav-item[data-target="tasks"]');
                    if (tasksNavItem) {
                        const badge = document.createElement('span');
                        badge.className = 'mobile-nav-badge';
                        badge.textContent = count;
                        tasksNavItem.appendChild(badge);
                    }
                }
            }
        }
    }
    
    function handleResize() {
        const mobileNav = document.querySelector('.mobile-bottom-nav');
        
        if (window.innerWidth > 1023) {
            
            if (mobileNav) {
                mobileNav.remove();
            }
        } else {
            if (!mobileNav) {
                createMobileBottomNav();
                setupMobileNavListeners();
            }
        }
    }
    
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
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNavigation);
    } else {
        initMobileNavigation();
    }
    
    window.addEventListener('resize', debounce(handleResize, 250));
    
    const taskCounter = document.getElementById('taskCounter');
    if (taskCounter) {
        const observer = new MutationObserver(updateMobileNavBadge);
        observer.observe(taskCounter, { childList: true, characterData: true, subtree: true });
    }
    
    window.updateMobileNavBadge = updateMobileNavBadge;
    
})();