const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

document.addEventListener('DOMContentLoaded', function () {

    //fungsi generate id random
    function generateId() {
        return +new Date();
    }

    //fungsi tambah list
    function addTodo() {
        const textTodo = document.getElementById('title').value;
        const timestamp = document.getElementById('date').value;
        const description = document.getElementById('description').value;
    
        const generatedID = generateId();
        const todoObject = generateTodoObject(generatedID, textTodo, timestamp, description, false);
        todos.push(todoObject);
    
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
    
    //fungsi menyimpan inputan menjadi object
    function generateTodoObject(id, task, timestamp, description, isCompleted) {
        return {
            id,
            task,
            timestamp,
            description,
            isCompleted
        }
    }
    
    //fungsi membuat bagian container todolist
    function makeTodo(todoObject) {
        const textTitle = document.createElement('h2');
        textTitle.innerText = todoObject.task;
    
        const textTimestamp = document.createElement('p');
        textTimestamp.innerText = todoObject.timestamp;
    
        const textContainer = document.createElement('div');
        textContainer.classList.add('inner');
        textContainer.append(textTitle, textTimestamp);
    
        const container = document.createElement('div');
        container.classList.add('item', 'shadow');
        container.append(textContainer);
        container.setAttribute('id', `todo-${todoObject.id}`);
    
        if (todoObject.isCompleted) {
            const undoButton = document.createElement('button');
            undoButton.classList.add('undo-button');
        
            undoButton.addEventListener('click', function () {
                undoTaskFromCompleted(todoObject.id);
            });
        
            const trashButton = document.createElement('button');
            trashButton.classList.add('trash-button');
        
            trashButton.addEventListener('click', function () {
                removeTaskFromCompleted(todoObject.id);
            });
    
            container.append(undoButton, trashButton);
        } else {
            const checkButton = document.createElement('button');
            checkButton.classList.add('check-button');
            
            checkButton.addEventListener('click', function () {
                addTaskToCompleted(todoObject.id);
            });
            
            container.append(checkButton);
        }
    
        return container;
    }
    
    //fungsi untuk tombol complete to do list
    function addTaskToCompleted (todoId) {
        const todoTarget = findTodo(todoId);
    
        if (todoTarget == null) return;
    
        todoTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
    
    //fungsi hapus to do list
    function removeTaskFromCompleted(todoId) {
        const todoTarget = findTodoIndex(todoId);
    
        if (todoTarget === -1) return;
    
        todos.splice(todoTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
    
    // fungsi undo to dolist menjadi belum dikerjakan
    function undoTaskFromCompleted(todoId) {
        const todoTarget = findTodo(todoId);
    
        if (todoTarget == null) return;
    
        todoTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
    
    //fungsi mencari todo
    function findTodo(todoId) {
        for (const todoItem of todos) {
            if (todoItem.id === todoId) {
                return todoItem;
            }
        }
        return null;
    }
    
    //sama mencari todo
    function findTodoIndex(todoId) {
        for (const index in todos) {
            if (todos[index].id === todoId) {
                return index;
            }
        }
    
        return -1;
    }
    
    //fungsi unutk mengecek apakah browser bisa unutk sistem storage web
    function isStorageExist() /* boolean */ {
        if (typeof (Storage) === undefined) {
            alert('Browser kamu tidak mendukung local storage');
            return false;
        }
        return true;
    }
    
    //untuk save data ke storage
    function saveData() {
        if (isStorageExist()) {
            const parsed = JSON.stringify(todos);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }
    
    //fungsi untuk mmenampilkan data
    function loadDataFromStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);
    
        if (data !== null) {
            for (const todo of data) {
                todos.push(todo);
            }
        }
    
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addTodo();
    });

    document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
    // console.log(todos);

    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';

    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';

    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted) {
            uncompletedTODOList.append(todoElement);
        }else{
            completedTODOList.append(todoElement);
        }
    }
});

if (isStorageExist()) {
    loadDataFromStorage();
}

});


