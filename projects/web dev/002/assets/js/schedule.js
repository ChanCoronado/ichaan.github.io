const ScheduleModule = (() => {
    const STORAGE_KEY = 'student_organizer_schedule';
    let classes = [];
    let dragState = {
        isDragging: false,
        isResizing: false,
        draggedClass: null,
        startY: 0,
        startX: 0,
        startDay: null,
        originalStartTime: null,
        originalEndTime: null
    };

    const TIME_SLOTS = [
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00', '23:00' 
    ];
    
    const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const elements = {
        addClassModal: null,
        editClassModal: null,
        deleteClassModal: null,
        addClassForm: null,
        editClassForm: null,
        scheduleGrid: null,
        mobileScheduleView: null,
        currentDaySelector: null
    };

    let currentMobileDay = getCurrentDay();
    let isTransitioning = false;

    function init() {
        console.log('=== ScheduleModule Initializing ===');
        initializeElements();
        loadClasses();
        migrateOldData();
        attachEventListeners();
        renderSchedule();
        highlightToday();
        showCurrentTimeIndicator();
        scrollToCurrentTime();
        
        setInterval(showCurrentTimeIndicator, 60000);
        console.log('=== ScheduleModule Initialized Successfully ===');
    }

    function initializeElements() {
        elements.scheduleGrid = document.getElementById('scheduleGrid');
        elements.mobileScheduleView = document.getElementById('mobileScheduleView');
        elements.currentDaySelector = document.getElementById('currentDaySelector');
        elements.addClassForm = document.getElementById('addClassForm');
        elements.editClassForm = document.getElementById('editClassForm');

        const addModalElement = document.getElementById('addClassModal');
        if (addModalElement) {
            elements.addClassModal = new bootstrap.Modal(addModalElement);
        }

        const editModalElement = document.getElementById('editClassModal');
        if (editModalElement) {
            elements.editClassModal = new bootstrap.Modal(editModalElement);
        }

        const deleteModalElement = document.getElementById('deleteClassModal');
        if (deleteModalElement) {
            elements.deleteClassModal = new bootstrap.Modal(deleteModalElement);
        }

        populateTimeSelects();
        
        if (elements.currentDaySelector) {
            elements.currentDaySelector.value = currentMobileDay;
        }
    }

    function populateTimeSelects() {
        const timeOptions = [];
        for (let hour = 6; hour <= 23; hour++) {
            ['00', '30'].forEach(minute => {
                const time24 = `${String(hour).padStart(2, '0')}:${minute}`;
                const time12 = formatTimeSlot(time24);
                timeOptions.push(`<option value="${time24}">${time12}</option>`);
            });
        }

        const startSelects = document.querySelectorAll('#classStartTime, #editClassStartTime');
        const endSelects = document.querySelectorAll('#classEndTime, #editClassEndTime');

        startSelects.forEach(select => {
            select.innerHTML = '<option value="">Select time</option>' + timeOptions.join('');
        });

        endSelects.forEach(select => {
            select.innerHTML = '<option value="">Select time</option>' + timeOptions.join('');
        });
    }

    function attachEventListeners() {
        const saveClassBtn = document.getElementById('saveClassBtn');
        if (saveClassBtn) {
            saveClassBtn.addEventListener('click', handleAddClass);
        }

        const saveEditBtn = document.getElementById('saveEditClassBtn');
        if (saveEditBtn) {
            saveEditBtn.addEventListener('click', handleEditClass);
        }

        const confirmDeleteBtn = document.getElementById('confirmDeleteClass');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
        }

        const colorPresets = document.querySelectorAll('.color-preset');
        colorPresets.forEach(preset => {
            preset.addEventListener('click', (e) => {
                e.preventDefault();
                const color = preset.dataset.color;
                const modal = preset.closest('.modal');
                const colorInput = modal.querySelector('input[type="color"]');
                if (colorInput) {
                    colorInput.value = color;
                    modal.querySelectorAll('.color-preset').forEach(p => p.classList.remove('active'));
                    preset.classList.add('active');
                }
            });
        });

        if (elements.currentDaySelector) {
            elements.currentDaySelector.addEventListener('change', (e) => {
                changeMobileDay(e.target.value);
            });
        }

        const prevDayBtn = document.getElementById('prevDayBtn');
        const nextDayBtn = document.getElementById('nextDayBtn');

        if (prevDayBtn) {
            prevDayBtn.addEventListener('click', () => {
                if (isTransitioning) return;
                const currentIndex = DAYS.indexOf(currentMobileDay);
                const prevIndex = currentIndex === 0 ? DAYS.length - 1 : currentIndex - 1;
                changeMobileDay(DAYS[prevIndex], 'right');
            });
        }

        if (nextDayBtn) {
            nextDayBtn.addEventListener('click', () => {
                if (isTransitioning) return;
                const currentIndex = DAYS.indexOf(currentMobileDay);
                const nextIndex = (currentIndex + 1) % DAYS.length;
                changeMobileDay(DAYS[nextIndex], 'left');
            });
        }

        let touchStartX = 0;
        let touchEndX = 0;

        if (elements.mobileScheduleView) {
            elements.mobileScheduleView.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            elements.mobileScheduleView.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }

        function handleSwipe() {
            if (isTransitioning) return;
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                const currentIndex = DAYS.indexOf(currentMobileDay);
                if (diff > 0) {
                    const nextIndex = (currentIndex + 1) % DAYS.length;
                    changeMobileDay(DAYS[nextIndex], 'left');
                } else {
                    const prevIndex = currentIndex === 0 ? DAYS.length - 1 : currentIndex - 1;
                    changeMobileDay(DAYS[prevIndex], 'right');
                }
            }
        }

        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchmove', handleDragMove, { passive: false });
        document.addEventListener('touchend', handleDragEnd);
    }

    function changeMobileDay(newDay, direction = null) {
        if (isTransitioning || currentMobileDay === newDay) return;
        
        isTransitioning = true;
        const oldDay = currentMobileDay;
        currentMobileDay = newDay;
        
        if (elements.currentDaySelector) {
            elements.currentDaySelector.value = newDay;
        }

        if (direction && elements.mobileScheduleView) {
            const grid = elements.mobileScheduleView.querySelector('.mobile-schedule-grid');
            if (grid) {
                grid.style.transition = 'none';
                grid.style.opacity = '0';
                grid.style.transform = direction === 'left' ? 'translateX(20px)' : 'translateX(-20px)';
                
                setTimeout(() => {
                    renderMobileSchedule();
                    const newGrid = elements.mobileScheduleView.querySelector('.mobile-schedule-grid');
                    if (newGrid) {
                        setTimeout(() => {
                            newGrid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            newGrid.style.opacity = '1';
                            newGrid.style.transform = 'translateX(0)';
                            setTimeout(() => {
                                isTransitioning = false;
                            }, 300);
                        }, 10);
                    } else {
                        isTransitioning = false;
                    }
                }, 10);
            } else {
                renderMobileSchedule();
                isTransitioning = false;
            }
        } else {
            renderMobileSchedule();
            isTransitioning = false;
        }
    }

    function loadClasses() {
        const storedClasses = Storage.get(STORAGE_KEY);
        classes = storedClasses || [];
        console.log('Loaded classes:', classes.length);
    }

    function saveClasses() {
        return Storage.set(STORAGE_KEY, classes);
    }

    function migrateOldData() {
        let needsMigration = false;
        
        classes = classes.map(classItem => {
            if (classItem.time && !classItem.startTime) {
                needsMigration = true;
                const startTime = classItem.time;
                const [hours, minutes] = startTime.split(':');
                const endHour = (parseInt(hours) + 1).toString().padStart(2, '0');
                const endTime = `${endHour}:${minutes}`;
                
                return {
                    ...classItem,
                    startTime: startTime,
                    endTime: endTime,
                    time: undefined
                };
            }
            return classItem;
        });

        if (needsMigration) {
            saveClasses();
            showToast('Schedule data updated to new format', 'info');
        }
    }

    function handleAddClass() {
        if (!FormValidator.validate(elements.addClassForm)) {
            showToast('Please fill in all required fields', 'warning');
            return;
        }

        const name = document.getElementById('className').value.trim();
        const day = document.getElementById('classDay').value;
        const startTime = document.getElementById('classStartTime').value;
        const endTime = document.getElementById('classEndTime').value;
        const room = document.getElementById('classRoom').value.trim();
        const color = document.getElementById('classColor').value;

        if (startTime >= endTime) {
            showToast('End time must be after start time', 'warning');
            return;
        }

        const conflicts = findConflicts(day, startTime, endTime);
        if (conflicts.length > 0) {
            const conflictNames = conflicts.map(c => c.name).join(', ');
            showToast(`Warning: Overlaps with ${conflictNames}`, 'warning', 4000);
        }

        const saveBtn = document.getElementById('saveClassBtn');
        LoadingState.show(saveBtn);

        setTimeout(() => {
            const newClass = {
                id: IDGenerator.generate('class'),
                name: name,
                day: day,
                startTime: startTime,
                endTime: endTime,
                room: room,
                color: color,
                createdAt: DateUtils.getTimestamp()
            };

            classes.push(newClass);

            if (saveClasses()) {
                renderSchedule();
                updateOverview();
                
                elements.addClassForm.reset();
                document.getElementById('classColor').value = '#800000';
                FormValidator.clearValidation(elements.addClassForm);
                
                document.querySelectorAll('#addClassModal .color-preset').forEach(p => p.classList.remove('active'));
                document.querySelector('#addClassModal .color-preset[data-color="#800000"]')?.classList.add('active');
                
                elements.addClassModal.hide();
                showToast('Class added successfully!', 'success');
            }

            LoadingState.hide(saveBtn);
        }, 300);
    }

    function handleEditClass() {
        if (!FormValidator.validate(elements.editClassForm)) {
            showToast('Please fill in all required fields', 'warning');
            return;
        }

        const classId = document.getElementById('editClassId').value;
        const name = document.getElementById('editClassName').value.trim();
        const day = document.getElementById('editClassDay').value;
        const startTime = document.getElementById('editClassStartTime').value;
        const endTime = document.getElementById('editClassEndTime').value;
        const room = document.getElementById('editClassRoom').value.trim();
        const color = document.getElementById('editClassColor').value;

        if (startTime >= endTime) {
            showToast('End time must be after start time', 'warning');
            return;
        }

        const conflicts = findConflicts(day, startTime, endTime, classId);
        if (conflicts.length > 0) {
            const conflictNames = conflicts.map(c => c.name).join(', ');
            showToast(`Warning: Overlaps with ${conflictNames}`, 'warning', 4000);
        }

        const saveBtn = document.getElementById('saveEditClassBtn');
        LoadingState.show(saveBtn);

        setTimeout(() => {
            const classIndex = classes.findIndex(c => c.id === classId);
            if (classIndex !== -1) {
                classes[classIndex] = {
                    ...classes[classIndex],
                    name: name,
                    day: day,
                    startTime: startTime,
                    endTime: endTime,
                    room: room,
                    color: color
                };

                if (saveClasses()) {
                    renderSchedule();
                    updateOverview();
                    elements.editClassModal.hide();
                    showToast('Class updated successfully!', 'success');
                }
            }

            LoadingState.hide(saveBtn);
        }, 300);
    }

    function openEditModal(classId) {
        const classItem = classes.find(c => c.id === classId);
        if (!classItem) return;

        document.getElementById('editClassId').value = classItem.id;
        document.getElementById('editClassName').value = classItem.name;
        document.getElementById('editClassDay').value = classItem.day;
        document.getElementById('editClassStartTime').value = classItem.startTime;
        document.getElementById('editClassEndTime').value = classItem.endTime;
        document.getElementById('editClassRoom').value = classItem.room || '';
        document.getElementById('editClassColor').value = classItem.color;

        document.querySelectorAll('#editClassModal .color-preset').forEach(p => {
            if (p.dataset.color === classItem.color) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });

        elements.editClassModal.show();
    }

    function openDeleteModal(classId) {
        const classItem = classes.find(c => c.id === classId);
        if (!classItem) return;

        document.getElementById('deleteClassId').value = classId;
        document.getElementById('deleteClassName').textContent = classItem.name;
        
        const timeRange = `${formatTimeSlot(classItem.startTime)} - ${formatTimeSlot(classItem.endTime)}`;
        const dayName = classItem.day.charAt(0).toUpperCase() + classItem.day.slice(1);
        document.getElementById('deleteClassDetails').textContent = `${dayName}, ${timeRange}`;

        elements.deleteClassModal.show();
    }

    function handleConfirmDelete() {
        const classId = document.getElementById('deleteClassId').value;
        const deleteBtn = document.getElementById('confirmDeleteClass');
        
        LoadingState.show(deleteBtn);

        setTimeout(() => {
            classes = classes.filter(c => c.id !== classId);
            
            if (saveClasses()) {
                renderSchedule();
                updateOverview();
                elements.deleteClassModal.hide();
                showToast('Class deleted successfully', 'success');
            }

            LoadingState.hide(deleteBtn);
        }, 300);
    }

    function findConflicts(day, startTime, endTime, excludeId = null) {
        return classes.filter(c => {
            if (c.id === excludeId) return false;
            if (c.day !== day) return false;
            if (!c.startTime || !c.endTime || !startTime || !endTime) return false;

            const classStart = timeToMinutes(c.startTime);
            const classEnd = timeToMinutes(c.endTime);
            const newStart = timeToMinutes(startTime);
            const newEnd = timeToMinutes(endTime);

            return (newStart < classEnd && newEnd > classStart);
        });
    }

    function renderSchedule() {
        renderDesktopSchedule();
        renderMobileSchedule();
    }

    function renderDesktopSchedule() {
        if (!elements.scheduleGrid) {
            console.error('scheduleGrid element not found!');
            return;
        }

        elements.scheduleGrid.innerHTML = '';

        const gridContainer = document.createElement('div');
        gridContainer.className = 'schedule-grid-container';
        
        const headerRow = document.createElement('div');
        headerRow.className = 'schedule-header-row';
        
        const timeHeader = document.createElement('div');
        timeHeader.className = 'schedule-time-header';
        timeHeader.textContent = 'Time';
        headerRow.appendChild(timeHeader);
        
        DAYS.forEach((day, dayIndex) => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'schedule-day-header-cell';
            dayHeader.textContent = DAY_LABELS[dayIndex];
            
            if (day === getCurrentDay()) {
                dayHeader.classList.add('today');
            }
            
            headerRow.appendChild(dayHeader);
        });
        
        gridContainer.appendChild(headerRow);
        
        const timeColumn = document.createElement('div');
        timeColumn.className = 'schedule-time-column';
        
        TIME_SLOTS.forEach((time, index) => {
            if (index < TIME_SLOTS.length - 1) {
                const timeSlot = document.createElement('div');
                timeSlot.className = 'schedule-time-slot';
                timeSlot.textContent = formatTimeSlot(time);
                timeColumn.appendChild(timeSlot);
            }
        });
        gridContainer.appendChild(timeColumn);

        DAYS.forEach((day, dayIndex) => {
            const dayColumn = document.createElement('div');
            dayColumn.className = 'schedule-day-column';
            dayColumn.dataset.day = day;

            if (day === getCurrentDay()) {
                dayColumn.classList.add('today-column');
            }

            const dayGrid = document.createElement('div');
            dayGrid.className = 'schedule-day-grid';

            for (let i = 0; i < TIME_SLOTS.length - 1; i++) {
                const hourSlot = document.createElement('div');
                hourSlot.className = 'schedule-hour-slot';
                
                const topHalf = document.createElement('div');
                topHalf.className = 'schedule-half-slot';
                topHalf.dataset.day = day;
                topHalf.dataset.time = TIME_SLOTS[i];
                topHalf.addEventListener('click', () => openAddModalWithTime(day, TIME_SLOTS[i]));
                
                const bottomHalf = document.createElement('div');
                bottomHalf.className = 'schedule-half-slot';
                const [hours, minutes] = TIME_SLOTS[i].split(':');
                const halfHourTime = `${hours}:30`;
                bottomHalf.dataset.day = day;
                bottomHalf.dataset.time = halfHourTime;
                bottomHalf.addEventListener('click', () => openAddModalWithTime(day, halfHourTime));

                hourSlot.appendChild(topHalf);
                hourSlot.appendChild(bottomHalf);
                dayGrid.appendChild(hourSlot);
            }

            const dayClasses = classes.filter(c => c.day === day);
            const positioned = positionClasses(dayClasses);

            positioned.forEach(({ classItem, left, width }) => {
                const classBlock = createClassBlock(classItem, left, width);
                dayGrid.appendChild(classBlock);
            });

            dayColumn.appendChild(dayGrid);
            gridContainer.appendChild(dayColumn);
        });

        elements.scheduleGrid.appendChild(gridContainer);
    }

    function positionClasses(dayClasses) {
        if (dayClasses.length === 0) return [];

        const sorted = [...dayClasses].sort((a, b) => {
            const aStart = timeToMinutes(a.startTime);
            const bStart = timeToMinutes(b.startTime);
            return aStart - bStart;
        });

        const columns = [];
        const result = [];

        sorted.forEach(classItem => {
            const start = timeToMinutes(classItem.startTime);
            const end = timeToMinutes(classItem.endTime);

            let columnIndex = columns.findIndex(col => {
                return col.every(existing => {
                    const existingEnd = timeToMinutes(existing.endTime);
                    return existingEnd <= start;
                });
            });

            if (columnIndex === -1) {
                columnIndex = columns.length;
                columns.push([]);
            }

            columns[columnIndex].push(classItem);
        });

        const maxColumns = columns.length;

        columns.forEach((col, colIndex) => {
            col.forEach(classItem => {
                result.push({
                    classItem,
                    left: (colIndex / maxColumns) * 100,
                    width: (1 / maxColumns) * 100
                });
            });
        });

        return result;
    }

    function createClassBlock(classItem, left = 0, width = 100) {
        const startMinutes = timeToMinutes(classItem.startTime);
        const endMinutes = timeToMinutes(classItem.endTime);
        const duration = endMinutes - startMinutes;
        
        const gridStart = timeToMinutes('06:00');
        const topOffset = ((startMinutes - gridStart) / 30) * 50;
        const height = (duration / 30) * 50;

        const block = document.createElement('div');
        block.className = 'schedule-class-block';
        block.style.top = `${topOffset}px`;
        block.style.height = `${height}px`;
        block.style.left = `${left}%`;
        block.style.width = `${width}%`;
        block.style.backgroundColor = classItem.color;
        block.dataset.classId = classItem.id;

        const content = document.createElement('div');
        content.className = 'schedule-class-content';
        
        const title = document.createElement('div');
        title.className = 'schedule-class-title';
        title.textContent = classItem.name;
        content.appendChild(title);

        const time = document.createElement('div');
        time.className = 'schedule-class-time';
        time.textContent = `${formatTimeSlot(classItem.startTime)} - ${formatTimeSlot(classItem.endTime)}`;
        content.appendChild(time);

        if (classItem.room) {
            const room = document.createElement('div');
            room.className = 'schedule-class-room';
            room.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${classItem.room}`;
            content.appendChild(room);
        }

        block.appendChild(content);

        const actions = document.createElement('div');
        actions.className = 'schedule-class-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'schedule-class-action-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Edit';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditModal(classItem.id);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'schedule-class-action-btn delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Delete';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openDeleteModal(classItem.id);
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        block.appendChild(actions);

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'schedule-resize-handle';
        block.appendChild(resizeHandle);

        block.addEventListener('mousedown', (e) => handleDragStart(e, classItem));
        block.addEventListener('touchstart', (e) => handleDragStart(e, classItem), { passive: false });
        
        resizeHandle.addEventListener('mousedown', (e) => handleResizeStart(e, classItem));
        resizeHandle.addEventListener('touchstart', (e) => handleResizeStart(e, classItem), { passive: false });

        return block;
    }

    function handleDragStart(e, classItem) {
        if (e.target.closest('.schedule-class-action-btn') || e.target.closest('.schedule-resize-handle')) {
            return;
        }

        e.preventDefault();
        
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;

        dragState.isDragging = true;
        dragState.draggedClass = classItem;
        dragState.startY = clientY;
        dragState.startX = clientX;
        dragState.startDay = classItem.day;
        dragState.originalStartTime = classItem.startTime;
        dragState.originalEndTime = classItem.endTime;

        const block = document.querySelector(`[data-class-id="${classItem.id}"]`);
        if (block) {
            block.classList.add('dragging');
        }

        document.body.style.cursor = 'grabbing';
    }

    function handleResizeStart(e, classItem) {
        e.preventDefault();
        e.stopPropagation();

        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        dragState.isResizing = true;
        dragState.draggedClass = classItem;
        dragState.startY = clientY;
        dragState.originalEndTime = classItem.endTime;

        const block = document.querySelector(`[data-class-id="${classItem.id}"]`);
        if (block) {
            block.classList.add('resizing');
        }

        document.body.style.cursor = 'ns-resize';
    }

    function handleDragMove(e) {
        if (!dragState.isDragging && !dragState.isResizing) return;

        e.preventDefault();

        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;

        if (dragState.isDragging) {
            const deltaY = clientY - dragState.startY;
            const slots = Math.round(deltaY / 25);
            
            if (slots !== 0) {
                const startMinutes = timeToMinutes(dragState.originalStartTime);
                const endMinutes = timeToMinutes(dragState.originalEndTime);
                const duration = endMinutes - startMinutes;
                
                let newStartMinutes = startMinutes + (slots * 30);
                newStartMinutes = Math.max(timeToMinutes('06:00'), Math.min(newStartMinutes, timeToMinutes('23:00') - duration));
                
                const newEndMinutes = newStartMinutes + duration;

                dragState.draggedClass.startTime = minutesToTime(newStartMinutes);
                dragState.draggedClass.endTime = minutesToTime(newEndMinutes);
            }

            const dayColumns = document.querySelectorAll('.schedule-day-column');
            dayColumns.forEach(col => {
                const rect = col.getBoundingClientRect();
                if (clientX >= rect.left && clientX <= rect.right) {
                    const newDay = col.dataset.day;
                    if (newDay && newDay !== dragState.draggedClass.day) {
                        dragState.draggedClass.day = newDay;
                    }
                }
            });

            updateBlockPosition(dragState.draggedClass.id);
        }

        if (dragState.isResizing) {
            const deltaY = clientY - dragState.startY;
            const slots = Math.round(deltaY / 25);
            
            if (slots !== 0) {
                const endMinutes = timeToMinutes(dragState.originalEndTime);
                let newEndMinutes = endMinutes + (slots * 30);
                
                const startMinutes = timeToMinutes(dragState.draggedClass.startTime);
                newEndMinutes = Math.max(startMinutes + 30, Math.min(newEndMinutes, timeToMinutes('23:00')));
                
                dragState.draggedClass.endTime = minutesToTime(newEndMinutes);
            }

            updateBlockPosition(dragState.draggedClass.id);
        }
    }

    function updateBlockPosition(classId) {
        const block = document.querySelector(`[data-class-id="${classId}"]`);
        if (!block) return;

        const classItem = dragState.draggedClass;
        const startMinutes = timeToMinutes(classItem.startTime);
        const endMinutes = timeToMinutes(classItem.endTime);
        const gridStart = timeToMinutes('06:00');
        const topOffset = ((startMinutes - gridStart) / 30) * 50;
        const height = ((endMinutes - startMinutes) / 30) * 50;
        
        block.style.top = `${topOffset}px`;
        block.style.height = `${height}px`;

        const timeEl = block.querySelector('.schedule-class-time');
        if (timeEl) {
            timeEl.textContent = `${formatTimeSlot(classItem.startTime)} - ${formatTimeSlot(classItem.endTime)}`;
        }
    }

    function handleDragEnd(e) {
        if (!dragState.isDragging && !dragState.isResizing) return;

        e.preventDefault();

        const block = document.querySelector(`[data-class-id="${dragState.draggedClass.id}"]`);
        if (block) {
            block.classList.remove('dragging', 'resizing');
        }

        document.body.style.cursor = '';

        if (saveClasses()) {
            renderSchedule();
            updateOverview();
            showToast('Class updated', 'success');
        }

        dragState = {
            isDragging: false,
            isResizing: false,
            draggedClass: null,
            startY: 0,
            startX: 0,
            startDay: null,
            originalStartTime: null,
            originalEndTime: null
        };
    }

    function openAddModalWithTime(day, time) {
        document.getElementById('classDay').value = day;
        document.getElementById('classStartTime').value = time;
        
        const [hours, minutes] = time.split(':');
        const endHour = minutes === '30' ? String(parseInt(hours) + 1).padStart(2, '0') : hours;
        const endMinutes = minutes === '30' ? '00' : '30';
        document.getElementById('classEndTime').value = `${endHour}:${endMinutes}`;

        elements.addClassModal.show();
    }

    function renderMobileSchedule() {
        if (!elements.mobileScheduleView) return;

        elements.mobileScheduleView.innerHTML = '';

        const dayClasses = classes.filter(c => c.day === currentMobileDay);

        const mobileGrid = document.createElement('div');
        mobileGrid.className = 'mobile-schedule-grid';
        mobileGrid.style.position = 'relative';

        const occupiedSlots = new Set();

        dayClasses.forEach(classItem => {
            const startMinutes = timeToMinutes(classItem.startTime);
            const endMinutes = timeToMinutes(classItem.endTime);
            const gridStart = timeToMinutes('06:00');
            
            const startSlotIndex = Math.floor((startMinutes - gridStart) / 30);
            const endSlotIndex = Math.ceil((endMinutes - gridStart) / 30);
            
            for (let i = startSlotIndex; i < endSlotIndex; i++) {
                occupiedSlots.add(i);
            }
        });

        for (let i = 0; i < TIME_SLOTS.length - 1; i++) {
            const hourBlock = document.createElement('div');
            hourBlock.className = 'mobile-hour-block';
            
            const timeLabel = document.createElement('div');
            timeLabel.className = 'mobile-time-label';
            timeLabel.textContent = formatTimeSlot(TIME_SLOTS[i]);
            hourBlock.appendChild(timeLabel);

            const slotsContainer = document.createElement('div');
            slotsContainer.className = 'mobile-slots-container';

            const topSlotIndex = i * 2;
            const bottomSlotIndex = i * 2 + 1;

            const topSlot = document.createElement('div');
            topSlot.className = 'mobile-time-slot';
            topSlot.dataset.time = TIME_SLOTS[i];
            topSlot.dataset.slotIndex = topSlotIndex;
            
            if (!occupiedSlots.has(topSlotIndex)) {
                topSlot.addEventListener('click', () => openAddModalWithTime(currentMobileDay, TIME_SLOTS[i]));
            } else {
                topSlot.classList.add('mobile-time-slot-occupied');
            }

            const [hours, minutes] = TIME_SLOTS[i].split(':');
            const halfHourTime = `${hours}:30`;
            const bottomSlot = document.createElement('div');
            bottomSlot.className = 'mobile-time-slot';
            bottomSlot.dataset.time = halfHourTime;
            bottomSlot.dataset.slotIndex = bottomSlotIndex;
            
            if (!occupiedSlots.has(bottomSlotIndex)) {
                bottomSlot.addEventListener('click', () => openAddModalWithTime(currentMobileDay, halfHourTime));
            } else {
                bottomSlot.classList.add('mobile-time-slot-occupied');
            }

            slotsContainer.appendChild(topSlot);
            slotsContainer.appendChild(bottomSlot);
            hourBlock.appendChild(slotsContainer);

            mobileGrid.appendChild(hourBlock);
        }

        dayClasses.forEach(classItem => {
            const startMinutes = timeToMinutes(classItem.startTime);
            const endMinutes = timeToMinutes(classItem.endTime);
            const duration = endMinutes - startMinutes;
            const gridStart = timeToMinutes('06:00');
            
            const startSlotIndex = Math.floor((startMinutes - gridStart) / 30);
            const numSlots = Math.ceil(duration / 30);
            
            const classBlock = createMobileClassBlock(classItem, duration);
            classBlock.style.position = 'absolute';
            classBlock.style.left = '96px';
            classBlock.style.right = '1rem';
            classBlock.style.top = `${startSlotIndex * 65 + (Math.floor(startSlotIndex / 2) * 10)}px`;
            classBlock.style.zIndex = '10';
            
            mobileGrid.appendChild(classBlock);
        });

        elements.mobileScheduleView.appendChild(mobileGrid);

        const now = new Date();
        const currentHour = now.getHours();
        if (getCurrentDay() === currentMobileDay && currentHour >= 6 && currentHour < 23) {
            setTimeout(() => {
                const currentHourIndex = currentHour - 6;
                const hourBlocks = mobileGrid.querySelectorAll('.mobile-hour-block');
                if (hourBlocks[currentHourIndex]) {
                    hourBlocks[currentHourIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    }

    function createMobileClassBlock(classItem, duration) {
        const block = document.createElement('div');
        block.className = 'mobile-class-block';
        block.style.backgroundColor = classItem.color;
        block.dataset.classId = classItem.id;
        
        const heightPerHalfHour = 60;
        const halfHourCount = duration / 30;
        const calculatedHeight = halfHourCount * heightPerHalfHour;
        const minHeight = 80;
        const finalHeight = Math.max(calculatedHeight, minHeight);
        
        block.style.minHeight = `${finalHeight}px`;

        const header = document.createElement('div');
        header.className = 'mobile-class-header';

        const title = document.createElement('div');
        title.className = 'mobile-class-title';
        title.textContent = classItem.name;
        header.appendChild(title);

        const actions = document.createElement('div');
        actions.className = 'mobile-class-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'mobile-class-action-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditModal(classItem.id);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'mobile-class-action-btn delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openDeleteModal(classItem.id);
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        header.appendChild(actions);

        block.appendChild(header);

        const body = document.createElement('div');
        body.className = 'mobile-class-body';

        const time = document.createElement('div');
        time.className = 'mobile-class-time';
        time.innerHTML = `<i class="fas fa-clock"></i> ${formatTimeSlot(classItem.startTime)} - ${formatTimeSlot(classItem.endTime)}`;
        body.appendChild(time);

        if (classItem.room) {
            const room = document.createElement('div');
            room.className = 'mobile-class-room';
            room.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${classItem.room}`;
            body.appendChild(room);
        }

        const durationHours = Math.floor(duration / 60);
        const durationMins = duration % 60;
        let durationText = '';
        if (durationHours > 0) durationText += `${durationHours}h `;
        if (durationMins > 0) durationText += `${durationMins}m`;
        
        const durationLabel = document.createElement('div');
        durationLabel.className = 'mobile-class-duration';
        durationLabel.innerHTML = `<i class="fas fa-hourglass-half"></i> ${durationText.trim()}`;
        body.appendChild(durationLabel);

        block.appendChild(body);

        return block;
    }

    function highlightToday() {
        const currentDay = getCurrentDay();
        const dayHeaders = document.querySelectorAll('.schedule-day-header-cell');
        
        dayHeaders.forEach((header, index) => {
            if (DAYS[index] === currentDay) {
                header.classList.add('today');
            }
        });
    }

    function showCurrentTimeIndicator() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        if (hours < 6 || hours >= 23) return;

        const currentMinutes = hours * 60 + minutes;
        const gridStart = 6 * 60;
        const offset = ((currentMinutes - gridStart) / 30) * 50;

        const existing = document.querySelector('.current-time-indicator');
        if (existing) existing.remove();

        const indicator = document.createElement('div');
        indicator.className = 'current-time-indicator';
        indicator.style.top = `${offset}px`;

        const dayGrids = document.querySelectorAll('.schedule-day-grid');
        const currentDay = getCurrentDay();
        
        dayGrids.forEach(grid => {
            const dayColumn = grid.closest('.schedule-day-column');
            if (dayColumn && dayColumn.dataset.day === currentDay) {
                grid.appendChild(indicator.cloneNode(true));
            }
        });
    }

    function scrollToCurrentTime() {
        setTimeout(() => {
            const now = new Date();
            const hours = now.getHours();
            
            if (hours >= 6 && hours < 22) {
                const container = document.querySelector('.schedule-container');
                if (container) {
                    const minutes = (hours - 6) * 60 + now.getMinutes();
                    const scrollPosition = (minutes / 30) * 50 - 100;
                    container.scrollTop = Math.max(0, scrollPosition);
                }
            }
        }, 100);
    }

    function timeToMinutes(time) {
        if (!time || typeof time !== 'string') {
            console.error('Invalid time value:', time);
            return 0;
        }
        const parts = time.split(':');
        if (parts.length !== 2) {
            console.error('Invalid time format:', time);
            return 0;
        }
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        if (isNaN(hours) || isNaN(minutes)) {
            console.error('Invalid time numbers:', time);
            return 0;
        }
        return hours * 60 + minutes;
    }

    function minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }

    function formatTimeSlot(time) {
        if (!time || typeof time !== 'string') {
            return '12:00 AM';
        }
        const parts = time.split(':');
        if (parts.length !== 2) {
            return '12:00 AM';
        }
        const hour = parseInt(parts[0]);
        const minutes = parts[1];
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${displayHour}:${minutes} ${period}`;
    }

    function getCurrentDay() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = new Date().getDay();
        return days[today];
    }

    function getClassesForDay(day) {
        return classes.filter(c => c.day === day).sort((a, b) => 
            timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
        );
    }

    function getClasses() {
        return classes;
    }

    function getStats() {
        const uniqueDays = new Set(classes.map(c => c.day));
        const today = getCurrentDay();
        const todayClasses = classes.filter(c => c.day === today);

        return {
            total: classes.length,
            uniqueDays: uniqueDays.size,
            todayCount: todayClasses.length,
            byDay: DAYS.reduce((acc, day) => {
                acc[day] = classes.filter(c => c.day === day).length;
                return acc;
            }, {})
        };
    }

    function updateOverview() {
        if (window.StudentOrganizer && window.StudentOrganizer.updateOverview) {
            setTimeout(() => {
                window.StudentOrganizer.updateOverview();
            }, 100);
        }
    }

    return {
        init,
        getClasses,
        getClassesForDay,
        getStats
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ScheduleModule.init);
} else {
    ScheduleModule.init();
}

window.ScheduleModule = ScheduleModule;