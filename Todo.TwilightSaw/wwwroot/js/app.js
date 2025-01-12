var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchTodos() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('/todoLists');
        const todo = yield response.json();
        const list = document.getElementById('todoList');
        if (list) {
            list.innerHTML = '';
            todo.forEach((todo) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${todo.name} - ${todo.isCompleted ? 'Completed' : 'Not completed'}`;
                list.appendChild(listItem);
            });
        }
    });
}
window.onload = fetchTodos;
export {};
//# sourceMappingURL=app.js.map