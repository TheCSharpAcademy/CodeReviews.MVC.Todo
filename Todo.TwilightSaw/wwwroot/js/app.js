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
function fetchTodos() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("/todoLists");
        const todo = yield response.json();
        const list = document.getElementById("todoList");
        if (list) {
            list.innerHTML = "";
            todo.forEach((todo) => {
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
                deleteBtn === null || deleteBtn === void 0 ? void 0 : deleteBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                    const todoId = deleteBtn.getAttribute("data-id");
                    try {
                        yield fetch(`/todoList/${todoId}`, {
                            method: "DELETE",
                        });
                        listItem.remove(); // Видаляємо елемент із DOM
                        console.log(`Задача ${todoId} видалена`);
                    }
                    catch (error) {
                        console.error("Помилка при видаленні задачі:", error);
                    }
                }));
            });
        }
    });
}
function createTodo() {
    return __awaiter(this, void 0, void 0, function* () {
        const todoNameInput = document.getElementById("todoName");
        const todoList = document.getElementById("todoList");
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
            yield fetchTodos;
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
function deleteTodo() {
    return __awaiter(this, void 0, void 0, function* () {
        const todoNameInput = document.getElementById("todoName");
        const todoList = document.getElementById("todoList");
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
        }
        catch (error) {
            console.error("Error:", error);
        }
        todoNameInput.value = "";
    });
}
window.onload = fetchTodos;
(_a = document.getElementById("addTodoBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", createTodo);
export {};
//# sourceMappingURL=app.js.map