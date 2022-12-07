const uri = 'api/todos';
const createButton = document.getElementById('create-todo');
let todos = [];
let buttonClicked = false;

createButton.addEventListener('click', () => {
    const form = document.getElementById('add-form');

    if (form.style.display === 'none') {
        console.log('Show');
        // 👇️ this SHOWS the form
        form.style.display = 'block';
    } else {
        // 👇️ this HIDES the form
        form.style.display = 'none';
    }
});


//Get all items
function GetAllTodos() {
    console.log('GetAllTodos');
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

//Add item
function AddTodoItem() {

    const addTitleTextbox = document.getElementById('add-title');
    const addDueDate = document.getElementById('add-dueDate');

    // Creates new Todo Object from form data
    //
    const todo = {
        Title: addTitleTextbox.value.trim(),
        DueDate: addDueDate.value,
        IsDone: false
    }

    // Sends POST request to API
    //
    fetch(uri + '/create', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    })
        .then(() => {
            // Resets form data
            //
            addTitleTextbox.value = '';
            addDueDate.value = '';
            document.getElementById('add-form').style.display = 'none';
            GetAllTodos();
        }).catch(error => console.error('Unable to add todo.', error));

    GetAllTodos();
}


function DeleteTodoItem(id) {
    fetch(`${uri}/delete/${id}`, {
        method: 'DELETE'
    })
        .then(() => GetAllTodos())
        .catch(error => console.error('Unable to delete todo.', error));
}

function GetEditTodoById(id) {
    let todo = todos.find(todo => todo.id === id);
    console.log(todo);
    if (todo != null) {
        _displayItems(todos, id);
    }
};

const _displayItems = function (data, id) {

    const tBody = document.getElementById('todos');
    const button = document.createElement('button');
    let editId = document.getElementById('editTrue');
    let itemNum = 0;


    // Resets innerHTML of tBody for new data
    //
    tBody.innerHTML = '';

    //Iterate through data array of todos
    //
    data.forEach(item => {
        buttonClicked = false;

        // Check if id is equal to current item id
        // Displays edit form if true
        //
        if (id == item.id) {
            console.log("editItem = " + item.id);
            _displayEditForm(item);
            document.querySelector('.editInput').focus();

        } else {

            // Creates checkbox input
            //
            let isDoneCheck = document.createElement('input');
            isDoneCheck.type = 'checkbox';
            isDoneCheck.disabled = true;
            isDoneCheck.checked = item.isDone;

            // Creates edit button
            //
            let editButton = button.cloneNode(false);
            editButton.classList.add('editButton', 'todoButton');
            editButton.setAttribute('onclick', `GetEditTodoById(${item.id})`);

            // Creates delete button
            //
            let deleteButton = button.cloneNode(false);
            deleteButton.classList.add('deleteButton', "todoButton");
            deleteButton.setAttribute('onclick', `DeleteTodoItem(${item.id})`);

            // Creates table row
            //
            let tr = tBody.insertRow();
            tr.classList.add("bodyRow", itemNum);

            // Creates first cell
            //
            let td1 = tr.insertCell(0);
            td1.appendChild(isDoneCheck);
            let textDiv = document.createElement('div')
            textDiv.appendChild(document.createTextNode(item.title));
            textDiv.className = "title";
            td1.appendChild(textDiv);

            // Creates second cell
            //
            let td2 = tr.insertCell(1);
            td2.className = "buttonCell";
            td2.appendChild(editButton);
            td2.appendChild(deleteButton);
        }
    });
    todos = data;
}


//displays edit form
const _displayEditForm = function (todo) {
    let tBody = document.getElementById('todos');

    // Creates checkbox input
    //
    let isDoneCheck = document.createElement('input');
    isDoneCheck.type = 'checkbox';
    isDoneCheck.disabled = true;
    isDoneCheck.checked = todo.isDone;

    // Creates Confirm button
    //
    let confirmButton = document.createElement('button');
    confirmButton.type = 'submit';
    confirmButton.classList.add('confirmButton');

    // Creates edit input
    let titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'editInput';
    titleInput.value = todo.title;

    // Gets form data and sends PUT request to API
    //
    confirmButton.addEventListener('mousedown', () => {
        todo = {
            id: todo.id,
            title: document.querySelector('input.editInput').value.trim(),
            isDone: todo.isDone,
            DueDate: todo.dueDate,
            createdDate: todo.createdDate,
        }

        fetch(`${uri}/edit/${todo.id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        })
            .then(() => {
                document.getElementById('editTrue').remove();
                GetAllTodos();
            })

        buttonClicked = true;
    })

    // adds blur event listener to input
    // removes edit form if input is blurred AND confirm button is not clicked
    titleInput.addEventListener('blur', () => {
        if (buttonClicked == false) {
            document.getElementById('editTrue').remove();
            _displayItems(todos, -1);
        }
    });

    let tr = tBody.insertRow();
    tr.setAttribute('id', 'editTrue');

    let td1 = tr.insertCell(0);
    td1.appendChild(isDoneCheck);
    td1.appendChild(titleInput);

    let td2 = tr.insertCell(1);
    td2.appendChild(confirmButton);
}
