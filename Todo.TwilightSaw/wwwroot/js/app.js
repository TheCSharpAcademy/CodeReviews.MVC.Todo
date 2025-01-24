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
createDeleteModal();
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
        contextMenu.style.display = "block";
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;
        const taskId = (_a = target.querySelector("input")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id");
        contextMenu.setAttribute("data-target-id", taskId || "");
    }
});
document.addEventListener("click", (event) => {
    const contextMenu = document.getElementById("contextMenu");
    const modalMenu = document.getElementById("deleteModal");
    if (contextMenu && !contextMenu.contains(event.target)) {
        contextMenu.style.display = "none";
    }
    if (modalMenu && !modalMenu.contains(event.target)) {
        modalMenu.style.display = "none";
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
    if (!taskId) {
        console.error("No data-target-id in the context menu.");
        return;
    }
    if (target.id === "editTask") {
        const todoText = (_a = document.querySelector(`input[data-id="${taskId}"]`)) === null || _a === void 0 ? void 0 : _a.nextElementSibling;
        const checkbox = document.querySelector(`input[data-id="${taskId}"]`);
        if (!todoText) {
            console.error(`Cant find the element with data-id="${taskId}".`);
            return;
        }
        if (todoText.contentEditable === "false" ||
            todoText.contentEditable === "inherit") {
            startEditing(todoText, checkbox, taskId);
        }
        else {
            finishEditing(todoText, checkbox, taskId);
        }
    }
    else if (target.id === "deleteTask") {
        showDeleteModal(taskId, event);
    }
    contextMenu.style.display = "none";
});
function startEditing(todoText, checkbox, taskId) {
    if (todoText.contentEditable === "true")
        return;
    if (checkbox)
        checkbox.disabled = true;
    todoText.contentEditable = "true";
    todoText.setAttribute("spellcheck", "false");
    todoText.classList.add("editable");
    todoText.focus();
    moveCursorToEnd(todoText);
    const keydownHandler = (event) => {
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
    const clickOutsideHandler = (event) => {
        if (!todoText.contains(event.target)) {
            finishEditing(todoText, checkbox, taskId);
            document.removeEventListener("click", clickOutsideHandler);
        }
    };
    setTimeout(() => {
        document.addEventListener("click", clickOutsideHandler);
    }, 0);
}
function finishEditing(todoText, checkbox, taskId) {
    var _a;
    todoText.contentEditable = "false";
    todoText.classList.remove("editable");
    if (checkbox)
        checkbox.disabled = false;
    const newText = (_a = todoText.textContent) === null || _a === void 0 ? void 0 : _a.trim();
    if (newText && taskId) {
        editTodoById(taskId, newText);
    }
}
function deleteTodoById(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!taskId)
            return;
        try {
            yield fetch(`/todoList/${taskId}`, { method: "DELETE" });
            const taskElement = (_a = document
                .querySelector(`input[data-id="${taskId}"]`)) === null || _a === void 0 ? void 0 : _a.closest(".block");
            taskElement === null || taskElement === void 0 ? void 0 : taskElement.remove();
        }
        catch (error) {
            console.error("Deleting task error:", error);
        }
    });
}
function editTodoById(taskId, newText) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!taskId || !newText)
            return;
        try {
            const response = yield fetch(`/todoList/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newText }),
            });
            if (!response.ok) {
                throw new Error("Error with task refreshing.");
            }
            const taskElement = (_a = document
                .querySelector(`input[data-id="${taskId}"]`)) === null || _a === void 0 ? void 0 : _a.closest(".block");
            const todoTextElement = taskElement === null || taskElement === void 0 ? void 0 : taskElement.querySelector(".todo-text");
            if (todoTextElement) {
                todoTextElement.textContent = newText;
                console.log(`Завдання ${taskId} оновлено: ${newText}`);
            }
        }
        catch (error) {
            console.error("Error with task refreshing:", error);
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
            <img src="https://icons.veryicon.com/png/o/object/material-design-icons-1/pencil-50.png" id = "addTodoBtn" >
`;
            (_a = document
                .getElementById("addTodoBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", createTodo);
            (_b = document
                .getElementById("todoName")) === null || _b === void 0 ? void 0 : _b.addEventListener("keydown", (event) => {
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
function createDeleteModal() {
    const modal = document.createElement("div");
    modal.id = "deleteModal";
    modal.className = "modal-menu";
    modal.style.display = "none";
    const mod = document.createElement("div");
    mod.className = "modal-content";
    const textDelete = document.createElement("div");
    textDelete.id = "textDelete";
    textDelete.textContent = "Are you sure?";
    modal.appendChild(textDelete);
    const confirmDelete = document.createElement("span");
    confirmDelete.id = "confirmDelete";
    confirmDelete.textContent = "Yes";
    mod.appendChild(confirmDelete);
    const cancelDelete = document.createElement("span");
    cancelDelete.id = "cancelDelete";
    cancelDelete.textContent = "No";
    mod.appendChild(cancelDelete);
    modal.appendChild(mod);
    document.body.appendChild(modal);
    return modal;
}
function moveCursorToEnd(element) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
    selection === null || selection === void 0 ? void 0 : selection.addRange(range);
}
function showDeleteModal(taskId, event) {
    const modal = document.getElementById("deleteModal");
    if (!modal)
        return;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const modalWidth = modal.offsetWidth;
    const modalHeight = modal.offsetHeight;
    modal.style.display = "block";
    modal.style.left = `${event.pageX}px`;
    modal.style.top = `${event.pageY}px`;
    const confirmButton = modal.querySelector("#confirmDelete");
    const cancelButton = modal.querySelector("#cancelDelete");
    event.stopPropagation();
    const confirmHandler = () => {
        deleteTodoById(taskId);
        closeModal(modal, confirmHandler, cancelHandler);
    };
    const cancelHandler = () => {
        closeModal(modal, confirmHandler, cancelHandler);
    };
    confirmButton.addEventListener("click", confirmHandler);
    cancelButton.addEventListener("click", cancelHandler);
}
function closeModal(modal, confirmHandler, cancelHandler) {
    modal.style.display = "none";
    const confirmButton = modal.querySelector("#confirmDelete");
    const cancelButton = modal.querySelector("#cancelDelete");
    confirmButton.removeEventListener("click", confirmHandler);
    cancelButton.removeEventListener("click", cancelHandler);
}
window.onload = fetchTodos;
export {};
//# sourceMappingURL=app.js.map