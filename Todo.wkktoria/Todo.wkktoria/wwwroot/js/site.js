const uri = 'api/TodoItems';
let todos = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    const addNameTextBox = document.getElementById('add-name');
    const itemName = addNameTextBox.value.trim();
    const validationText = document.getElementById('add-validator');

    if (!itemName || itemName.length === 0) {
        validationText.style.display = 'inline';
        validationText.innerText = 'Name cannot be empty.';
        return;
    } else {
        validationText.style.display = 'none';
        validationText.innerText = '';
    }

    const item = {
        name: itemName,
        isComplete: false
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
            addNameTextBox.value = '';
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

    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const itemName = document.getElementById('edit-name').value.trim();
    const validationText = document.getElementById('edit-validator');

    if (!itemName) {
        validationText.style.display = 'inline';
        validationText.innerText = 'Name cannot be empty.';
        return;
    } else {
        validationText.style.display = 'none';
        validationText.innerText = '';
    }

    const item = {
        id: parseInt(itemId, 10),
        name: document.getElementById('edit-name').value.trim(),
        isComplete: document.getElementById('edit-isComplete').checked,
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
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('edit-validator').style.display = 'none';
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
        let isCompleteIcon = document.createElement('i');
        isCompleteIcon.classList.add('bi');
        if (item.isComplete) {
            isCompleteIcon.classList.add('bi-check');
        } else {
            isCompleteIcon.classList.add('bi-x');
        }

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.classList.add('btn');
        editButton.classList.add('btn-info');
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.classList.add('btn');
        deleteButton.classList.add('btn-danger');
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteIcon);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(3);
        td4.appendChild(deleteButton);
    });

    todos = data;
}