import { Todo } from "./Todo.js";

async function fetchTodos(): Promise<void> {
    const response = await fetch('/todoLists');
    const todo: Todo[] = await response.json();

    const list = document.getElementById('todoList')!;
    if (list) {
        list.innerHTML = '';
        todo.forEach((todo : Todo) => {
            const listItem = document.createElement("div");
            listItem.classList.add('block');
            listItem.textContent = `${todo.name} - ${todo.isCompleted ? 'Completed' : 'Not completed'}`;
            list.appendChild(listItem);
        });
    }
}

async function createTodo(): Promise<void> {
    const todoNameInput = document.getElementById('todoName') as HTMLInputElement;
    const todoComepleteInput = document.getElementById('todoComplete') as HTMLInputElement;
    const todoList = document.getElementById('todoList');

    const todoName = todoNameInput.value.trim();
    const todoComplete = todoComepleteInput.checked;

    if (todoName === '') {
        alert('Будь ласка, заповніть всі поля!');
        return;
    }

    const newTodo: Todo = {
        name: todoName,
        isCompleted: todoComplete
    };

    try {
        const response = await fetch('/todoList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTodo),
        });

        fetchTodos;
    } catch (error) {
        console.error("Error:", error);
    }

    todoNameInput.value = "";
    todoComepleteInput.checked = false;
}

window.onload = fetchTodos;
document.getElementById('addTodoBtn')?.addEventListener('click', createTodo);

