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
        const response = yield fetch('/todoLists');
        const todo = yield response.json();
        const list = document.getElementById('todoList');
        if (list) {
            list.innerHTML = '';
            todo.forEach((todo) => {
                const listItem = document.createElement("div");
                listItem.classList.add('block');
                listItem.textContent = `${todo.name} - ${todo.isCompleted ? 'Completed' : 'Not completed'}`;
                list.appendChild(listItem);
            });
        }
    });
}
function createTodo() {
    return __awaiter(this, void 0, void 0, function* () {
        const todoNameInput = document.getElementById('todoName');
        const todoComepleteInput = document.getElementById('todoComplete');
        const todoList = document.getElementById('todoList');
        const todoName = todoNameInput.value.trim();
        const todoComplete = todoComepleteInput.checked;
        if (todoName === '') {
            alert('Будь ласка, заповніть всі поля!');
            return;
        }
        const newTodo = {
            name: todoName,
            isCompleted: todoComplete
        };
        try {
            const response = yield fetch('/todoList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTodo),
            });
            fetchTodos;
        }
        catch (error) {
            console.error("Error:", error);
        }
        todoNameInput.value = "";
        todoComepleteInput.checked = false;
    });
}
window.onload = fetchTodos;
(_a = document.getElementById('addTodoBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', createTodo);
export {};
//# sourceMappingURL=app.js.map