import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const elem = {
    form: document.querySelector('.taskForm'),
    input: document.querySelector('#taskInput[name="task"]'),
    taskList: document.querySelector('.taskList'),
    taskItem: document.querySelector('#taskItemTemplate'),
};

elem.form.addEventListener('submit', event => {
    event.preventDefault();

    const taskText = elem.input.value.trim();
    if(!taskText) {
        iziToast.warning({
            title: 'Error',
            message: 'Please write task'
        });
        return;
    }

    const newTaskElement = createTaskElement(taskText);
    elem.taskList.append(newTaskElement);
    saveTasks();
   
    elem.input.value = '';
});

function createTaskElement(taskText, completed = false) {
    const taskElement = elem.taskItem.cloneNode(true);
    const taskTextElem = taskElement.querySelector('.taskText');
    const taskCheckBox = taskElement.querySelector('.completeCheckbox');

    taskCheckBox.checked = completed; 
    taskTextElem.textContent = taskText;
    taskElement.style.display = '';
    taskElement.removeAttribute('id');

    taskElement.classList.toggle('completed', completed);

    return taskElement;
}

elem.taskList.addEventListener('click', e => {
    const deleteBtn = e.target.closest('.deleteButton');
    if (!deleteBtn) {
        return;
    }
    
    const deleteElem = deleteBtn.closest('.taskItem');
    deleteElem.remove();
    saveTasks();
});

elem.taskList.addEventListener('change', e => {
    const checkBox = e.target.closest('.completeCheckbox');
    if(!checkBox) {
        return;
    }

    const completeElem = checkBox.closest('.taskItem');

    completeElem.classList.toggle('completed', checkBox.checked);

    saveTasks();
});

function saveTasks() {
    const taskItems = elem.taskList.querySelectorAll('.taskItem');
    const taskElements = Array.from(taskItems).filter(item => item.id !== "taskItemTemplate");
    const tasksData = taskElements.map(item => {
        const text = item.querySelector('.taskText').textContent; 
        const completed = item.querySelector('.completeCheckbox').checked; 
        return {text, completed};
    });
    const tasksJson = JSON.stringify(tasksData);
    localStorage.setItem("tasks", tasksJson);
}

function loadTasks () {
    const savedTasksJson = localStorage.getItem('tasks');
    if (savedTasksJson !== null) {
        const savedTasks = JSON.parse(savedTasksJson);

        savedTasks.forEach(element => {
            const taskElement = createTaskElement(element.text, element.completed);
            elem.taskList.append(taskElement);   
        });
    }
}

loadTasks();
