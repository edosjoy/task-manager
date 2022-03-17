'use strict';

const
    taskBook = document.querySelector('.task-book'),
    inputTask = document.querySelector('input'),
    clearInput = document.querySelector('.clear-input');

let
    arrTasks = [],
    arrTasksDone = [],
    oldTask;

if (localStorage.getItem('tasks') !== null && localStorage.getItem('tasks').length > 0) {
    arrTasks = localStorage.getItem('tasks').split(',');
    arrTasks.forEach(item => {
        let newElement = document.createElement('div');
        newElement.classList.add('task');
        newElement.innerHTML = `
            <span class="text"><input type="checkbox">${item}</span>
            <span class="delete-task" title="Delete the task">X</span>`;
        taskBook.append(newElement);
    });
}

if (localStorage.getItem('tasksDone') !== null && localStorage.getItem('tasksDone').length > 0) {
    arrTasksDone = localStorage.getItem('tasksDone').split(',');
    arrTasksDone.forEach(item => {
        let newElement = document.createElement('div');
        newElement.classList.add('task');
        newElement.innerHTML = `
            <span class="text done">${item}</span>
            <span class="delete-task" title="Delete the task">X</span>`;
        taskBook.append(newElement);
    });
}

inputTask.value = '';

taskBook.addEventListener('click', event => {
    if (event.target.type === 'checkbox' && event.target.checked) {
        event.target.parentNode.classList.add('done');
        arrTasks.splice(arrTasks.indexOf(event.target.parentNode.innerText), 1);
        arrTasksDone.push(event.target.parentNode.innerText);
        localStorage.setItem('tasks', arrTasks);
        localStorage.setItem('tasksDone', arrTasksDone);
        event.target.remove();
    } else if (event.target.classList.contains('delete-task')) {
        let sure = confirm('Are you sure?');
        if (sure) {
            if (arrTasks.includes(event.target.parentNode.children[0].innerText)) {
                arrTasks.splice(arrTasks.indexOf(event.target.parentNode.children[0].innerText), 1);
                localStorage.setItem('tasks', arrTasks);
            } else if (arrTasksDone.includes(event.target.parentNode.children[0].innerText)) {
                arrTasksDone.splice(arrTasksDone.indexOf(event.target.parentNode.children[0].innerText), 1);
                localStorage.setItem('tasksDone', arrTasksDone);
            }
            event.target.parentNode.remove();
        }
    }
})

taskBook.addEventListener('dblclick', event => {
    let target;

    if (event.target.classList.contains('task') && !event.target.children[0].classList.contains('done')) {
        target = event.target;
    } else if (event.target.classList.contains('text') && !event.target.classList.contains('done')) {
        target = event.target.parentNode;
    }

    if (target) {
        oldTask = target.childNodes[1].innerText;

        target.innerHTML = `<input type="text" class="change-task" value="${oldTask}">`;
        taskBook.querySelector('.change-task').focus();
        taskBook.querySelector('.change-task').selectionStart = oldTask.length;
    }
});

taskBook.addEventListener('keydown', event => {
    if (event.target.classList.contains('change-task') && event.key === 'Enter') {
        arrTasks[arrTasks.indexOf(oldTask)] = event.target.value;
        localStorage.setItem('tasks', arrTasks);
        event.target.parentNode.innerHTML = `
            <span class="text"><input type="checkbox">${event.target.value}</span>
            <span class="delete-task" title="Delete the task">X</span>`;
    } else if (event.target.classList.contains('change-task') && event.key === 'Escape') {
        event.target.parentNode.innerHTML = `
            <span class="text"><input type="checkbox">${oldTask}</span>
            <span class="delete-task" title="Delete the task">X</span>`;
    }
})

taskBook.addEventListener('focusout', event => {
    if (event.target.classList.contains('change-task')) {
        arrTasks[arrTasks.indexOf(oldTask)] = event.target.value;
        localStorage.setItem('tasks', arrTasks);
        event.target.parentNode.innerHTML = `
            <span class="text"><input type="checkbox">${event.target.value}</span>
            <span class="delete-task" title="Delete the task">X</span>`;
    }
});

inputTask.addEventListener('keydown', event => {
    if (inputTask.value && event.key === 'Enter') {
        const newElement = document.createElement('div');
        newElement.classList.add('task');
        newElement.innerHTML = `
            <span class="text"><input type="checkbox">${inputTask.value}</span>
            <span class="delete-task" title="Delete the task">X</span>`;
        taskBook.append(newElement);
        arrTasks.push(inputTask.value);
        localStorage.setItem('tasks', arrTasks);
        inputTask.value = '';
    } else if (inputTask.value && event.key === 'Escape') {
        inputTask.value = '';
    }
})

clearInput.addEventListener('click', () => {
    inputTask.value = '';
});