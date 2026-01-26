const TodoModule = (() => {
   
    const STORAGE_KEY = 'student_organizer_tasks';
    let tasks = [];
    let currentFilter = 'all';

  
    const elements = {
        taskInput: null,
        taskPriority: null,
        addTaskBtn: null,
        taskList: null,
        taskCounter: null,
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

    function init() {
     
        elements.taskInput = document.getElementById('taskInput');
        elements.taskPriority = document.getElementById('taskPriority');
        elements.addTaskBtn = document.getElementById('addTaskBtn');
        elements.taskList = document.getElementById('taskList');
        elements.taskCounter = document.getElementById('taskCounter');
        
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

      
        attachEventListeners();

     
        renderTasks();
     
        updateCounter();
    }

    function attachEventListeners() {
    
        if (elements.addTaskBtn) {
            elements.addTaskBtn.addEventListener('click', handleAddTask);
        }

  
        if (elements.taskInput) {
            elements.taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleAddTask();
                }
            });
        }
        
       
        if (elements.saveEditTaskBtn) {
            elements.saveEditTaskBtn.addEventListener('click', handleSaveEditTask);
        }
        
        if (elements.confirmDeleteBtn) {
            elements.confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
        }
    }

   
    function loadTasks() {
        const storedTasks = Storage.get(STORAGE_KEY);
        tasks = storedTasks || [];
    }

   
    function saveTasks() {
        Storage.set(STORAGE_KEY, tasks);
    }

    function handleAddTask() {
        const taskText = elements.taskInput.value.trim();
        const priority = elements.taskPriority.value;

    
        if (Validators.isEmpty(taskText)) {
            elements.taskInput.focus();
            AnimationUtils.pulseElement(elements.taskInput);
            return;
        }

   
        const newTask = {
            id: IDGenerator.generate('task'),
            text: taskText,
            priority: priority,
            completed: false,
            createdAt: DateUtils.getTimestamp()
        };

      
        tasks.unshift(newTask);

    
        saveTasks();
        renderTasks();
        updateCounter();
        
  
        updateOverview();

  
        elements.taskInput.value = '';
        elements.taskInput.focus();

      
        if (elements.taskCounter) {
            AnimationUtils.pulseElement(elements.taskCounter);
        }
    }

   
    function handleToggleTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
            updateCounter();
            updateOverview();
        }
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
       
            taskElement.style.opacity = '0';
            taskElement.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== pendingDeleteId);
                saveTasks();
                renderTasks();
                updateCounter();
                updateOverview();
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
    }
    
    function handleSaveEditTask() {
        const taskId = elements.editTaskId.value;
        const newText = elements.editTaskText.value.trim();
        const newPriority = elements.editTaskPriority.value;
        
        if (Validators.isEmpty(newText)) {
            elements.editTaskText.focus();
            return;
        }
        
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.text = newText;
            task.priority = newPriority;
            saveTasks();
            renderTasks();
            updateCounter();
            updateOverview();
        }
        
       
        elements.editTaskModal.hide();
    }

    function updateCounter() {
        if (!elements.taskCounter) return;
        const pendingTasks = tasks.filter(t => !t.completed).length;
        elements.taskCounter.textContent = pendingTasks;
    }

   
    function updateOverview() {
        if (window.StudentOrganizer && window.StudentOrganizer.updateOverview) {
            setTimeout(() => {
                window.StudentOrganizer.updateOverview();
            }, 100);
        }
    }

    function renderTasks() {
        if (!elements.taskList) return;
        
        DOM.clearElement(elements.taskList);

        if (tasks.length === 0) {
            const emptyMessage = DOM.createElement('p', ['text-muted', 'text-center', 'py-4']);
            emptyMessage.textContent = 'No tasks yet. Add one to get started!';
            elements.taskList.appendChild(emptyMessage);
            return;
        }

        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(t => t.completed);
        }

        if (filteredTasks.length === 0) {
            const emptyMessage = DOM.createElement('p', ['text-muted', 'text-center', 'py-4']);
            emptyMessage.textContent = `No ${currentFilter} tasks`;
            elements.taskList.appendChild(emptyMessage);
            return;
        }

        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            elements.taskList.appendChild(taskElement);
        });
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
        timeSpan.textContent = DateUtils.formatDate(task.createdAt);

        metaDiv.appendChild(priorityBadge);
        metaDiv.appendChild(timeSpan);

        contentDiv.appendChild(taskText);
        contentDiv.appendChild(metaDiv);

        
        const actionsDiv = DOM.createElement('div', ['task-actions']);

      
        const editBtn = DOM.createElement('button', ['task-btn', 'edit'], {
            'aria-label': 'Edit task'
        });
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => handleEditTask(task.id));

        
        const deleteBtn = DOM.createElement('button', ['task-btn', 'delete'], {
            'aria-label': 'Delete task'
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