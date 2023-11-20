function getTodos() {

    fetch('api/todoItems')
        .then(response => response.json())
        .then(data => displayItems(data));
}

function displayItems(data) {
    const body = document.getElementById('body');
    body.innerHTML = '';

    for (var i = 0; i < data.length; i++) {
        const { id, name, isComplete } = data[i];
        let tr = document.createElement('tr');
        let tdName = document.createElement('td');
        let tdIsComplete = document.createElement('td');
        let tdButtons = document.createElement('td');

        let editButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        tr.setAttribute('data-id', id);

        editButton.textContent = 'Edit';
        editButton.classList.add('btn');
        editButton.classList.add('btn-info');
        editButton.addEventListener('click', () => {
            displayEditForm(id, name, isComplete);
        });

        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('btn');
        deleteButton.classList.add('btn-danger');
        deleteButton.style.marginLeft = "20px";

        deleteButton.addEventListener('click', () => {
            deleteTodo(tr.dataset.id);
        });

        tdName.textContent = name;
        tdIsComplete.textContent = isComplete;

        tdButtons.appendChild(editButton);
        tdButtons.appendChild(deleteButton);

        tr.appendChild(tdName);
        tr.appendChild(tdIsComplete);
        tr.appendChild(tdButtons);

        body.appendChild(tr);
    }
}

function addTodo() {
    const todoName = document.getElementById('todoName');
    const todoIsComplete = document.getElementById('todoIsComplete');

    const newTodo = {
        name: todoName.value,
        isComplete: todoIsComplete.checked
    }

    fetch('api/todoItems', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo)
    })
        .then(response => response.json())
        .then(() => getTodos())
        .catch(error => console.error('Error:', error));

    todoName.value = '';
    todoIsComplete.checked = false;
}

function displayEditForm(id, name, isComplete) {
    const h2 = document.createElement('h2');
    const editForm = document.getElementById('editForm');
    const divNameInput = document.createElement('div');
    const divIsCompleteInput = document.createElement('div');
    const nameInput = document.createElement('input');
    const isCompleteInput = document.createElement('input');
    const submitButton = document.createElement('button');
    const cancelButton = document.createElement('button');
    const todoLabel = document.createElement('label');
    const isCompleteLabel = document.createElement('label');

    editForm.innerHTML = '';
    editForm.style.display = 'block';
    editForm.classList.add('px-2');

    h2.textContent = "Edit Todo";
    h2.classList.add('mt-2');

    divNameInput.classList.add('form-group');
    divNameInput.classList.add('mt-2');

    todoLabel.textContent = 'Todo';
    todoLabel.style.display = 'block';

    isCompleteLabel.textContent = 'Is Complete';

    nameInput.type = 'text';
    nameInput.value = name;

    divIsCompleteInput.classList.add('form-group');
    divIsCompleteInput.classList.add('mt-2');

    isCompleteInput.type = 'checkbox';
    isCompleteInput.checked = isComplete;
    isCompleteInput.style.marginLeft = '6px';

    cancelButton.classList.add('btn');
    cancelButton.classList.add('btn-info');
    cancelButton.classList.add('mt-2');
    cancelButton.type = 'button';
    cancelButton.addEventListener('click', () => {
        closeEditForm();
    });
    cancelButton.textContent = 'Cancel';

    submitButton.classList.add('btn');
    submitButton.classList.add('btn-primary');
    submitButton.classList.add('mt-2');
    submitButton.style.marginLeft = '6px';

    submitButton.type = 'submit';
    submitButton.addEventListener('click', () => {
        editTodo(id, nameInput.value, isCompleteInput.checked);
        closeEditForm();

    });
    submitButton.textContent = 'Submit';



    divNameInput.appendChild(todoLabel);
    divNameInput.appendChild(nameInput);
    divIsCompleteInput.appendChild(isCompleteLabel);
    divIsCompleteInput.appendChild(isCompleteInput);

    editForm.appendChild(h2);
    editForm.appendChild(divNameInput);
    editForm.appendChild(divIsCompleteInput);
    editForm.appendChild(cancelButton);
    editForm.appendChild(submitButton);
}
function editTodo(id, todoName, todoIsComplete) {

    const updateTodo = {
        id: id,
        name: todoName,
        isComplete: todoIsComplete
    }

    fetch(`api/todoItems/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateTodo)
    })
        .then(() => getTodos())
        .catch(error => console.error('Error', error));
}

function closeDeleteModal() {
    const deleteModal = document.querySelector('.modal');
    deleteModal.style.display = 'none';

}

function closeEditForm() {
    const editForm = document.getElementById('editForm');
    editForm.innerHTML = '';
}

function deleteTodo(id) {
    let confirmDelete = window.confirm('Are you sure you want to delete?');

    if (confirmDelete === true) {

        fetch(`api/todoItems/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },

        })
            .then(() => getTodos())
            .catch(error => console.error(error));
    }
}