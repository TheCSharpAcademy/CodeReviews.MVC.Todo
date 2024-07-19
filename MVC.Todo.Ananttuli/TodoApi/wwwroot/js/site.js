import { Api } from "./api.js";
import { Ui } from "./ui.js";

renderTodos();

async function renderTodos() {
  const todos = await Api.fetchAll();
  const tableBody = document.getElementById("todos");

  const completedRows = todos
    .filter((todo) => todo.isComplete)
    .map(createTodoRow);
  const incompleteRows = todos
    .filter((todo) => !todo.isComplete)
    .map(createTodoRow);

  tableBody.innerHTML = "";

  const { incompleteMarkerRow, completedMarkerRow } =
    Ui.createTableSectionHeaderRows(
      incompleteRows.length,
      completedRows.length
    );

  tableBody.append(
    createTodoCreateRow(),
    incompleteMarkerRow,
    ...incompleteRows,
    completedMarkerRow,
    ...completedRows
  );
}

// ===================== DISPLAY MODE ===================== //

function createTodoRow(todo) {
  const row = document.createElement("tr");

  showRowInDisplayMode(row, todo);

  return row;
}

function showRowInDisplayMode(row, todo) {
  const checkboxCell = Ui.createCheckboxCell(
    todo.isComplete,
    false,
    async (e) => {
      await updateTodo({ ...todo, isComplete: e.currentTarget.checked });
    }
  );

  const nameCell = Ui.createTextCell(todo.name);

  const dueDateCell = Ui.createDateDisplayCell(
    todo.dueAt,
    todo.dueAt && new Date(todo.dueAt) < new Date() && !todo.isComplete
  );

  const controlsCell = document.createElement("td");

  controlsCell.append(getEditModeButton(row, todo), getDeleteButton(todo.id));

  row.innerHTML = "";
  row.className = "display-mode";
  row.append(checkboxCell, nameCell, dueDateCell, controlsCell);
}

// ===================== EDIT MODE ===================== //

function showRowInEditMode(row, todo) {
  const controlsCell = document.createElement("td");

  controlsCell.append(
    getSaveButton(row, todo),
    getCancelButton(row, todo),
    Ui.createUpdateMessage()
  );

  row.innerHTML = "";
  row.className = "edit-mode";
  row.append(...getEditTodoCells(todo), controlsCell);
}

function getEditTodoCells(todo) {
  const checkBoxCell = Ui.createCheckboxCell(todo.isComplete, false);

  const nameCell = Ui.createTextInputCell(todo.name);

  const dateCell = Ui.createDateInputCell(todo.dueAt);

  return [checkBoxCell, nameCell, dateCell];
}

// ===================== BUTTONS LOGIC ===================== //

function getEditModeButton(row, todo) {
  const editModeButton = Ui.createEnableEditModeButton();

  editModeButton.onclick = () => showRowInEditMode(row, todo);

  return editModeButton;
}

function getDeleteButton(todoId) {
  const deleteButton = Ui.createDeleteButton();

  deleteButton.onclick = async () => {
    const confirmed = confirm("Are you sure you want to delete?");
    if (!confirmed) return;

    const success = await Api.deleteTodo(todoId);
    if (!success) {
      alert("Could not delete");
    }

    renderTodos();
  };

  return deleteButton;
}

function getCancelButton(row, todo) {
  const cancelButton = Ui.createCancelButton();
  cancelButton.onclick = () => showRowInDisplayMode(row, todo);

  return cancelButton;
}

async function updateTodo(todo) {
  const updated = await Api.updateTodo(todo.id, todo);

  if (updated) alert("Updated");
  else alert("Could not update");

  await renderTodos();
}

async function validateAndUpdateTodo(row, todo) {
  const [valid, { name, dueAt, isComplete }] = extractTodoDataFromRow(row);
  if (!valid) return;

  await updateTodo({
    id: todo.id,
    name,
    dueAt,
    isComplete,
  });
}

function getSaveButton(row, todo) {
  const saveButton = Ui.createSaveButton();
  saveButton.onclick = async () => {
    validateAndUpdateTodo(row, todo);
  };

  return saveButton;
}

function getCreateButton(row) {
  const createButton = Ui.createCreateButton();

  createButton.onclick = async () => {
    const [valid, { name, dueAt, isComplete }] = extractTodoDataFromRow(row);
    if (!valid) return;

    const createdTodo = await Api.postTodo({ name, dueAt, isComplete });

    if (!createdTodo) alert("Could not create");

    renderTodos();
  };

  return createButton;
}

// ===================== COMMON ===================== //

function extractTodoDataFromRow(row) {
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

  const todoEditableCells = getEditTodoCells({
    ...defaultValues,
  });

  const clearButton = Ui.createClearButton();

  const buttonsCell = document.createElement("td");
  buttonsCell.append(getCreateButton(row), clearButton);

  clearButton.onclick = () => {
    row.innerHTML = "";
    row.append(...getEditTodoCells({ ...defaultValues }), buttonsCell);
  };

  row.append(...todoEditableCells, buttonsCell);

  return row;
}
