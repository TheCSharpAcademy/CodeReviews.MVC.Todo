const uri = "/todoitems";
let todos = [];

document.addEventListener("DOMContentLoaded", function () {
  getItems();
  document.getElementById("addForm").addEventListener("submit", addItem);
  document
    .getElementById("editItemForm")
    .addEventListener("submit", updateItem);
});

function getItems() {
  fetch(uri)
    .then((response) => response.json())
    .then((data) => _displayItems(data))
    .catch((error) => console.error("Unable to get items.", error));
}

function addItem(e) {
  e.preventDefault();
  clearMessage();
  const addNameTextbox = document.getElementById("add-name");
  const item = {
    isComplete: false,
    name: addNameTextbox.value.trim(),
  };

  fetch(uri, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  })
    .then((response) => response.json())
    .then(() => {
      getItems();
      addNameTextbox.value = "";
      showMessage("Item added successfully");
    })
    .catch((error) => console.error("Unable to add item.", error));
}

function deleteItem(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    fetch(`${uri}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        getItems();
        showMessage("Item deleted successfully");
      })
      .catch((error) => console.error("Unable to delete item.", error));
  }
}

function displayEditForm(id) {
  const item = todos.find((item) => item.id === id);

  document.getElementById("edit-name").value = item.name;
  document.getElementById("edit-id").value = item.id;
  document.getElementById("edit-isComplete").checked = item.isComplete;
  document.getElementById("editForm").style.display = "block";
}

function updateItem(e) {
  e.preventDefault();
  const itemId = document.getElementById("edit-id").value;
  const item = {
    id: parseInt(itemId, 10),
    isComplete: document.getElementById("edit-isComplete").checked,
    name: document.getElementById("edit-name").value.trim(),
  };

  fetch(`${uri}/${itemId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  })
    .then(() => {
      getItems();
      closeInput();
      showMessage("Item updated successfully");
    })
    .catch((error) => console.error("Unable to update item.", error));
}

function closeInput() {
  document.getElementById("editForm").style.display = "none";
}

function _displayCount(itemCount) {
  const name = itemCount === 1 ? "to-do" : "to-dos";
  document.getElementById("counter").innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
  const tBody = document.getElementById("todos");
  tBody.innerHTML = "";

  _displayCount(data.length);

  data.forEach((item) => {
    let tr = tBody.insertRow();

    let td1 = tr.insertCell(0);
    let isCompleteCheckbox = document.createElement("input");
    isCompleteCheckbox.type = "checkbox";
    isCompleteCheckbox.disabled = true;
    isCompleteCheckbox.checked = item.isComplete;
    isCompleteCheckbox.classList.add("form-check-input");
    td1.appendChild(isCompleteCheckbox);

    let td2 = tr.insertCell(1);
    let textNode = document.createTextNode(item.name);
    td2.appendChild(textNode);

    let td3 = tr.insertCell(2);
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.classList.add("btn", "btn-sm", "btn-primary", "me-2");
    editButton.onclick = () => displayEditForm(item.id);
    td3.appendChild(editButton);

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("btn", "btn-sm", "btn-danger");
    deleteButton.onclick = () => deleteItem(item.id);
    td3.appendChild(deleteButton);
  });

  todos = data;
}

function showMessage(message) {
  const messageElement = document.getElementById("message");
  messageElement.textContent = message;
  messageElement.classList.remove("d-none");
  messageElement.classList.remove("alert-success");
  if (message.includes("successfully")) {
    messageElement.classList.add("alert-success");
  } else {
    messageElement.classList.add("alert-info");
  }
}

function clearMessage() {
  const messageElement = document.getElementById("message");
  messageElement.classList.add("d-none");
  messageElement.textContent = "";
  messageElement.classList.remove("alert-success", "alert-info");
}
