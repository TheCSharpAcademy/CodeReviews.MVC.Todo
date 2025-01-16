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
            listItem.innerHTML = `<label class="custom-checkbox">
                <input type="checkbox" ${todo.isCompleted ? "checked" : ""} data-id="${todo.id}">
                <span class="checkmark"></span>
                ${todo.name}
            </label>
            <img src="addButton.PNG" class="delete-icon" data-id="${todo.id}">`;
            switchCheckbox(listItem);

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
        });
    }
}

async function createTodo(): Promise<void> {
    const todoNameInput = document.getElementById(
        "todoName"
    ) as HTMLInputElement;
    const todoList = document.getElementById("todoList");

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

        await fetchTodos;
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

async function deleteTodo(): Promise<void> {
    const todoNameInput = document.getElementById(
        "todoName"
    ) as HTMLInputElement;
    const todoList = document.getElementById("todoList");

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

        
    } catch (error) {
        console.error("Error:", error);
    }
    todoNameInput.value = "";
}

window.onload = fetchTodos;
document.getElementById("addTodoBtn")?.addEventListener("click", createTodo);
