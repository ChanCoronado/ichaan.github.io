const TodoModule = (() => {
    const STORAGE_KEY = 'student_organizer_tasks';
    const SORT_KEY = 'student_organizer_task_sort';
    const PRIORITY_FILTER_KEY = 'student_organizer_priority_filter';
    let tasks = [];
    let currentFilter = 'all';
    let currentSort = 'newest';
    let currentPriorityFilter = 'all';

    const elements = {
        taskForm: null,
        taskInput: null,
        taskPriority: null,
        taskDueDate: null,
        addTaskBtn: null,
        taskList: null,
        taskCounter: null,
        taskCharCount: null,
        taskSort: null,
        taskPriorityFilter: null,
        editTaskModal: null,
        editTaskId: null,
        editTaskText: null,
        editTaskPriority: null,
        editTaskDueDate: null,
        saveEditTaskBtn: null,
        deleteConfirmModal: null,
        deleteConfirmMessage: null,
        confirmDeleteBtn: null
    };

    let pendingDeleteId = null;

    function init() {
        elements.taskForm = document.getElementById('taskForm');
        elements.taskInput = document.getElementById('taskInput');
        elements.taskPriority = document.getElementById('taskPriority');
        elements.taskDueDate = document.getElementById('taskDueDate');
        elements.addTaskBtn = document.getElementById('addTaskBtn');
        elements.taskList = document.getElementById('taskList');
        elements.taskCounter = document.getElementById('taskCounter');
        elements.taskCharCount = document.getElementById('taskCharCount');
        elements.taskSort = document.getElementById('taskSort');
        elements.taskPriorityFilter = document.getElementById('taskPriorityFilter');

        const editModal = document.getElementById('editTaskModal');
        if (editModal) {
            elements.editTaskModal = new bootstrap.Modal(editModal);
            elements.editTaskId = document.getElementById('editTaskId');
            elements.editTaskText = document.getElementById('editTaskText');
            elements.editTaskPriority = document.getElementById('editTaskPriority');
            elements.editTaskDueDate = document.getElementById('editTaskDueDate');
            elements.saveEditTaskBtn = document.getElementById('saveEditTaskBtn');
        }

        const deleteModal = document.getElementById('deleteConfirmModal');
        if (deleteModal) {
            elements.deleteConfirmModal = new bootstrap.Modal(deleteModal);
            elements.deleteConfirmMessage = document.getElementById('deleteConfirmMessage');
            elements.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        }

        loadTasks();
        loadSortPreference();
        loadPriorityFilterPreference();
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

        if (elements.taskSort) {
            elements.taskSort.addEventListener('change', handleSortChange);
        }

        if (elements.taskPriorityFilter) {
            elements.taskPriorityFilter.addEventListener('change', handlePriorityFilterChange);
        }

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

    function loadSortPreference() {
        const stored = Storage.get(SORT_KEY);
        currentSort = stored || 'newest';

        if (elements.taskSort) {
            elements.taskSort.value = currentSort;
        }
    }

    function saveSortPreference() {
        return Storage.set(SORT_KEY, currentSort);
    }

    function loadPriorityFilterPreference() {
        const stored = Storage.get(PRIORITY_FILTER_KEY);
        currentPriorityFilter = stored || 'all';

        if (elements.taskPriorityFilter) {
            elements.taskPriorityFilter.value = currentPriorityFilter;
        }
    }

    function savePriorityFilterPreference() {
        return Storage.set(PRIORITY_FILTER_KEY, currentPriorityFilter);
    }

    function handleSortChange(e) {
        currentSort = e.target.value;
        saveSortPreference();
        renderTasks(true);
    }

    function handlePriorityFilterChange(e) {
        currentPriorityFilter = e.target.value;
        savePriorityFilterPreference();
        renderTasks(true);
    }

    function sortTasks(tasksToSort) {
        return [...tasksToSort].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }

            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            switch (currentSort) {
                case 'newest':
                    if (!a.completed) {
                        return dateB - dateA;
                    } else {
                        return dateA - dateB;
                    }
                case 'oldest':
                    if (!a.completed) {
                        return dateA - dateB;
                    } else {
                        return dateB - dateA;
                    }
                case 'name-asc':
                    return a.text.toLowerCase().localeCompare(b.text.toLowerCase());
                case 'name-desc':
                    return b.text.toLowerCase().localeCompare(a.text.toLowerCase());
                default:
                    if (!a.completed) {
                        return dateB - dateA;
                    } else {
                        return dateA - dateB;
                    }
            }
        });
    }

    function handleAddTask() {
        const taskText = elements.taskInput.value.trim();
        const priority = elements.taskPriority.value;
        const dueDate = elements.taskDueDate.value;

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
                dueDate: dueDate || null,
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

    function handleToggleTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);

        if (taskElement) {
            taskElement.classList.add('task-moving');
        }

        setTimeout(() => {
            task.completed = !task.completed;

            if (saveTasks()) {
                renderTasks(true);
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
        elements.editTaskDueDate.value = task.dueDate || '';

        elements.editTaskModal.show();

        setTimeout(() => {
            elements.editTaskText.focus();
        }, 300);
    }

    function handleSaveEditTask() {
        const taskId = elements.editTaskId.value;
        const newText = elements.editTaskText.value.trim();
        const newPriority = elements.editTaskPriority.value;
        const newDueDate = elements.editTaskDueDate.value;

        if (Validators.isEmpty(newText)) {
            elements.editTaskText.focus();
            AnimationUtils.shakeElement(elements.editTaskText);
            showToast('Please enter a task description', 'warning');
            return;
        }

        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.text = newText;
            task.priority = newPriority;
            task.dueDate = newDueDate || null;

            if (saveTasks()) {
                renderTasks();
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

    function renderTasks(animate = false) {
        if (!elements.taskList) return;

        DOM.clearElement(elements.taskList);

        if (tasks.length === 0) {
            showEmptyState('No tasks yet', 'Add your first task above to get started!', 'fa-clipboard-list');
            return;
        }

        let filteredTasks = [...tasks];

        if (currentFilter === 'active') {
            filteredTasks = filteredTasks.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = filteredTasks.filter(t => t.completed);
        }

        if (currentPriorityFilter !== 'all') {
            filteredTasks = filteredTasks.filter(t => t.priority === currentPriorityFilter);
        }

        let sortedTasks = sortTasks(filteredTasks);

        if (sortedTasks.length === 0) {
            const emptyMessages = {
                active: ['No active tasks', 'All tasks are completed! 🎉'],
                completed: ['No completed tasks', 'Complete some tasks to see them here'],
                all: ['No tasks match the filters', 'Try adjusting your filters']
            };

            const [title, desc] = emptyMessages[currentFilter] || emptyMessages.all;
            showEmptyState(title, desc, 'fa-check-circle');
            return;
        }

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

    function getDueDateStatus(dueDate) {
        if (!dueDate) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);

        if (due < today) return 'overdue';
        if (due.getTime() === today.getTime()) return 'today';
        return 'upcoming';
    }

    function formatDueDate(dateString) {
        if (!dateString) return '';

        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = new Date(date);
        due.setHours(0, 0, 0, 0);

        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        if (diffDays === -1) return 'Due yesterday';
        if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
        if (diffDays <= 7) return `Due in ${diffDays} days`;

        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return `Due ${date.toLocaleDateString('en-US', options)}`;
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
        timeSpan.innerHTML = `<i class="fas fa-clock"></i> ${DateUtils.formatDate(task.createdAt)}`;

        metaDiv.appendChild(priorityBadge);
        metaDiv.appendChild(timeSpan);

        if (task.dueDate) {
            const dueDateStatus = getDueDateStatus(task.dueDate);
            const dueDateSpan = DOM.createElement('span', ['task-due-date']);

            if (dueDateStatus) {
                dueDateSpan.classList.add(dueDateStatus);
            }

            dueDateSpan.innerHTML = `
                <i class="fas fa-calendar-alt"></i>
                <span>${formatDueDate(task.dueDate)}</span>
                <span class="due-date-tooltip">${new Date(task.dueDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })}</span>
            `;

            metaDiv.appendChild(dueDateSpan);
        }

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