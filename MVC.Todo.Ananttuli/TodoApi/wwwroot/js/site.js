const uri = "/todos";

async function render() {
  const todos = await fetchAll();
  const tableBody = document.getElementById("todos");

  const rows = todos.map(createTodoRow);

  tableBody.innerHTML = "";

  tableBody.append(createTodoCreateRow(), ...rows);
}

/**
 * API calls to server
 */

async function postTodo(body) {
  try {
    const response = await fetch(`${uri}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}

async function fetchAll() {
  const response = await fetch(uri);
  const data = await response.json();
  return data;
}

async function updateTodo(id, body) {
  try {
    const response = await fetch(`${uri}/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}

async function deleteTodo(id) {
  try {
    await fetch(`${uri}/${id}`, {
      method: "DELETE",
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * API callbacks wrappers with UI interactions
 */
function deleteTodoCallback(id) {
  return async () => {
    const confirmed = confirm("Are you sure you want to delete?");
    if (!confirmed) return;

    const success = await deleteTodo(id);

    alert(success ? "Deleted" : "Could not delete");

    render();
  };
}

/**
 *
 * @param {HTMLTableRowElement} row
 */
function makeRowDisplay(row, todo) {
  const cells = [
    document.createElement("td"),
    document.createElement("td"),
    document.createElement("td"),
    document.createElement("td"),
  ];

  const doneCell = document.createElement("input");
  doneCell.type = "checkbox";
  doneCell.checked = todo.isComplete;
  doneCell.disabled = true;

  cells[0].append(doneCell);

  cells[1].innerText = todo.name;

  if (todo.dueAt) {
    const dueDate = new Date(todo.dueAt);
    cells[2].innerText = dueDate.toLocaleDateString();

    const dueDatePassed = dueDate < new Date();

    const dueDateStatusIconClass =
      dueDatePassed && !todo.isComplete
        ? '<i class="bi-exclamation-circle-fill"></i> Overdue'
        : "";
    const icon = document.createElement("i");
    icon.setAttribute("class", dueDateStatusIconClass);

    cells[2].appendChild(icon);
  }

  const editModeButton = document.createElement("button");
  editModeButton.innerHTML = '<i class="bi bi-pencil-fill"></i>';
  editModeButton.onclick = () => makeRowEditable(row, todo.id, todo);

  const deleteButton = document.createElement("button");
  deleteButton.style.backgroundColor = "#dc3545";
  deleteButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
  deleteButton.classList.add("secondary");
  deleteButton.onclick = deleteTodoCallback(todo.id);

  cells[3].append(editModeButton, deleteButton);

  row.innerHTML = "";
  row.append(...cells);
}

function createEditTodoCells(todo) {
  const cells = [
    document.createElement("td"),
    document.createElement("td"),
    document.createElement("td"),
  ];

  const doneInput = document.createElement("input");
  doneInput.type = "checkbox";
  doneInput.checked = !!todo.isComplete;

  const nameInput = document.createElement("input");
  nameInput.value = todo.name;

  const dateInput = document.createElement("input");
  dateInput.type = "date";

  if (todo.dueAt) {
    const dueDate = new Date(todo.dueAt);
    var year = dueDate.toLocaleString("default", { year: "numeric" });
    var month = dueDate.toLocaleString("default", { month: "2-digit" });
    var day = dueDate.toLocaleString("default", { day: "2-digit" });

    dateInput.value = `${year}-${month}-${day}`;
  }

  cells[0].append(doneInput);
  cells[1].append(nameInput);
  cells[2].append(dateInput);

  return cells;
}

/**
 *
 * @param {HTMLTableRowElement} row
 */
function makeRowEditable(row, id, todo) {
  const controlsCell = document.createElement("td");

  const cancelButton = document.createElement("button");
  cancelButton.classList.add("secondary");
  cancelButton.innerHTML = '<i class="bi bi-x"></i> Cancel';
  cancelButton.onclick = () => makeRowDisplay(row, todo);

  const saveButton = document.createElement("button");
  saveButton.innerHTML = '<i class="bi bi-floppy2-fill"></i> Save';
  saveButton.onclick = async () => {
    const [valid, { name, dueAt, isComplete }] = validateRow(row);
    if (!valid) return;

    const updated = await updateTodo(id, {
      id: todo.id,
      name,
      dueAt,
      isComplete,
    });

    if (updated) alert("Updated");
    else alert("Could not update");

    render();
  };

  controlsCell.append(saveButton, cancelButton);

  row.innerHTML = "";
  row.append(...createEditTodoCells(todo), controlsCell);
}

function validateRow(row) {
  const name = row.children[1]?.children[0]?.value;
  if (!name) {
    alert("Name cannot be empty");
  }

  const dueAt = row.children[2]?.children[0]?.value || null;
  const isComplete =
    row.children[0]?.children[0]?.checked == true ? true : false;

  return [!!name, { name, dueAt, isComplete }];
}

function createTodoCreateRow() {
  const row = document.createElement("tr");

  row.classList.add("create-row");

  const defaultValues = {
    name: "",
    isComplete: false,
    dueDate: null,
  };

  const todoEditableCells = createEditTodoCells({
    ...defaultValues,
  });

  const saveButton = document.createElement("button");
  saveButton.innerHTML = '<i class="bi bi-plus-circle-fill"></i> Create';

  saveButton.onclick = async () => {
    const [valid, { name, dueAt, isComplete }] = validateRow(row);
    if (!valid) return;

    const createdTodo = await postTodo({ name, dueAt, isComplete });
    if (createdTodo) alert("Created");
    else alert("Failed");

    render();
  };

  const clearButton = document.createElement("button");
  clearButton.classList.add("secondary", "outline");
  clearButton.innerHTML = '<i class="bi bi-eraser-fill"></i> Clear';

  const buttonsCell = document.createElement("td");
  buttonsCell.append(saveButton, clearButton);

  clearButton.onclick = () => {
    row.innerHTML = "";
    row.append(...createEditTodoCells({ ...defaultValues }), buttonsCell);
  };

  row.append(...todoEditableCells, buttonsCell);

  return row;
}

function createTodoRow(todo) {
  const row = document.createElement("tr");

  makeRowDisplay(row, todo);

  return row;
}
