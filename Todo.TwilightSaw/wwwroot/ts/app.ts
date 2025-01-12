import { Todo } from "./Todo.js";

async function fetchTodos(): Promise<void> {
    const response = await fetch('/todoLists');
    const todo: Todo[] = await response.json();

    const list = document.getElementById('todoList')!;
    if (list) {
        list.innerHTML = '';
        todo.forEach((todo : Todo) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${todo.name} - ${todo.isCompleted ? 'Completed' : 'Not completed'}`;
            list.appendChild(listItem);
        });
    }
 }
window.onload = fetchTodos;
