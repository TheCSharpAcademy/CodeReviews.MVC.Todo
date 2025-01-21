var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
createContextMenu();
document.addEventListener("contextmenu", (event) => {
    var _a;
    const target = event.target.closest(".block");
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
        const taskId = (_a = target.querySelector("input")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id");
        contextMenu.setAttribute("data-target-id", taskId || "");
    }
});
document.addEventListener("click", (event) => {
    const contextMenu = document.getElementById("contextMenu");
    if (contextMenu && !contextMenu.contains(event.target)) {
        contextMenu.style.display = "none";
    }
    document.querySelectorAll(".block.highlight").forEach((block) => {
        block.classList.remove("highlight");
    });
});
(_a = document.getElementById("contextMenu")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (event) => {
    var _a;
    const target = event.target;
    const contextMenu = document.getElementById("contextMenu");
    const taskId = contextMenu === null || contextMenu === void 0 ? void 0 : contextMenu.getAttribute("data-target-id");
    if (target.id === "editTask") {
        console.log(`Редагувати задачу з ID: ${taskId}`);
        (_a = document.getElementById("editTask")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            var _a, _b;
            const todoText = (_a = document.querySelector(`input[data-id="${taskId}"]`)) === null || _a === void 0 ? void 0 : _a.nextElementSibling;
            if (!todoText) {
                console.error(`Не вдалося знайти елемент з data-id="${taskId}".`);
                return;
            }
            if (todoText.contentEditable === "true") {
                // Завершити редагування
                todoText.contentEditable = "false";
                todoText.style.border = "none";
                const newText = (_b = todoText.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                if (newText && taskId) {
                    editTodoById(taskId, newText);
                }
            }
            else {
                // Розпочати редагування
                todoText.contentEditable = "true";
                todoText.style.border = "1px dashed #000";
                todoText.focus();
            }
        });
    }
    else if (target.id === "deleteTask") {
        console.log(`Видалити задачу з ID: ${taskId}`);
        deleteTodoById(taskId);
    }
    // Ховаємо меню після виконання дії
    contextMenu.style.display = "none";
});
function deleteTodoById(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!taskId)
            return;
        try {
            yield fetch(`/todoList/${taskId}`, { method: "DELETE" });
            const taskElement = (_a = document.querySelector(`input[data-id="${taskId}"]`)) === null || _a === void 0 ? void 0 : _a.closest(".block");
            taskElement === null || taskElement === void 0 ? void 0 : taskElement.remove();
            console.log(`Задача ${taskId} видалена`);
        }
        catch (error) {
            console.error("Помилка при видаленні задачі:", error);
        }
    });
}
function editTodoById(taskId, newText) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!taskId || !newText)
            return;
        try {
            // Відправлення зміненого тексту на сервер
            const response = yield fetch(`/todoList/${taskId}`, {
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
            const taskElement = (_a = document.querySelector(`input[data-id="${taskId}"]`)) === null || _a === void 0 ? void 0 : _a.closest(".block");
            const todoTextElement = taskElement === null || taskElement === void 0 ? void 0 : taskElement.querySelector(".todo-text");
            if (todoTextElement) {
                todoTextElement.textContent = newText;
                console.log(`Завдання ${taskId} оновлено: ${newText}`);
            }
        }
        catch (error) {
            console.error("Помилка при оновленні завдання:", error);
        }
    });
}
fetchTodos();
function fetchTodos() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const response = yield fetch("/todoLists");
        const todo = yield response.json();
        const list = document.getElementById("todoList");
        if (list) {
            list.innerHTML = "";
            todo.forEach((todo) => {
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
`;
            (_a = document.getElementById("addTodoBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", createTodo);
            (_b = document.getElementById("todoName")) === null || _b === void 0 ? void 0 : _b.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    createTodo();
                }
            });
        }
    });
}
function createTodo() {
    return __awaiter(this, void 0, void 0, function* () {
        const todoNameInput = document.getElementById("todoName");
        const todoName = todoNameInput.value.trim();
        if (todoName === "") {
            alert("Please, fill all fields!");
            return;
        }
        const newTodo = {
            name: todoName,
            isCompleted: false,
        };
        try {
            const response = yield fetch("/todoList", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTodo),
            });
            if (!response.ok) {
                throw new Error("Failed to add a new task");
            }
            yield fetchTodos();
        }
        catch (error) {
            console.error("Error:", error);
        }
        todoNameInput.value = "";
    });
}
function switchCheckbox(listItem) {
    return __awaiter(this, void 0, void 0, function* () {
        const checkbox = listItem.querySelector('input[type="checkbox"]');
        checkbox === null || checkbox === void 0 ? void 0 : checkbox.addEventListener("change", (event) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const target = event.target;
            const isChecked = target.checked;
            const todoId = target.getAttribute("data-id");
            try {
                yield fetch(`/todoList/${todoId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: todoId,
                        isCompleted: isChecked,
                        name: ((_b = (_a = target.closest("label")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "",
                    }),
                });
                console.log(`Task ${todoId} done!`);
            }
            catch (error) {
                console.error("Task error:", error);
            }
        }));
    });
}
function createContextMenu() {
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
export {};
//# sourceMappingURL=app.js.map