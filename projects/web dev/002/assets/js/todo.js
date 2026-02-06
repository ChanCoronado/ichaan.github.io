const TodoModule = (() => {
    const STORAGE_KEY = 'student_organizer_tasks';
    const HIDE_COMPLETED_KEY = 'student_organizer_hide_completed';
    let tasks = [];
    let currentFilter = 'all';
    let hideCompleted = false;

    const elements = {
        taskForm: null,
        taskInput: null,
        taskPriority: null,
        addTaskBtn: null,
        taskList: null,
        taskCounter: null,
        taskCharCount: null,
        hideCompletedToggle: null,
        editTaskModal: null,
        editTaskId: null,
        editTaskText: null,
        editTaskPriority: null,
        saveEditTaskBtn: null,
        deleteConfirmModal: null,
        deleteConfirmMessage: null,
        confirmDeleteBtn: null
    };

    let pendingDeleteId = null;

    // Priority weights for sorting
    const PRIORITY_WEIGHTS = {
        high: 3,
        medium: 2,
        low: 1
    };

    function init() {
        // Cache DOM elements
        elements.taskForm = document.getElementById('taskForm');
        elements.taskInput = document.getElementById('taskInput');
        elements.taskPriority = document.getElementById('taskPriority');
        elements.addTaskBtn = document.getElementById('addTaskBtn');
        elements.taskList = document.getElementById('taskList');
        elements.taskCounter = document.getElementById('taskCounter');
        elements.taskCharCount = document.getElementById('taskCharCount');
        elements.hideCompletedToggle = document.getElementById('hideCompletedToggle');
        
        const editModal = document.getElementById('editTaskModal');
        if (editModal) {
            elements.editTaskModal = new bootstrap.Modal(editModal);
            elements.editTaskId = document.getElementById('editTaskId');
            elements.editTaskText = document.getElementById('editTaskText');
            elements.editTaskPriority = document.getElementById('editTaskPriority');
            elements.saveEditTaskBtn = document.getElementById('saveEditTaskBtn');
        }
        
        const deleteModal = document.getElementById('deleteConfirmModal');
        if (deleteModal) {
            elements.deleteConfirmModal = new bootstrap.Modal(deleteModal);
            elements.deleteConfirmMessage = document.getElementById('deleteConfirmMessage');
            elements.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        }

        loadTasks();
        loadHideCompletedState();
        attachEventListeners();
        renderTasks();
        updateCounter();
    }

    function attachEventListeners() {
        if (elements.taskForm) {
            elements.taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleAddTask();
            });
        }

        if (elements.taskInput && elements.taskCharCount) {
            elements.taskInput.addEventListener('input', () => {
                const length = elements.taskInput.value.length;
                elements.taskCharCount.textContent = length;
                
                if (length > 180) {
                    elements.taskCharCount.style.color = 'var(--danger)';
                } else if (length > 150) {
                    elements.taskCharCount.style.color = 'var(--warning)';
                } else {
                    elements.taskCharCount.style.color = 'var(--text-muted)';
                }
            });
        }
        
        if (elements.saveEditTaskBtn) {
            elements.saveEditTaskBtn.addEventListener('click', handleSaveEditTask);
        }
        
        if (elements.confirmDeleteBtn) {
            elements.confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
        }

        // NEW: Hide completed toggle listener
        if (elements.hideCompletedToggle) {
            elements.hideCompletedToggle.addEventListener('change', handleToggleHideCompleted);
        }

        // Filter button listeners
        setupFilterButtons();
    }

    function setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                setFilter(filter);
            });
        });
    }

    function loadTasks() {
        const storedTasks = Storage.get(STORAGE_KEY);
        tasks = storedTasks || [];
    }

    function saveTasks() {
        return Storage.set(STORAGE_KEY, tasks);
    }

    // NEW: Load hide completed state from localStorage
    function loadHideCompletedState() {
        const stored = Storage.get(HIDE_COMPLETED_KEY);
        hideCompleted = stored !== null ? stored : false;
        
        if (elements.hideCompletedToggle) {
            elements.hideCompletedToggle.checked = hideCompleted;
        }
    }

    // NEW: Save hide completed state to localStorage
    function saveHideCompletedState() {
        return Storage.set(HIDE_COMPLETED_KEY, hideCompleted);
    }

    // NEW: Handle hide completed toggle
    function handleToggleHideCompleted(e) {
        hideCompleted = e.target.checked;
        saveHideCompletedState();
        renderTasks(true); // Animate the change
        
        const message = hideCompleted 
            ? 'Completed tasks hidden' 
            : 'Showing all tasks';
        showToast(message, 'info', 2000);
    }

    // NEW: Smart task sorting function
    function sortTasks(tasksToSort) {
        return [...tasksToSort].sort((a, b) => {
            // 1. Primary: Sort by completion status (incomplete first)
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            
            // 2. Secondary: Sort by priority (high → medium → low)
            if (!a.completed && !b.completed) {
                const priorityDiff = PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
                if (priorityDiff !== 0) {
                    return priorityDiff;
                }
            }
            
            // 3. Tertiary: Sort by date
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            
            // For active tasks: newest first
            // For completed tasks: oldest first (completed earlier stays at bottom)
            if (!a.completed) {
                return dateB - dateA; // Newest first
            } else {
                return dateA - dateB; // Oldest first
            }
        });
    }

    function handleAddTask() {
        const taskText = elements.taskInput.value.trim();
        const priority = elements.taskPriority.value;

        if (Validators.isEmpty(taskText)) {
            elements.taskInput.focus();
            AnimationUtils.shakeElement(elements.taskInput);
            showToast('Please enter a task description', 'warning');
            return;
        }

        if (taskText.length > 200) {
            showToast('Task description is too long (max 200 characters)', 'error');
            return;
        }

        LoadingState.show(elements.addTaskBtn);

        setTimeout(() => {
            const newTask = {
                id: IDGenerator.generate('task'),
                text: taskText,
                priority: priority,
                completed: false,
                createdAt: DateUtils.getTimestamp()
            };

            tasks.unshift(newTask);

            if (saveTasks()) {
                renderTasks();
                updateCounter();
                updateOverview();

                elements.taskForm.reset();
                elements.taskCharCount.textContent = '0';
                elements.taskCharCount.style.color = 'var(--text-muted)';
                elements.taskInput.focus();

                showToast('Task added successfully!', 'success');

                if (elements.taskCounter) {
                    AnimationUtils.pulseElement(elements.taskCounter);
                }
            }

            LoadingState.hide(elements.addTaskBtn);
        }, 300);
    }

    // ENHANCED: Toggle task with smooth reordering
    function handleToggleTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        
        // Add moving animation
        if (taskElement) {
            taskElement.classList.add('task-moving');
        }

        setTimeout(() => {
            task.completed = !task.completed;
            
            if (saveTasks()) {
                renderTasks(true); // Animate the reorder
                updateCounter();
                updateOverview();
                
                const message = task.completed ? 'Task completed! 🎉' : 'Task reopened';
                showToast(message, task.completed ? 'success' : 'info', 2000);
            }
        }, 150);
    }

    function handleDeleteTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        pendingDeleteId = taskId;
        elements.deleteConfirmMessage.textContent = `Are you sure you want to delete "${task.text}"?`;
        elements.deleteConfirmModal.show();
    }
    
    function handleConfirmDelete() {
        if (!pendingDeleteId) return;
        
        const taskElement = document.querySelector(`[data-task-id="${pendingDeleteId}"]`);
        
        if (taskElement) {
            taskElement.classList.add('task-hiding');
            
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== pendingDeleteId);
                if (saveTasks()) {
                    renderTasks();
                    updateCounter();
                    updateOverview();
                    showToast('Task deleted', 'info');
                }
                pendingDeleteId = null;
            }, 300);
        }
        
        elements.deleteConfirmModal.hide();
    }

    function handleEditTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        elements.editTaskId.value = task.id;
        elements.editTaskText.value = task.text;
        elements.editTaskPriority.value = task.priority;
        
        elements.editTaskModal.show();
        
        setTimeout(() => {
            elements.editTaskText.focus();
        }, 300);
    }
    
    function handleSaveEditTask() {
        const taskId = elements.editTaskId.value;
        const newText = elements.editTaskText.value.trim();
        const newPriority = elements.editTaskPriority.value;
        
        if (Validators.isEmpty(newText)) {
            elements.editTaskText.focus();
            AnimationUtils.shakeElement(elements.editTaskText);
            showToast('Please enter a task description', 'warning');
            return;
        }
        
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            const priorityChanged = task.priority !== newPriority;
            
            task.text = newText;
            task.priority = newPriority;
            
            if (saveTasks()) {
                // If priority changed and task is active, re-sort
                if (priorityChanged && !task.completed) {
                    renderTasks(true);
                } else {
                    renderTasks();
                }
                
                updateCounter();
                updateOverview();
                showToast('Task updated successfully!', 'success');
            }
        }
        
        elements.editTaskModal.hide();
    }

    function updateCounter() {
        if (!elements.taskCounter) return;
        const pendingTasks = tasks.filter(t => !t.completed).length;
        elements.taskCounter.textContent = pendingTasks;
        
        if (pendingTasks === 0) {
            elements.taskCounter.style.display = 'none';
        } else {
            elements.taskCounter.style.display = 'inline-block';
        }
    }

    function updateOverview() {
        if (window.StudentOrganizer && window.StudentOrganizer.updateOverview) {
            setTimeout(() => {
                window.StudentOrganizer.updateOverview();
            }, 100);
        }
    }

    // ENHANCED: Render tasks with sorting and hide completed logic
    function renderTasks(animate = false) {
        if (!elements.taskList) return;
        
        DOM.clearElement(elements.taskList);

        if (tasks.length === 0) {
            showEmptyState('No tasks yet', 'Add your first task above to get started!', 'fa-clipboard-list');
            return;
        }

        // Apply sorting
        let sortedTasks = sortTasks(tasks);

        // Apply filter
        if (currentFilter === 'active') {
            sortedTasks = sortedTasks.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            sortedTasks = sortedTasks.filter(t => t.completed);
        }

        // Apply hide completed logic (only when filter is 'all')
        if (currentFilter === 'all' && hideCompleted) {
            sortedTasks = sortedTasks.filter(t => !t.completed);
        }

        if (sortedTasks.length === 0) {
            const emptyMessages = {
                active: ['No active tasks', 'All tasks are completed! 🎉'],
                completed: ['No completed tasks', 'Complete some tasks to see them here'],
                all: hideCompleted 
                    ? ['No active tasks', 'All tasks completed or hidden']
                    : ['No tasks yet', 'Add your first task above to get started!']
            };
            
            const [title, desc] = emptyMessages[currentFilter] || emptyMessages.all;
            showEmptyState(title, desc, 'fa-check-circle');
            return;
        }

        // Render tasks
        sortedTasks.forEach((task, index) => {
            const taskElement = createTaskElement(task);
            
            if (animate) {
                taskElement.classList.add('task-showing');
            } else {
                taskElement.style.animationDelay = `${index * 0.05}s`;
                taskElement.classList.add('fade-in');
            }
            
            elements.taskList.appendChild(taskElement);
        });
    }

    function showEmptyState(title, description, icon) {
        const emptyState = DOM.createElement('div', ['empty-state']);
        emptyState.innerHTML = `
            <div class="empty-state-icon">
                <i class="fas ${icon}"></i>
            </div>
            <h4 class="empty-state-title">${title}</h4>
            <p class="empty-state-description">${description}</p>
        `;
        elements.taskList.appendChild(emptyState);
    }

    function setFilter(filter) {
        currentFilter = filter;
        renderTasks();
    }

    function createTaskElement(task) {
        const taskItem = DOM.createElement('div', ['task-item'], {
            'data-task-id': task.id
        });

        if (task.completed) {
            taskItem.classList.add('completed');
        }

        const checkbox = DOM.createElement('input', ['task-checkbox'], {
            type: 'checkbox',
            'aria-label': 'Mark task as complete'
        });
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => handleToggleTask(task.id));

        const contentDiv = DOM.createElement('div', ['task-content']);
        const taskText = DOM.createElement('div', ['task-text']);
        taskText.textContent = task.text;

        const metaDiv = DOM.createElement('div', ['task-meta']);
        const priorityBadge = DOM.createElement('span', ['task-priority', task.priority]);
        priorityBadge.textContent = task.priority;

        const timeSpan = DOM.createElement('span', ['task-time']);
        timeSpan.innerHTML = `<i class="fas fa-clock me-1"></i>${DateUtils.formatDate(task.createdAt)}`;

        metaDiv.appendChild(priorityBadge);
        metaDiv.appendChild(timeSpan);
        contentDiv.appendChild(taskText);
        contentDiv.appendChild(metaDiv);

        const actionsDiv = DOM.createElement('div', ['task-actions']);

        const editBtn = DOM.createElement('button', ['task-btn', 'edit'], {
            'aria-label': 'Edit task',
            'title': 'Edit task'
        });
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => handleEditTask(task.id));

        const deleteBtn = DOM.createElement('button', ['task-btn', 'delete'], {
            'aria-label': 'Delete task',
            'title': 'Delete task'
        });
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => handleDeleteTask(task.id));

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        taskItem.appendChild(checkbox);
        taskItem.appendChild(contentDiv);
        taskItem.appendChild(actionsDiv);

        return taskItem;
    }

    function getTasks() {
        return tasks;
    }

    function getStats() {
        return {
            total: tasks.length,
            completed: tasks.filter(t => t.completed).length,
            pending: tasks.filter(t => !t.completed).length,
            high: tasks.filter(t => t.priority === 'high' && !t.completed).length,
            medium: tasks.filter(t => t.priority === 'medium' && !t.completed).length,
            low: tasks.filter(t => t.priority === 'low' && !t.completed).length
        };
    }

    return {
        init,
        getTasks,
        getStats,
        setFilter,
        renderTasks
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', TodoModule.init);
} else {
    TodoModule.init();
}

window.TodoModule = TodoModule;