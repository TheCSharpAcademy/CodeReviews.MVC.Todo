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
        var _a;
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
`;
            (_a = document.getElementById("addTodoBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", createTodo);
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
function deleteTodo(listItem) {
    return __awaiter(this, void 0, void 0, function* () {
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
window.onload = fetchTodos;
(_a = document.getElementById("addTodoBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", createTodo);
document.addEventListener("DOMContentLoaded", () => {
    const myDiv = document.getElementById("myDiv");
    const contextMenu = document.getElementById("contextMenu");
    // Показ контекстного меню
    myDiv === null || myDiv === void 0 ? void 0 : myDiv.addEventListener("contextmenu", (event) => {
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
export {};
//# sourceMappingURL=app.js.map