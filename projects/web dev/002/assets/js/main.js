(function() {
    'use strict';

   
    function initApp() {
      
        updateCurrentDate();

    
        document.documentElement.style.scrollBehavior = 'smooth';

       
        updateOverview();
        
     
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', () => {
                updateOverview();
            });
        });

     
        setupTaskFilters();

       
        console.log('Student Life Organizer initialized successfully!');
        console.log('Available modules:', {
            Todo: typeof TodoModule !== 'undefined',
            Schedule: typeof ScheduleModule !== 'undefined',
            Budget: typeof BudgetModule !== 'undefined'
        });
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
        
   
        document.getElementById('statPendingTasks').textContent = taskStats.pending;
        document.getElementById('statHighPriority').textContent = taskStats.high;
        
       
        const currentDay = DateUtils.getCurrentDay();
        const todayClasses = ScheduleModule.getClassesForDay(currentDay);
        document.getElementById('statTodayClasses').textContent = todayClasses.length;
        
      
        const balanceElement = document.getElementById('statBalance');
        balanceElement.textContent = NumberUtils.formatCurrency(budgetStats.balance);
        if (budgetStats.balance < 0) {
            balanceElement.style.color = 'var(--danger)';
        } else {
            balanceElement.style.color = 'var(--success)';
        }
        
       
        updateOverviewTasks();
        updateOverviewSchedule();
    }

    function updateOverviewTasks() {
        const container = document.getElementById('overviewTasks');
        const tasks = TodoModule.getTasks().filter(t => !t.completed).slice(0, 5);
        
        if (tasks.length === 0) {
            container.innerHTML = '<p class="text-muted text-center py-4">No pending tasks</p>';
            return;
        }
        
        let html = '<div class="list-group">';
        tasks.forEach(task => {
            const priorityClass = task.priority === 'high' ? 'danger' : 
                                 task.priority === 'medium' ? 'warning' : 'success';
            html += `
                <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <strong>${task.text}</strong>
                        </div>
                        <span class="badge bg-${priorityClass}">${task.priority}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    function updateOverviewSchedule() {
        const container = document.getElementById('overviewSchedule');
        const currentDay = DateUtils.getCurrentDay();
        const todayClasses = ScheduleModule.getClassesForDay(currentDay);
        
        if (todayClasses.length === 0) {
            container.innerHTML = '<p class="text-muted text-center py-4">No classes today</p>';
            return;
        }
        
        let html = '<div class="list-group">';
        todayClasses.forEach(classItem => {
            html += `
                <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${classItem.name}</strong><br>
                            <small class="text-muted">
                                <i class="fas fa-clock me-1"></i>${formatTime(classItem.time)}
                                ${classItem.room ? `<i class="fas fa-map-marker-alt ms-2 me-1"></i>${classItem.room}` : ''}
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
            exportDate: DateUtils.getTimestamp()
        };

        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `student_organizer_backup_${Date.now()}.json`;
        a.click();
        window.URL.revokeObjectURL(url);

        console.log('Data exported successfully');
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
    }

    function setupConsoleCommands() {
        window.StudentOrganizer = {
            export: exportAllData,
            stats: getDashboardStats,
            printStats: printStats,
            updateOverview: updateOverview,
            version: '2.0.0',
            help: function() {
                console.log(`
Student Life Organizer - Console Commands
==========================================

Available commands:
- StudentOrganizer.export()         Export all data as JSON
- StudentOrganizer.stats()           Get dashboard statistics
- StudentOrganizer.printStats()      Print statistics to console
- StudentOrganizer.updateOverview()  Refresh overview dashboard
- StudentOrganizer.help()            Show this help message

Module APIs:
- TodoModule.getTasks()              Get all tasks
- TodoModule.getStats()              Get task statistics
- ScheduleModule.getClasses()        Get all classes
- ScheduleModule.getStats()          Get schedule statistics
- BudgetModule.getTransactions()     Get all transactions
- BudgetModule.getStats()            Get budget statistics
- BudgetModule.exportToCSV()         Export transactions as CSV

Keyboard Shortcuts:
- Ctrl/Cmd + K    Focus task input
- Ctrl/Cmd + N    Open add class modal
- Escape          Clear focused input

Version: ${this.version}
                `);
            }
        };

   
        console.log('%c Student Life Organizer v2.0 ', 'background: #800000; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
        console.log('Type StudentOrganizer.help() for available commands');
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
           
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                switchToTab('tasks-tab');
                setTimeout(() => {
                    const taskInput = document.getElementById('taskInput');
                    if (taskInput) taskInput.focus();
                }, 100);
            }

        
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

            if (e.key === 'Escape') {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.tagName === 'INPUT') {
                    activeElement.blur();
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initApp();
            setupConsoleCommands();
            setupKeyboardShortcuts();
        });
    } else {
        initApp();
        setupConsoleCommands();
        setupKeyboardShortcuts();
    }

})();