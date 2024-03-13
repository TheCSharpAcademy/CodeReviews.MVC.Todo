const uri = 'api/Todo';
let todos = []

function getItems() {
     fetch(uri)
        .then(response => response.json())
        .then(data => displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}


function addItem() {
    const todoName = document.getElementById('addTaskNameField');

    const todoItem = {
        Name: todoName.value.trim(),
        IsCompleted: false
    };
   
    fetch(uri, {
       
        method: 'post',
        headers: {
           'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoItem)
    })
        .then(() => {
            todoName.value = '';
            getItems();
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'delete'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function updateItem(formid,itemid) {
    const isCompleted = document.getElementById('checkbox' + formid).checked;

    const item = {
        Id: itemid,
        Name: document.getElementById('taskfield'+formid).value.trim(),
        IsCompleted: isCompleted
    };

    fetch(`${uri}/${itemid}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

   }


function displayItems(data) {
    const listUl = document.getElementById('todolist');
    listUl.innerHTML = '';

    const newListItem = document.createElement('li');
    newListItem.classList.add('list-group-item');
    listUl.appendChild(newListItem);

    
    let id = 0;

    data.forEach(item => {
        const newInputGroup = document.createElement('div');
        newInputGroup.classList.add('input-group', 'mb-3','flex-nowrap','justify-content-left');

        const newInputGroupText = document.createElement('div');
        newInputGroupText.classList.add('input-group-text');
        newInputGroup.width='fit-content'

        newListItem.appendChild(newInputGroup);
        newInputGroup.appendChild(newInputGroupText);

        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.id = 'checkbox' + id;
        isCompleteCheckbox.classList.add('form-check-input');
        isCompleteCheckbox.ariaLabel = "Is completed";
        isCompleteCheckbox.checked = item.isCompleted;

        newInputGroupText.appendChild(isCompleteCheckbox);

        let taskNameField = document.createElement('input');
        taskNameField.type = 'text';
        taskNameField.classList.add("form-control","d-inline","m-2");
        taskNameField.ariaLabel = "Task input";
        taskNameField.display = 'inline';
        taskNameField.id = 'taskfield'+id;
        taskNameField.value = item.name;
        newInputGroupText.appendChild(taskNameField);
        
        let editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.classList.add("btn","btn-outline-secondary","bi","bi-pen","m-2");
        editButton.setAttribute('onclick', `updateItem(${id},${item.id})`);
        newInputGroupText.appendChild(editButton);

        let deleteButton = document.createElement('button');
        deleteButton.classList.add("btn", "btn-outline-danger", "bi", "bi-eraser");
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);
        newInputGroupText.appendChild(deleteButton);


        id++;
    });

    todos = data;
}