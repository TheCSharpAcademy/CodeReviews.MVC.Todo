import { Todo } from "./Todo.js";

createContextMenu();

document.addEventListener("contextmenu", (event) => {
    const target = (event.target as HTMLElement).closest(".block");
    const contextMenu = document.getElementById("contextMenu");

    if (target && contextMenu) {
        event.preventDefault();


        document.querySelectorAll(".block.highlight").forEach((block) => {
            block.classList.remove("highlight");
        });
        target.classList.add("highlight");
        // Встановлення позиції меню
        contextMenu.style.display = "block";
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;

        // Зберігаємо ID цільового завдання у атрибуті меню
        const taskId = target.querySelector("input")?.getAttribute("data-id");
        contextMenu.setAttribute("data-target-id", taskId || "");
    }
});

document.addEventListener("click", (event) => {
    const contextMenu = document.getElementById("contextMenu");
    if (contextMenu && !contextMenu.contains(event.target as Node)) {
        contextMenu.style.display = "none";
    }

    document.querySelectorAll(".block.highlight").forEach((block) => {
        block.classList.remove("highlight");
    });
});



document.getElementById("contextMenu")?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const contextMenu = document.getElementById("contextMenu");
    const taskId = contextMenu?.getAttribute("data-target-id");

    if (target.id === "editTask") {
        console.log(`Редагувати задачу з ID: ${taskId}`);

        document.getElementById("editTask")?.addEventListener("click", () => {
            const todoText = document.querySelector(`input[data-id="${taskId}"]`)?.nextElementSibling as HTMLSpanElement | null;

            if (!todoText) {
                console.error(`Не вдалося знайти елемент з data-id="${taskId}".`);
                return;
            }

            if (todoText.contentEditable === "true") {
                // Завершити редагування
                todoText.contentEditable = "false";
                todoText.style.border = "none";

                const newText = todoText.textContent?.trim();
                if (newText && taskId) {
                    editTodoById(taskId, newText);
                }
            } else {
                // Розпочати редагування
                todoText.contentEditable = "true";
                todoText.style.border = "1px dashed #000";
                todoText.focus();
            }
        });
        
    } else if (target.id === "deleteTask") {
        console.log(`Видалити задачу з ID: ${taskId}`);
        deleteTodoById(taskId);
    }

    // Ховаємо меню після виконання дії
    contextMenu!.style.display = "none";
});

async function deleteTodoById(taskId: string | null | undefined): Promise<void> {
    if (!taskId) return;

    try {
        await fetch(`/todoList/${taskId}`, { method: "DELETE" });
        const taskElement = document.querySelector(`input[data-id="${taskId}"]`)?.closest(".block");
        taskElement?.remove();
        console.log(`Задача ${taskId} видалена`);
    } catch (error) {
        console.error("Помилка при видаленні задачі:", error);
    }
}

async function editTodoById(taskId: string, newText: string): Promise<void> {
    if (!taskId || !newText) return;

    try {
        // Відправлення зміненого тексту на сервер
        const response = await fetch(`/todoList/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newText }), // Передаємо новий текст
        });

        if (!response.ok) {
            throw new Error("Не вдалося оновити завдання на сервері");
        }

        // Оновлення тексту у DOM
        const taskElement = document.querySelector(`input[data-id="${taskId}"]`)?.closest(".block");
        const todoTextElement = taskElement?.querySelector(".todo-text") as HTMLSpanElement;

        if (todoTextElement) {
            todoTextElement.textContent = newText;
            console.log(`Завдання ${taskId} оновлено: ${newText}`);
        }
    } catch (error) {
        console.error("Помилка при оновленні завдання:", error);
    }
}

fetchTodos();

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
    </div>
`;
            switchCheckbox(listItem);
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
        document.getElementById("todoName")?.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.key === "Enter") { createTodo(); }
        });
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

function createContextMenu(): HTMLElement {
    // Створення контейнера меню
    const contextMenu = document.createElement("div");
    contextMenu.id = "contextMenu";
    contextMenu.className = "context-menu";
    contextMenu.style.display = "none"; // Ховаємо меню за замовчуванням

    // Створення списку опцій меню
    const menu = document.createElement("div");
    menu.className = "menu";

    // Створення кнопки "Edit"
    const editOption = document.createElement("span");
    editOption.id = "editTask";
    editOption.textContent = "Edit";
    menu.appendChild(editOption);

    // Створення кнопки "Delete"
    const deleteOption = document.createElement("span");
    deleteOption.id = "deleteTask";
    deleteOption.textContent = "Delete";
    menu.appendChild(deleteOption);

    // Додавання списку опцій до контекстного меню
    contextMenu.appendChild(menu);

    // Додавання контекстного меню до документа
    document.body.appendChild(contextMenu);

    return contextMenu;
}

window.onload = fetchTodos;