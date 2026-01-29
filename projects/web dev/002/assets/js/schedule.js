const ScheduleModule = (() => {
    const STORAGE_KEY = 'student_organizer_schedule';
    let classes = [];

    const TIME_SLOTS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
    const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const elements = {
        addClassForm: null,
        className: null,
        classDay: null,
        classTime: null,
        classRoom: null,
        classColor: null,
        saveClassBtn: null,
        scheduleTableBody: null,
        addClassModal: null,
        scheduleMobileView: null
    };

    function init() {
      
        elements.addClassForm = document.getElementById('addClassForm');
        elements.className = document.getElementById('className');
        elements.classDay = document.getElementById('classDay');
        elements.classTime = document.getElementById('classTime');
        elements.classRoom = document.getElementById('classRoom');
        elements.classColor = document.getElementById('classColor');
        elements.saveClassBtn = document.getElementById('saveClassBtn');
        elements.scheduleTableBody = document.getElementById('scheduleTableBody');
        elements.scheduleMobileView = document.getElementById('scheduleMobileView');

        const modalElement = document.getElementById('addClassModal');
        if (modalElement) {
            elements.addClassModal = new bootstrap.Modal(modalElement);
        }

        loadClasses();
        attachEventListeners();
        renderSchedule();
        highlightToday();
    }

    function attachEventListeners() {
 
        if (elements.saveClassBtn) {
            elements.saveClassBtn.addEventListener('click', handleAddClass);
        }

      
        const colorPresets = document.querySelectorAll('.color-preset');
        colorPresets.forEach(preset => {
            preset.addEventListener('click', (e) => {
                e.preventDefault();
                const color = preset.dataset.color;
                elements.classColor.value = color;
                
            
                colorPresets.forEach(p => p.classList.remove('active'));
                preset.classList.add('active');
            });
        });
    }

    function loadClasses() {
        const storedClasses = Storage.get(STORAGE_KEY);
        classes = storedClasses || [];
    }

    function saveClasses() {
        return Storage.set(STORAGE_KEY, classes);
    }

    function handleAddClass() {

        if (!FormValidator.validate(elements.addClassForm)) {
            showToast('Please fill in all required fields', 'warning');
            return;
        }

        const name = elements.className.value.trim();
        const day = elements.classDay.value;
        const time = elements.classTime.value;
        const room = elements.classRoom.value.trim();
        const color = elements.classColor.value;

    
        const conflict = classes.find(c => c.day === day && c.time === time);
        if (conflict) {
            showToast(`You already have a class (${conflict.name}) at this time!`, 'warning');
            return;
        }

      
        LoadingState.show(elements.saveClassBtn);

        setTimeout(() => {
            const newClass = {
                id: IDGenerator.generate('class'),
                name: name,
                day: day,
                time: time,
                room: room,
                color: color,
                createdAt: DateUtils.getTimestamp()
            };

            classes.push(newClass);

            if (saveClasses()) {
                renderSchedule();
                updateOverview();
                
               
                elements.addClassForm.reset();
                elements.classColor.value = '#800000';
                FormValidator.clearValidation(elements.addClassForm);
                
                
                document.querySelectorAll('.color-preset').forEach(p => p.classList.remove('active'));
                document.querySelector('.color-preset[data-color="#800000"]')?.classList.add('active');
                
                elements.addClassModal.hide();
                showToast('Class added successfully!', 'success');
            }

            LoadingState.hide(elements.saveClassBtn);
        }, 300);
    }

    function handleDeleteClass(classId) {
        const classItem = classes.find(c => c.id === classId);
        if (!classItem) return;

        if (confirm(`Delete ${classItem.name}?`)) {
            classes = classes.filter(c => c.id !== classId);
            
            if (saveClasses()) {
                renderSchedule();
                updateOverview();
                showToast('Class deleted', 'info');
            }
        }
    }

    function renderSchedule() {
        renderDesktopSchedule();
        renderMobileSchedule();
    }

    function renderDesktopSchedule() {
        if (!elements.scheduleTableBody) return;

        DOM.clearElement(elements.scheduleTableBody);

        TIME_SLOTS.forEach(time => {
            const row = DOM.createElement('tr');
            
          
            const timeCell = DOM.createElement('td');
            timeCell.textContent = formatTimeSlot(time);
            row.appendChild(timeCell);

           
            DAYS.forEach(day => {
                const dayCell = DOM.createElement('td');
                const classForSlot = classes.find(c => c.day === day && c.time === time);

                if (classForSlot) {
                    const classDiv = DOM.createElement('div', ['class-item']);
                    classDiv.style.background = classForSlot.color;
                    
                    const nameDiv = DOM.createElement('div', ['class-name']);
                    nameDiv.textContent = classForSlot.name;
                    
                    const deleteBtn = DOM.createElement('button', ['class-delete'], {
                        'aria-label': 'Delete class',
                        'title': 'Delete class'
                    });
                    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        handleDeleteClass(classForSlot.id);
                    });

                    classDiv.appendChild(nameDiv);

                    if (classForSlot.room) {
                        const roomDiv = DOM.createElement('div', ['class-room']);
                        roomDiv.innerHTML = `<i class="fas fa-map-marker-alt me-1"></i>${classForSlot.room}`;
                        classDiv.appendChild(roomDiv);
                    }

                    classDiv.appendChild(deleteBtn);
                    dayCell.appendChild(classDiv);
                }

                row.appendChild(dayCell);
            });

            elements.scheduleTableBody.appendChild(row);
        });
    }

    function renderMobileSchedule() {
        if (!elements.scheduleMobileView) return;

        DOM.clearElement(elements.scheduleMobileView);

        if (classes.length === 0) {
            const emptyState = DOM.createElement('div', ['empty-state']);
            emptyState.innerHTML = `
                <div class="empty-state-icon">
                    <i class="fas fa-calendar-week"></i>
                </div>
                <h4 class="empty-state-title">No classes scheduled</h4>
                <p class="empty-state-description">Click "Add Class" to create your schedule</p>
            `;
            elements.scheduleMobileView.appendChild(emptyState);
            return;
        }

        DAYS.forEach(day => {
            const dayClasses = classes.filter(c => c.day === day);
            if (dayClasses.length === 0) return;

            const card = DOM.createElement('div', ['custom-card', 'mb-3']);
            const cardBody = DOM.createElement('div', ['card-body']);

            const dayTitle = DOM.createElement('h5', ['mb-3']);
            dayTitle.textContent = day.charAt(0).toUpperCase() + day.slice(1);
            dayTitle.style.color = 'var(--pup-maroon)';
            cardBody.appendChild(dayTitle);

            dayClasses.sort((a, b) => a.time.localeCompare(b.time)).forEach(classItem => {
                const classDiv = DOM.createElement('div', ['class-item', 'mb-2']);
                classDiv.style.background = classItem.color;

                const content = `
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="class-name">${classItem.name}</div>
                            <div class="class-room">
                                <i class="fas fa-clock me-1"></i>${formatTimeSlot(classItem.time)}
                                ${classItem.room ? `<i class="fas fa-map-marker-alt ms-2 me-1"></i>${classItem.room}` : ''}
                            </div>
                        </div>
                        <button class="class-delete" style="opacity: 1; position: static;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                classDiv.innerHTML = content;

                const deleteBtn = classDiv.querySelector('.class-delete');
                deleteBtn.addEventListener('click', () => handleDeleteClass(classItem.id));

                cardBody.appendChild(classDiv);
            });

            card.appendChild(cardBody);
            elements.scheduleMobileView.appendChild(card);
        });
    }

    function highlightToday() {
        const currentDay = DateUtils.getCurrentDay();
        const dayHeaders = document.querySelectorAll('.day-header');
        
        dayHeaders.forEach(header => {
            if (header.dataset.day === currentDay) {
                header.classList.add('today');
            }
        });
    }

    function formatTimeSlot(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${displayHour}:${minutes} ${period}`;
    }

    function getClassesForDay(day) {
        return classes.filter(c => c.day === day).sort((a, b) => a.time.localeCompare(b.time));
    }

    function getClasses() {
        return classes;
    }

    function getStats() {
        const uniqueDays = new Set(classes.map(c => c.day));
        const today = DateUtils.getCurrentDay();
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