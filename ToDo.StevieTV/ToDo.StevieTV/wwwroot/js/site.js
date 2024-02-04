const uri = 'todoitems';
let todos = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error("Unable to get items.", error));
}

function addItem() {
    const addNameTextBox = document.getElementById('add-name');

    if (addNameTextBox.value === "") {
        console.error("Cannot add an empty task")
        return;
    }    
    
    const item = {
        isComplete: false,
        name: addNameTextBox.value.trim()
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
        .catch(error => console.error('Unable to add item', error));
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item', error));
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

    if (document.getElementById('edit-name').value === "") {
        console.error("Cannot change task name to be empty")
        return;
    }

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
        .catch(error => console.error("Unable to update item.", error));
    
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
        editButton.setAttribute('class', 'btn btn-primary');

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);
        deleteButton.setAttribute('class', 'btn btn-danger')
        
        let buttonGroup = document.createElement('div');
        buttonGroup.setAttribute('class', 'btn-group');
        buttonGroup.setAttribute('role', 'group');
        buttonGroup.append(...[editButton, deleteButton]);
        
        let tr = tBody.insertRow();

        let td1 = document.createElement('th');
        td1.setAttribute('scope', 'row');
        td1.appendChild(isCompleteCheckbox);
        tr.appendChild(td1);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode)

        let td3 = tr.insertCell(2);
        td3.appendChild(buttonGroup);
    });

    todos = data;
}