
fetchTodos();

function fetchTodos() {
    fetch('/todoitems')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('todoList');
            list.innerHTML = ''; // Clear existing todos
            data.forEach(todo => {
                const item = document.createElement('div');
                item.className = 'todo-item';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.isComplete;
                checkbox.checked = todo.isComplete;
                checkbox.onchange = () => toggleComplete(todo.id, todo.name, checkbox.checked);


                const name = document.createElement('span');
                name.textContent = todo.name;
                name.className = 'todo-name';

                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'button-container';

                const editButton = document.createElement('button');
                editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>'
                editButton.onclick = () => showEditForm(todo);
                editButton.className = 'btn btn-light btn-sm';

                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>'
                deleteButton.onclick = () => showDeleteModal(todo);
                editButton.className = 'btn btn-light btn-sm';

                buttonContainer.appendChild(checkbox);
                buttonContainer.appendChild(editButton);
                buttonContainer.appendChild(deleteButton);

                item.appendChild(name);
                item.appendChild(buttonContainer);

                list.appendChild(item);
            });
        })
        .catch(error => console.error('Unable to get items.', error));
}

function toggleComplete(id, name, isComplete) {
    const updatedTodo = {
        id: id,
        name: name,
        isComplete: isComplete,
    };

    fetch(`/todoitems/${id}`, {
        method: 'Put', // If your API supports PATCH; otherwise, use PUT with all fields
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTodo)
    })
        .then(response => {
            if (response.ok) {
                fetchTodos();
            } else {
                console.error('Failed to update item.');
            }
        })
        .catch(error => console.error('Unable to update item.', error));
}

function showDeleteModal(todo) {
    const modal = document.getElementById('deleteModal');
    const prompt = document.querySelector('.modal-prompt');
    prompt.textContent = `Delete task "${todo.name}"?`;
    modal.style.display = 'block';

    modal.querySelector('button[onclick="confirmDelete()"]').onclick = function () {
        confirmDelete(todo.id);
    };
}

function confirmDelete(id) {
    fetch(`/todoitems/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                fetchTodos(); 
            } else {
                console.error('Failed to delete item.');
            }
        })
        .catch(error => console.error('Unable to delete item.', error));

    closeModal();
}

function closeModal() {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'none';
}

// Functions for editing
function updateItem() {
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-title').value;
    const isComplete = document.getElementById('edit-isComplete').checked;

    const updatedTodo = { id, name, isComplete };

    fetch(`/todoitems/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTodo)
    })
        .then(response => {
            if (response.ok) {
                fetchTodos();
                closeEditInput();
            } else {
                console.error('Failed to update item.');
            }
        })
        .catch(error => console.error('Unable to update item.', error));
}

function showEditForm(todo) {
    cancelAddTodo();
    document.getElementById('edit-id').value = todo.id;
    document.getElementById('edit-title').value = todo.name;
    document.getElementById('edit-isComplete').checked = todo.isComplete;
    document.getElementById('editForm').style.display = 'block';
}

function closeEditInput() {
    document.getElementById('editForm').style.display = 'none';
}

// Functions for adding todos
function addItem() {
    const addNameTextbox = document.getElementById('add-name');
    const isComplete = document.getElementById('add-isComplete').checked;

    const item = {
        name: addNameTextbox.value.trim(),
        isComplete: isComplete,
    };

    fetch('/todoitems', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            fetchTodos();
            addNameTextbox.value = '';
            toggleAddForm(); // Optionally close the form after adding
        })
        .catch(error => console.error('Unable to add item.', error));
}

function toggleAddForm() {
    closeEditInput();
    const form = document.getElementById('addTodoForm');
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

function cancelAddTodo() {
    const form = document.getElementById('addTodoForm');
    form.style.display = 'none'; // Hide the form
    document.getElementById('add-name').value = ''; // Optionally clear the input field
    document.getElementById('add-isComplete').checked = false; // Optionally uncheck the box
}
