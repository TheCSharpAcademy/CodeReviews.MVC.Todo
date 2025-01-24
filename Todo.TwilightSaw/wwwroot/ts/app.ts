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

        contextMenu.style.display = "block";
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;

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

    if (!taskId) {
        console.error("No data-target-id in the context menu.");
        return;
    }

    if (target.id === "editTask") {
        const todoText = document.querySelector(`input[data-id="${taskId}"]`)
            ?.nextElementSibling as HTMLSpanElement | null;
        const checkbox = document.querySelector(
            `input[data-id="${taskId}"]`
        ) as HTMLInputElement | null;

        if (!todoText) {
            console.error(`Cant find the element with data-id="${taskId}".`);
            return;
        }

        if (
            todoText.contentEditable === "false" ||
            todoText.contentEditable === "inherit"
        ) {
            startEditing(todoText, checkbox, taskId);
        } else {
            finishEditing(todoText, checkbox, taskId);
        }
    } else if (target.id === "deleteTask") {
        deleteTodoById(taskId);
    }

    contextMenu!.style.display = "none";
});

function startEditing(
    todoText: HTMLSpanElement,
    checkbox: HTMLInputElement | null,
    taskId: string
) {
    if (todoText.contentEditable === "true") return;

    if (checkbox) checkbox.disabled = true;

    todoText.contentEditable = "true";
    todoText.setAttribute("spellcheck", "false");
    todoText.classList.add("editable");
    todoText.focus();
    moveCursorToEnd(todoText);

    const keydownHandler = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault();
            finishEditing(todoText, checkbox, taskId);
            document.removeEventListener("keydown", keydownHandler);
            document.removeEventListener("click", clickOutsideHandler);
        }
    };
    setTimeout(() => {
        todoText.addEventListener("keydown", keydownHandler);
    }, 0);

    const clickOutsideHandler = (event: MouseEvent) => {
        if (!todoText.contains(event.target as Node)) {
            finishEditing(todoText, checkbox, taskId);
            document.removeEventListener("click", clickOutsideHandler);
        }
    };
    setTimeout(() => {
        document.addEventListener("click", clickOutsideHandler);
    }, 0);
}

function finishEditing(
    todoText: HTMLSpanElement,
    checkbox: HTMLInputElement | null,
    taskId: string
) {
    todoText.contentEditable = "false";
    todoText.classList.remove("editable");

    if (checkbox) checkbox.disabled = false;

    const newText = todoText.textContent?.trim();
    if (newText && taskId) {
        editTodoById(taskId, newText);
    }
}

async function deleteTodoById(
    taskId: string | null | undefined
): Promise<void> {
    if (!taskId) return;

    try {
        await fetch(`/todoList/${taskId}`, { method: "DELETE" });
        const taskElement = document
            .querySelector(`input[data-id="${taskId}"]`)
            ?.closest(".block");
        taskElement?.remove();
        console.log(`Задача ${taskId} видалена`);
    } catch (error) {
        console.error("Deleting task error:", error);
    }
}

async function editTodoById(taskId: string, newText: string): Promise<void> {
    if (!taskId || !newText) return;

    try {
        const response = await fetch(`/todoList/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newText }),
        });

        if (!response.ok) {
            throw new Error("Error with task refreshing.");
        }

        const taskElement = document
            .querySelector(`input[data-id="${taskId}"]`)
            ?.closest(".block");
        const todoTextElement = taskElement?.querySelector(
            ".todo-text"
        ) as HTMLSpanElement;

        if (todoTextElement) {
            todoTextElement.textContent = newText;
            console.log(`Завдання ${taskId} оновлено: ${newText}`);
        }
    } catch (error) {
        console.error("Error with task refreshing:", error);
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
            <img src="https://icons.veryicon.com/png/o/object/material-design-icons-1/pencil-50.png" id = "addTodoBtn" >
`;
        document
            .getElementById("addTodoBtn")
            ?.addEventListener("click", createTodo);
        document
            .getElementById("todoName")
            ?.addEventListener("keydown", (event: KeyboardEvent) => {
                if (event.key === "Enter") {
                    createTodo();
                }
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
    const contextMenu = document.createElement("div");
    contextMenu.id = "contextMenu";
    contextMenu.className = "context-menu";
    contextMenu.style.display = "none";

    const menu = document.createElement("div");
    menu.className = "menu";

    const editOption = document.createElement("span");
    editOption.id = "editTask";
    editOption.textContent = "Edit";
    menu.appendChild(editOption);

    const deleteOption = document.createElement("span");
    deleteOption.id = "deleteTask";
    deleteOption.textContent = "Delete";
    menu.appendChild(deleteOption);

    contextMenu.appendChild(menu);

    document.body.appendChild(contextMenu);

    return contextMenu;
}

function moveCursorToEnd(element: HTMLElement) {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(element);
    range.collapse(false);

    selection?.removeAllRanges();
    selection?.addRange(range);
}

window.onload = fetchTodos;
