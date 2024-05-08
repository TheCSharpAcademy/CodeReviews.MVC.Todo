// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

document.addEventListener('DOMContentLoaded', function () {
    console.log("HEY");

    fetchTodos();

    document.getElementById('addTodo').addEventListener('click', function () {
        addTodo();
    })
})

function fetchTodos() {
    fetch('/todoitems')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('todoList');
            list.innerHTML = '';
            data.forEach(todo => {
                const item = document.createElement('div');
                item.textContent = todo.name;
                list.appendChild(item);
            });
        })
        .catch(error => console.error('Unable to get items.', error));
}


function addTodo() {
    const todo = { title: 'New Todo', isComplete: false }; // Simplified example

    fetch('/todoitems', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    })
        .then(response => response.json())
        .then(() => {
            fetchTodos(); // Reload the list after adding
        })
        .catch(error => console.error('Unable to add item.', error));
}