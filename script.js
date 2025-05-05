let tasks = [];

function addTask() {
    const taskSubject = document.getElementById('taskSubject').value;
    const taskText = document.getElementById('taskText').value;
    const taskTime = document.getElementById('taskTime').value;
    
    if (taskSubject.trim() === '' || taskText.trim() === '') {
        alert('Пожалуйста, введите предмет и задачу');
        return;
    }
    
    const task = {
        id: Date.now(),
        subject: taskSubject,
        text: taskText,
        time: taskTime,
        completed: false
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    
    // Очищаем поля ввода
    document.getElementById('taskSubject').value = '';
    document.getElementById('taskText').value = '';
    document.getElementById('taskTime').value = '';
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const li = document.querySelector(`li[data-task-id="${taskId}"]`);
    if (!li) return;

    // Создаем форму редактирования
    const editForm = document.createElement('div');
    editForm.className = 'edit-form';
    
    const subjectInput = document.createElement('input');
    subjectInput.type = 'text';
    subjectInput.value = task.subject;
    subjectInput.placeholder = 'Предмет...';
    
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = task.text;
    textInput.placeholder = 'Задача...';
    
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = task.time;
    
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Сохранить';
    saveButton.onclick = () => {
        task.subject = subjectInput.value;
        task.text = textInput.value;
        task.time = dateInput.value;
        saveTasks();
        renderTasks();
    };
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Отмена';
    cancelButton.onclick = () => {
        renderTasks();
    };
    
    editForm.appendChild(subjectInput);
    editForm.appendChild(textInput);
    editForm.appendChild(dateInput);
    editForm.appendChild(saveButton);
    editForm.appendChild(cancelButton);
    
    // Очищаем содержимое li и добавляем форму
    li.innerHTML = '';
    li.appendChild(editForm);
}

function renderTasks() {
    const pendingTasksList = document.getElementById('pendingTasks');
    const completedTasksList = document.getElementById('completedTasks');
    
    pendingTasksList.innerHTML = '';
    completedTasksList.innerHTML = '';
    
    // Сортируем задачи по дате
    const sortedTasks = [...tasks].sort((a, b) => {
        // Если у задачи нет даты, помещаем её в конец
        if (!a.time) return 1;
        if (!b.time) return -1;
        return new Date(a.time) - new Date(b.time);
    });
    
    sortedTasks.forEach(task => {
        const li = document.createElement('li');
        li.setAttribute('data-task-id', task.id);
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onclick = () => toggleTask(task.id);
        
        const taskSubject = document.createElement('span');
        taskSubject.className = 'task-subject';
        taskSubject.textContent = task.subject;
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        const taskTime = document.createElement('span');
        taskTime.className = 'task-time';
        if (task.time) {
            const date = new Date(task.time);
            const formattedDate = date.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            taskTime.textContent = formattedDate;
        } else {
            taskTime.textContent = 'Без срока';
        }

        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.textContent = '✎';
        editButton.onclick = () => editTask(task.id);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '×';
        deleteButton.onclick = () => deleteTask(task.id);
        
        li.appendChild(checkbox);
        li.appendChild(taskSubject);
        li.appendChild(taskText);
        li.appendChild(taskTime);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        
        if (task.completed) {
            completedTasksList.appendChild(li);
        } else {
            pendingTasksList.appendChild(li);
        }
    });
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    renderTasks();
}

// Загружаем задачи при загрузке страницы
document.addEventListener('DOMContentLoaded', loadTasks); 