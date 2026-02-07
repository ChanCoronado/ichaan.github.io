(function() {
    'use strict';

    function initApp() {
        // Update current date
        updateCurrentDate();

        // Enable smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth';

        // Update overview
        updateOverview();
        
        // Listen for tab changes
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', () => {
                updateOverview();
            });
        });

       
        setupTaskFilters();

        setTimeout(() => {
            showToast('Welcome to Student Life Organizer! 🎓', 'info', 2000);
        }, 500);

        console.log('Student Life Organizer initialized successfully!');
        console.log('Available modules:', {
            Todo: typeof TodoModule !== 'undefined',
            Schedule: typeof ScheduleModule !== 'undefined',
            Budget: typeof BudgetModule !== 'undefined'
        });

       
        const storageSize = Storage.getSize();
        console.log(`Storage used: ${storageSize} KB`);
        if (parseFloat(storageSize) > 4096) {
            showToast('Storage is getting full. Consider exporting and clearing old data.', 'warning', 5000);
        }
    }

    function updateCurrentDate() {
        const currentDateElement = document.getElementById('currentDate');
        if (currentDateElement) {
            currentDateElement.textContent = DateUtils.getCurrentDate();
        }
    }

    function updateOverview() {
       
        const taskStats = TodoModule.getStats();
        const scheduleStats = ScheduleModule.getStats();
        const budgetStats = BudgetModule.getStats();
        
        const statPendingTasks = document.getElementById('statPendingTasks');
        const statHighPriority = document.getElementById('statHighPriority');
        const statTodayClasses = document.getElementById('statTodayClasses');
        const statBalance = document.getElementById('statBalance');

        if (statPendingTasks) {
            const oldValue = parseInt(statPendingTasks.textContent) || 0;
            if (oldValue !== taskStats.pending) {
                AnimationUtils.pulseElement(statPendingTasks);
            }
            statPendingTasks.textContent = taskStats.pending;
        }

        if (statHighPriority) {
            const oldValue = parseInt(statHighPriority.textContent) || 0;
            if (oldValue !== taskStats.high) {
                AnimationUtils.pulseElement(statHighPriority);
            }
            statHighPriority.textContent = taskStats.high;
        }
        
       
        const currentDay = DateUtils.getCurrentDay();
        const todayClasses = ScheduleModule.getClassesForDay(currentDay);
        if (statTodayClasses) {
            const oldValue = parseInt(statTodayClasses.textContent) || 0;
            if (oldValue !== todayClasses.length) {
                AnimationUtils.pulseElement(statTodayClasses);
            }
            statTodayClasses.textContent = todayClasses.length;
        }
        
     
        if (statBalance) {
            statBalance.textContent = NumberUtils.formatCurrency(budgetStats.balance);
            if (budgetStats.balance < 0) {
                statBalance.style.color = 'var(--danger)';
            } else {
                statBalance.style.color = 'var(--success)';
            }
        }
        
       
        updateOverviewTasks();
        updateOverviewSchedule();
    }

    function updateOverviewTasks() {
        const container = document.getElementById('overviewTasks');
        if (!container) return;

        const tasks = TodoModule.getTasks().filter(t => !t.completed).slice(0, Infinity);
        
        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-tasks"></i>
                    </div>
                    <h4 class="empty-state-title">No pending tasks</h4>
                    <p class="empty-state-description">You're all caught up! </p>
                </div>
            `;
            return;
        }
        
       let html = '<div class="list-group">';
        tasks.forEach(task => {
            html += `
                <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <strong>${Validators.sanitize(task.text)}</strong>
                            <br>
                            <small >
                                <i class="fas fa-clock me-1"></i>${DateUtils.formatDate(task.createdAt)}
                            </small>
                        </div>
                        <span class="task-priority ${task.priority}">${task.priority}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    function updateOverviewSchedule() {
        const container = document.getElementById('overviewSchedule');
        if (!container) return;

        const currentDay = DateUtils.getCurrentDay();
        const todayClasses = ScheduleModule.getClassesForDay(currentDay);
        
        if (todayClasses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-calendar"></i>
                    </div>
                    <h4 class="empty-state-title">No classes today</h4>
                    <p class="empty-state-description">Enjoy your free day! </p>
                </div>
            `;
            return;
        }
        
        let html = '<div class="list-group">';
        todayClasses.forEach(classItem => {
            html += `
                <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${Validators.sanitize(classItem.name)}</strong><br>
                            <small>
                                <i class="fas fa-clock me-1"></i>${formatTime(classItem.time)}
                                ${classItem.room ? `<i class="fas fa-map-marker-alt ms-2 me-1"></i>${Validators.sanitize(classItem.room)}` : ''}
                            </small>
                        </div>
                        <div style="width: 20px; height: 20px; background: ${classItem.color}; border-radius: 4px;"></div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    function formatTime(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${displayHour}:${minutes} ${period}`;
    }

    function setupTaskFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                if (TodoModule && TodoModule.setFilter) {
                    TodoModule.setFilter(filter);
                }
            });
        });
    }

    window.switchToTab = function(tabId) {
        const tab = document.getElementById(tabId);
        if (tab) {
            const bsTab = new bootstrap.Tab(tab);
            bsTab.show();
        }
    };

    function exportAllData() {
        const data = {
            tasks: TodoModule.getTasks(),
            classes: ScheduleModule.getClasses(),
            transactions: BudgetModule.getTransactions(),
            exportDate: DateUtils.getTimestamp(),
            version: '2.0.0'
        };

        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `student_organizer_backup_${Date.now()}.json`;
        a.click();
        window.URL.revokeObjectURL(url);

        showToast('All data exported successfully!', 'success');
        console.log('Data exported successfully');
    }

    function importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.tasks) {
                Storage.set('student_organizer_tasks', data.tasks);
            }
            if (data.classes) {
                Storage.set('student_organizer_schedule', data.classes);
            }
            if (data.transactions) {
                Storage.set('student_organizer_budget', data.transactions);
            }

        
            location.reload();
            
            showToast('Data imported successfully!', 'success');
        } catch (error) {
            showToast('Failed to import data. Invalid file format.', 'error');
            console.error('Import error:', error);
        }
    }

    function getDashboardStats() {
        return {
            todo: TodoModule.getStats(),
            schedule: ScheduleModule.getStats(),
            budget: BudgetModule.getStats()
        };
    }

    function printStats() {
        const stats = getDashboardStats();
        console.log('=== Dashboard Statistics ===');
        console.log('Tasks:', stats.todo);
        console.log('Schedule:', stats.schedule);
        console.log('Budget:', stats.budget);
        console.log('Storage Size:', Storage.getSize(), 'KB');
    }

    function clearAllData() {
        if (confirm('⚠️ WARNING: This will delete ALL your data permanently. Are you sure?')) {
            if (confirm('This action cannot be undone. Continue?')) {
                Storage.clear();
                location.reload();
                showToast('All data cleared', 'info');
            }
        }
    }

    function setupConsoleCommands() {
        window.StudentOrganizer = {
            export: exportAllData,
            import: importData,
            stats: getDashboardStats,
            printStats: printStats,
            clearAll: clearAllData,
            updateOverview: updateOverview,
            version: '2.0.0',
            help: function() {
                console.log(`
%cStudent Life Organizer v2.0 - Enhanced Edition%c

Available Commands:
==================
📤 StudentOrganizer.export()          Export all data as JSON backup
📥 StudentOrganizer.import(json)      Import data from JSON string
📊 StudentOrganizer.stats()           Get dashboard statistics
🖨️  StudentOrganizer.printStats()     Print statistics to console
🔄 StudentOrganizer.updateOverview()  Refresh overview dashboard
🗑️  StudentOrganizer.clearAll()       Clear all data (WARNING!)
❓ StudentOrganizer.help()            Show this help message

Module APIs:
============
📝 TodoModule.getTasks()              Get all tasks
📈 TodoModule.getStats()              Get task statistics
📅 ScheduleModule.getClasses()        Get all classes
📊 ScheduleModule.getStats()          Get schedule statistics
💰 BudgetModule.getTransactions()     Get all transactions
💹 BudgetModule.getStats()            Get budget statistics
📄 BudgetModule.exportToCSV()         Export transactions as CSV

Keyboard Shortcuts:
==================
⌨️  Ctrl/Cmd + K    Focus task input
⌨️  Ctrl/Cmd + N    Open add class modal
⌨️  Escape          Clear focused input

Features:
=========
🌙 Dark mode toggle (top right)
🔔 Toast notifications
💾 Auto-save to localStorage
📱 Fully responsive design
♿ Accessible (WCAG compliant)
🎨 Material Design inspired

Version: ${this.version}
                `, 'background: #800000; color: white; font-size: 16px; padding: 10px; border-radius: 5px; font-weight: bold;', '');
            }
        };

        // Welcome message
        console.log('%c🎓 Student Life Organizer v2.0 - Enhanced Edition ', 'background: #800000; color: white; font-size: 16px; padding: 10px; border-radius: 5px; font-weight: bold;');
        console.log('%cType StudentOrganizer.help() for available commands', 'color: #800000; font-size: 14px; font-weight: bold;');
        console.log('%c✨ New Features: Toast notifications, Dark mode, Better UX, Enhanced forms', 'color: #28a745; font-size: 12px;');
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: Focus task input
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                switchToTab('tasks-tab');
                setTimeout(() => {
                    const taskInput = document.getElementById('taskInput');
                    if (taskInput) {
                        taskInput.focus();
                        showToast('Task input focused', 'info', 1000);
                    }
                }, 100);
            }

            // Ctrl/Cmd + N: Open add class modal
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                switchToTab('schedule-tab');
                setTimeout(() => {
                    const addClassModal = document.getElementById('addClassModal');
                    if (addClassModal) {
                        const modal = new bootstrap.Modal(addClassModal);
                        modal.show();
                    }
                }, 100);
            }

            // Escape: Clear focused input
            if (e.key === 'Escape') {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.tagName === 'INPUT') {
                    activeElement.blur();
                }
            }
        });
    }

    
    function setupOfflineDetection() {
        window.addEventListener('online', () => {
            showToast('You are back online! 🌐', 'success', 2000);
        });

        window.addEventListener('offline', () => {
            showToast('You are offline. Data will be saved locally. 📴', 'warning', 3000);
        });
    }

    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initApp();
            setupConsoleCommands();
            setupKeyboardShortcuts();
            setupOfflineDetection();
        });
    } else {
        initApp();
        setupConsoleCommands();
        setupKeyboardShortcuts();
        setupOfflineDetection();
    }

})();