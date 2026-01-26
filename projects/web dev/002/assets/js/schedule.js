const ScheduleModule = (() => {
    
    const STORAGE_KEY = 'student_organizer_schedule';
    let classes = [];
    
  
    const TIME_SLOTS = [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
    
    const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

   
    const elements = {
        scheduleTableBody: null,
        addClassForm: null,
        saveClassBtn: null,
        addClassModal: null
    };

    function init() {
        
        elements.scheduleTableBody = document.getElementById('scheduleTableBody');
        elements.addClassForm = document.getElementById('addClassForm');
        elements.saveClassBtn = document.getElementById('saveClassBtn');
        elements.addClassModal = new bootstrap.Modal(document.getElementById('addClassModal'));

        
        loadClasses();

        
        attachEventListeners();

     
        renderSchedule();
        
      
        highlightCurrentDay();
    }

    function attachEventListeners() {
       
        elements.saveClassBtn.addEventListener('click', handleSaveClass);

       
        elements.addClassForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSaveClass();
        });

       
        document.getElementById('addClassModal').addEventListener('hidden.bs.modal', () => {
            elements.addClassForm.reset();
            document.getElementById('classColor').value = '#800000'; // Reset to PUP maroon
        });
        
        
        const colorPresets = document.querySelectorAll('.color-preset');
        colorPresets.forEach(preset => {
            preset.addEventListener('click', (e) => {
                const color = e.currentTarget.getAttribute('data-color');
                document.getElementById('classColor').value = color;
                
                
                colorPresets.forEach(p => p.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
    }

    function loadClasses() {
        const storedClasses = Storage.get(STORAGE_KEY);
        classes = storedClasses || [];
    }

    function saveClasses() {
        Storage.set(STORAGE_KEY, classes);
    }

    function handleSaveClass() {
       
        const className = document.getElementById('className').value.trim();
        const classDay = document.getElementById('classDay').value;
        const classTime = document.getElementById('classTime').value;
        const classRoom = document.getElementById('classRoom').value.trim();
        const classColor = document.getElementById('classColor').value; 

        
        if (Validators.isEmpty(className) || !classDay || !classTime) {
            alert('Please fill in all required fields');
            return;
        }

        
        const conflict = classes.find(c => 
            c.day === classDay && c.time === classTime
        );

        if (conflict) {
            if (!confirm('There is already a class at this time. Do you want to replace it?')) {
                return;
            }
           
            classes = classes.filter(c => c.id !== conflict.id);
        }

        const newClass = {
            id: IDGenerator.generate('class'),
            name: className,
            day: classDay,
            time: classTime,
            room: classRoom,
            color: classColor, 
            createdAt: DateUtils.getTimestamp()
        };

        classes.push(newClass);

        saveClasses();
        renderSchedule();

        elements.addClassModal.hide();
        elements.addClassForm.reset();
        document.getElementById('classColor').value = '#800000';
    }

    function handleDeleteClass(classId) {
        if (!confirm('Are you sure you want to delete this class?')) {
            return;
        }

        const classElement = document.querySelector(`[data-class-id="${classId}"]`);
        
        if (classElement) {
            
            classElement.style.opacity = '0';
            classElement.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                classes = classes.filter(c => c.id !== classId);
                saveClasses();
                renderSchedule();
            }, 300);
        }
    }

    function highlightCurrentDay() {
        const currentDay = DateUtils.getCurrentDay();
        const dayHeaders = document.querySelectorAll('.day-header');
        
        dayHeaders.forEach(header => {
            if (header.getAttribute('data-day') === currentDay) {
                header.classList.add('today');
            }
        });
    }

    function renderSchedule() {

        DOM.clearElement(elements.scheduleTableBody);

        TIME_SLOTS.forEach(time => {
            const row = createScheduleRow(time);
            elements.scheduleTableBody.appendChild(row);
        });
    }

    function createScheduleRow(time) {
        const row = DOM.createElement('tr');

        const timeCell = DOM.createElement('td');
        timeCell.textContent = formatTime(time);
        row.appendChild(timeCell);

        DAYS.forEach(day => {
            const dayCell = DOM.createElement('td');
            
            const dayClasses = classes.filter(c => 
                c.day === day && c.time === time
            );

            dayClasses.forEach(classItem => {
                const classElement = createClassElement(classItem);
                dayCell.appendChild(classElement);
            });

            row.appendChild(dayCell);
        });

        return row;
    }

    function createClassElement(classItem) {
        const classDiv = DOM.createElement('div', ['class-item'], {
            'data-class-id': classItem.id
        });
        
        classDiv.style.backgroundColor = classItem.color;


        const nameDiv = DOM.createElement('div', ['class-name']);
        nameDiv.textContent = classItem.name;

        if (classItem.room) {
            const roomDiv = DOM.createElement('div', ['class-room']);
            roomDiv.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${classItem.room}`;
            classDiv.appendChild(nameDiv);
            classDiv.appendChild(roomDiv);
        } else {
            classDiv.appendChild(nameDiv);
        }

       
        const deleteBtn = DOM.createElement('button', ['class-delete'], {
            'aria-label': 'Delete class'
        });
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDeleteClass(classItem.id);
        });

        classDiv.appendChild(deleteBtn);

        return classDiv;
    }

    function formatTime(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${displayHour}:${minutes} ${period}`;
    }

    function getClasses() {
        return classes;
    }

    function getClassesForDay(day) {
        return classes.filter(c => c.day === day).sort((a, b) => {
            return a.time.localeCompare(b.time);
        });
    }

    function getStats() {
        const stats = {
            total: classes.length,
            byDay: {}
        };

        DAYS.forEach(day => {
            stats.byDay[day] = classes.filter(c => c.day === day).length;
        });

        return stats;
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