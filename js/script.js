const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

document.addEventListener('DOMContentLoaded', function () {

    // Fungsi untuk menambah todo baru
    function addToDoList() {
        const textTodo = document.getElementById('title').value;
        const timestamp = document.getElementById('date').value;
        const description = document.getElementById('description').value;

        // Validasi input
        if (textTodo === '' || timestamp === '') {
            alert('Judul dan tanggal harus diisi!');
            return;
        }

        const generatedID = +new Date();
        const todoObject = {
            id: generatedID,
            task: textTodo,
            timestamp: timestamp,
            description: description,
            isCompleted: false
        };
        
        todos.push(todoObject);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
        
        // Reset form
        document.getElementById('title').value = '';
        document.getElementById('date').value = '';
        document.getElementById('description').value = '';
        
        // Tutup modal
        document.getElementById('addTask').close();
        
        console.log(todos);
    }

    // Fungsi membuat elemen todo
    function makeTodo(todoObject) {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card', 'w-80', 'bg-base-100', 'card-lg', 'shadow-xl', 'grow-0', 'shrink-0');
        cardContainer.setAttribute('id', `todo-${todoObject.id}`);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Title
        const title = document.createElement('p');
        title.classList.add('font-medium', 'text-lg');
        title.innerText = todoObject.task;

        // Date
        const date = document.createElement('p');
        date.classList.add('font-normal', 'text-xs');
        date.innerText = formatDate(todoObject.timestamp);

        // HR
        const hr = document.createElement('hr');

        // Description label
        const descLabel = document.createElement('p');
        descLabel.classList.add('font-normal', 'text-sm');
        descLabel.innerText = 'description :';

        // Description content
        const descContent = document.createElement('p');
        descContent.classList.add('font-normal', 'text-base');
        descContent.innerText = todoObject.description || 'No description';

        // Actions container
        const actionsContainer = document.createElement('div');
        actionsContainer.classList.add('justify-end', 'card-actions');

        // Append elements
        cardBody.append(title, date, hr, descLabel, descContent, actionsContainer);
        cardContainer.append(cardBody);

        if (todoObject.isCompleted) {
            // Tombol untuk completed todos
            const trashButton = document.createElement('button');
            const trashImg = document.createElement('img');
            trashImg.src = '../assets/trash-fill.svg';
            trashImg.classList.add('h-8', 'w-8', 'cursor-pointer');
            trashButton.appendChild(trashImg);
            
            trashButton.addEventListener('click', function () {
                removeTaskFromCompleted(todoObject.id);
            });

            const undoButton = document.createElement('button');
            const undoImg = document.createElement('img');
            undoImg.src = '../assets/undo-ouline.svg';
            undoImg.classList.add('h-8', 'w-8', 'cursor-pointer');
            undoButton.appendChild(undoImg);
            
            undoButton.addEventListener('click', function () {
                undoTaskFromCompleted(todoObject.id);
            });

            actionsContainer.append(trashButton, undoButton);
        } else {
            // Tombol untuk ongoing todos
            const checkButton = document.createElement('button');
            const checkImg = document.createElement('img');
            checkImg.src = '../assets/check-solid.svg';
            checkImg.classList.add('h-8', 'w-8', 'cursor-pointer');
            checkButton.appendChild(checkImg);
            
            checkButton.addEventListener('click', function () {
                addTaskToCompleted(todoObject.id);
            });

            actionsContainer.append(checkButton);
        }

        return cardContainer;
    }

    // Fungsi untuk format tanggal
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('id-ID', options);
    }

    // Fungsi untuk menyelesaikan todo
    function addTaskToCompleted(todoId) {
        const todoTarget = findTodo(todoId);

        if (todoTarget == null) return;

        todoTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    // Fungsi untuk menghapus todo
    function removeTaskFromCompleted(todoId) {
        if (confirm('Apakah Anda yakin ingin menghapus todo ini?')) {
            const todoTarget = findTodoIndex(todoId);

            if (todoTarget === -1) return;

            todos.splice(todoTarget, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        }
    }

    // Fungsi untuk undo todo
    function undoTaskFromCompleted(todoId) {
        const todoTarget = findTodo(todoId);

        if (todoTarget == null) return;

        todoTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    // Fungsi mencari todo berdasarkan ID
    function findTodo(todoId) {
        for (const todoItem of todos) {
            if (todoItem.id === todoId) {
                return todoItem;
            }
        }
        return null;
    }

    // Fungsi mencari index todo berdasarkan ID
    function findTodoIndex(todoId) {
        for (const index in todos) {
            if (todos[index].id === todoId) {
                return index;
            }
        }
        return -1;
    }

    // Fungsi untuk mengecek apakah browser mendukung localStorage
    function isStorageExist() {
        if (typeof (Storage) === undefined) {
            alert('Browser kamu tidak mendukung local storage');
            return false;
        }
        return true;
    }

    // Fungsi untuk menyimpan data ke localStorage
    function saveData() {
        if (isStorageExist()) {
            const parsed = JSON.stringify(todos);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    // Fungsi untuk memuat data dari localStorage
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

    // Fungsi untuk update counter
    function updateCounter() {
        const ongoingCount = todos.filter(todo => !todo.isCompleted).length;
        const completedCount = todos.filter(todo => todo.isCompleted).length;
        
        // Update counter di UI (sesuaikan dengan ID di HTML)
        const ongoingCounter = document.getElementById('onProgres');
        const completedCounter = document.getElementById('Completed');
        
        if (ongoingCounter) {
            ongoingCounter.textContent = `(${ongoingCount})`;
        }
        if (completedCounter) {
            completedCounter.textContent = `(${completedCount})`;
        }
    }

    // Event listener untuk form submit
    const submitForm = document.getElementById('add-todo');
    if (submitForm) {
        submitForm.addEventListener('submit', function (event) {
            event.preventDefault();
            addToDoList();
        });
    }

    // Event listener untuk render todo
    document.addEventListener(RENDER_EVENT, function () {
        const uncompletedTODOList = document.getElementById('todos');
        const completedTODOList = document.getElementById('completed-todos');
        
        if (uncompletedTODOList) {
            uncompletedTODOList.innerHTML = '';
        }
        if (completedTODOList) {
            completedTODOList.innerHTML = '';
        }

        for (const todoItem of todos) {
            const todoElement = makeTodo(todoItem);
            if (!todoItem.isCompleted && uncompletedTODOList) {
                uncompletedTODOList.append(todoElement);
            } else if (todoItem.isCompleted && completedTODOList) {
                completedTODOList.append(todoElement);
            }
        }
        
        // Update counter setiap kali render
        updateCounter();
    });

    // Event listener untuk saved event
    document.addEventListener(SAVED_EVENT, function () {
        console.log('Data saved to localStorage:', localStorage.getItem(STORAGE_KEY));
    });

    // Load data saat halaman dimuat
    if (isStorageExist()) {
        loadDataFromStorage();
    }

});