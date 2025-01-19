import { Todo } from "./Todo.js";

async function fetchTodos(): Promise<void> {
    const response = await fetch("/todoLists");
    const todo: Todo[] = await response.json();

    const list = document.getElementById("todoList")!;
    if (list) {
        list.innerHTML = "";
        todo.forEach((todo: Todo) => {
            const listItem = document.createElement("div");
            listItem.classList.add("block");

            list.appendChild(listItem);
            listItem.innerHTML = `
    <label class="custom-checkbox" id="myDiv">
        <input 
            type="checkbox" 
            class="hidden-checkbox" 
            ${todo.isCompleted ? "checked" : ""} 
            data-id="${todo.id}">
        <span class="todo-text ${todo.isCompleted ? "completed" : ""}">
            ${todo.name}
        </span>
    </label>
    <div id="contextMenu" class="context-menu">
    <ul>
        <li>Редагувати</li>
        <li>Видалити</li>
    </ul>
    </div>
   <div class="delete-block"> <img src="delete-button.png" class="delete-icon" data-id="${todo.id}"></div>
`;
            switchCheckbox(listItem);
            deleteTodo(listItem);
        });
        const listItem = document.createElement("div");
        listItem.classList.add("todoAdd");
        listItem.id = "todoContainer";
        list.appendChild(listItem);
        listItem.innerHTML = `
            
            <input type="text" id = "todoName" placeholder = "" >
            <img src="create-button.PNG" id = "addTodoBtn" >  
`
        document.getElementById("addTodoBtn")?.addEventListener("click", createTodo);
    }
}


async function createTodo(): Promise<void> {
    const todoNameInput = document.getElementById(
        "todoName"
    ) as HTMLInputElement;

    const todoName = todoNameInput.value.trim();

    if (todoName === "") {
        alert("Please, fill all fields!");
        return;
    }

    const newTodo: Todo = {
        name: todoName,
        isCompleted: false,
    };

    try {
        const response = await fetch("/todoList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTodo),
        });

        if (!response.ok) {
            throw new Error("Failed to add a new task");
        }
        await fetchTodos();
    } catch (error) {
        console.error("Error:", error);
    }
    todoNameInput.value = "";
}

async function switchCheckbox(listItem: HTMLElement): Promise<void> {
    const checkbox = listItem.querySelector('input[type="checkbox"]');
    checkbox?.addEventListener("change", async (event) => {
        const target = event.target as HTMLInputElement;
        const isChecked = target.checked;
        const todoId = target.getAttribute("data-id");

        try {
            await fetch(`/todoList/${todoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: todoId,
                    isCompleted: isChecked,
                    name: target.closest("label")?.textContent?.trim() || "",
                }),
            });
            console.log(`Task ${todoId} done!`);
        } catch (error) {
            console.error("Task error:", error);
        }
    });
}

async function deleteTodo(listItem: HTMLElement): Promise<void> {
    const deleteBtn = listItem.querySelector(".delete-icon");
    deleteBtn?.addEventListener("click", async () => {
        const todoId = deleteBtn.getAttribute("data-id");

        try {
            await fetch(`/todoList/${todoId}`, {
                method: "DELETE",
            });
            listItem.remove(); // Видаляємо елемент із DOM
            console.log(`Задача ${todoId} видалена`);
        } catch (error) {
            console.error("Помилка при видаленні задачі:", error);
        }
    });
}

window.onload = fetchTodos;
document.getElementById("addTodoBtn")?.addEventListener("click", createTodo);


document.addEventListener("DOMContentLoaded", () => {
    const myDiv = document.getElementById("myDiv");
    const contextMenu = document.getElementById("contextMenu");

    // Показ контекстного меню
    myDiv?.addEventListener("contextmenu", (event) => {
        event.preventDefault(); // Вимкнути стандартне контекстне меню

        // Встановлення позиції меню
        if (contextMenu) {
            contextMenu.style.display = "block";
            contextMenu.style.left = `${event.pageX}px`;
            contextMenu.style.top = `${event.pageY}px`;
        }
    });

    // Ховати контекстне меню при кліку поза ним
    document.addEventListener("click", () => {
        if (contextMenu) {
            contextMenu.style.display = "none";
        }
    });
});