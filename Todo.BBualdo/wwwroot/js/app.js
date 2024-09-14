const inputAddTask = document.getElementById("input-add-task");

const url = "todos";
let todos = [];

fetchTodos();

function fetchTodos() {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            todos = data
            renderTodos();
        })
}

function renderTodos() {
    const todosContainer = document.querySelector(".todo-list-container");
    todosContainer.innerHTML = "";
    todos.forEach(todo => {
        const html = `
      <div class="todo-list ${
            todo.isCompleted ? "completed" : ""
        }" data-task-id="${todo.id}">
        <input onclick="toggleTodo(${todo.id})" name="completed" class="checkbox" type="checkbox" ${
            todo.isCompleted ? "checked" : ""
        }>
        <div class="todo-content">
          <p>${todo.title}</p>
          <button onclick="deleteTodo(${todo.id})" class="delete-button"></button>
        </div>
      </div>
    `
        todosContainer.innerHTML += html;
    })
}

function addTodo(title) {
    if (title === "") {
        alert("Todo title can't be empty!")
        return;
    }

    const todo = {title, isCompleted: false};
    fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todo)
    }).then(() => fetchTodos());
}

function toggleTodo(id) {
    fetch(`${url}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(() => fetchTodos())
}

function deleteTodo(id) {
    fetch(`${url}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(() => fetchTodos())
}

function clearCompleted() {
    fetch(`${url}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(() => fetchTodos())
}

inputAddTask.addEventListener("keydown", (e) => {
    console.log("Click")
    const title = inputAddTask.value.trim();
    if (e.key === "Enter") {
        addTodo(title);
        inputAddTask.value = "";
    }
});