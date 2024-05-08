// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

fetchTodos();

function fetchTodos() {
    fetch('/todoitems')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('todoList');
            list.innerHTML = ''; // Clear existing todos
            data.forEach(todo => {
                const item = document.createElement('div');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.isComplete;
                checkbox.onchange = () => toggleComplete(todo.id, checkbox.checked);

                const name = document.createTextNode(todo.name);
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.onclick = () => showEditForm(todo);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => showDeleteModal(todo.id);

                item.appendChild(checkbox);
                item.appendChild(name);
                item.appendChild(editButton);
                item.appendChild(deleteButton);
                list.appendChild(item);
            });
        })
        .catch(error => console.error('Unable to get items.', error));
}

function showEditForm(todo) {
    document.getElementById('edit-id').value = todo.id;
    document.getElementById('edit-title').value = todo.name;
    document.getElementById('edit-isComplete').checked = todo.isComplete;
    document.getElementById('editForm').style.display = 'block';
}

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
                closeInput();
            } else {
                console.error('Failed to update item.');
            }
        })
        .catch(error => console.error('Unable to update item.', error));
}

function showDeleteModal(todoId) {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'block';

    // Pass the todoId to confirmDelete
    modal.querySelector('button[onclick="confirmDelete()"]').onclick = function () {
        confirmDelete(todoId);
    };
}

function confirmDelete(id) {
    fetch(`/todoitems/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                fetchTodos(); // Fetch the updated list
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

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function toggleAddForm() {
    const form = document.getElementById('addTodoForm');
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');

    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim()
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


/*const uri = '/todoitems';
let todos = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');

    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim()
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim()
    };

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isComplete;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });

    todos = data;
}*/