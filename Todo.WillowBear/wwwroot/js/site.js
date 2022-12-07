const uri = 'api/todos';
const createButton = document.getElementById('create-todo');
let todos = [];

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

    const todo = {
        Title: addTitleTextbox.value.trim(),
        DueDate: addDueDate.value,
        IsDone: false
    }

    fetch(uri + '/create', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    })

        .then(() => {
            addTitleTextbox.value = '';
            addDueDate.value = '';
            document.getElementById('add-form').style.display = 'none';
            GetAllTodos();
        }).catch(error => console.error('Unable to add todo.', error));

    GetAllTodos();
}

//Delete item
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


//displays items

const _displayItems = function (data, id) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';
    console.log(data);
    let itemNum = 0;
    const button = document.createElement('button');
    let editId = document.getElementById('editTrue');
    data.forEach(item => {

        if (id == item.id) {
            console.log("editItem = " + item.id);
            _displayEditForm(item);
            document.querySelector('.editInput').focus();

        } else {

            let isDoneCheck = document.createElement('input');
            isDoneCheck.type = 'checkbox';
            isDoneCheck.disabled = true;
            isDoneCheck.checked = item.isDone;

            let editButton = button.cloneNode(false);
            editButton.classList.add('editButton', 'todoButton');
            editButton.setAttribute('onclick', `GetEditTodoById(${item.id})`);

            let deleteButton = button.cloneNode(false);
            deleteButton.classList.add('deleteButton', "todoButton");
            deleteButton.setAttribute('onclick', `DeleteTodoItem(${item.id})`);


            let tr = tBody.insertRow();
            tr.classList.add("bodyRow", itemNum);

            let td1 = tr.insertCell(0);
            td1.appendChild(isDoneCheck);
            let textDiv = document.createElement('div')
            textDiv.appendChild(document.createTextNode(item.title));
            textDiv.className = "title";
            td1.appendChild(textDiv);

            let td3 = tr.insertCell(1);
            td3.className = "buttonCell";
            td3.appendChild(editButton);
            td3.appendChild(deleteButton);
        }
    }

    );
    todos = data;
}


//displays edit form
const _displayEditForm = function (todo) {
    let tBody = document.getElementById('todos');
    console.log("displaying edit form")
    let isDoneCheck = document.createElement('input');
    isDoneCheck.type = 'checkbox';
    isDoneCheck.disabled = true;
    isDoneCheck.checked = todo.isDone;

    let titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'editInput';
    titleInput.value = todo.title;


    let confirmButton = document.createElement('button');
    confirmButton.type = 'submit';
    confirmButton.classList.add('confirmButton');
    confirmButton.addEventListener('click', () => {
        todo = {
            id: todo.id,
            title: document.querySelector('input.editInput').value.trim(),
            isDone: todo.isDone,
            DueDate: todo.dueDate,
            createdDate: todo.createdDate,
        }
        console.log("edited" + todo);
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
    })

    if (document.activeElement !== document.querySelector('.editInput')) {
        removeEditFocus();
    }


    let tr = tBody.insertRow();
    tr.setAttribute('id', 'editTrue');

    let td1 = tr.insertCell(0);
    td1.appendChild(isDoneCheck);
    td1.appendChild(titleInput);

    let td2 = tr.insertCell(1);
    td2.appendChild(confirmButton);


}

let removeEditFocus = function () {
    if (document.querySelector('.editInput')) {
        document.querySelector('.editInput').addEventListener('focusout', function () {
            document.querySelector('.editInput').classList.remove('editInput');
            _displayItems(todos, -1)
        }
        )
    }

}
