const uri = "https://localhost:7055/Todos";
const pinboard = document.getElementById("pinboard-container");

document.addEventListener("DOMContentLoaded", function () {
    getTodos();
});

function getTodos() {
    fetch(uri)
        .then(responste => responste.json())
        .then(data => displayTodos(data))
        .catch(error => console.log("Unable to fetch items", error));
}

function displayTodos(data) {    
    data.forEach(item => {        
        let htmlOutput = `
                <div class="postIt-container m-3">
                    <img class="pin" src="/img/Drawing-Pin-scaled.png" alt="Pinboard pin" />
                    <img class="checkmark${item.isCompleted ? " show" : ""}" src="/img/checkmark.png" alt="Completed Task Check Mark" />
                    <div class="postIt">
                        <h4 class="text-center px-2 my-2 text-truncate">
                            ${item.name ?? ""}
                        </h4>
                        <hr class="mx-2 my-3" />
                        <div class="postIt-body mx-3 overflow-auto">
                            ${item.description ?? ""}
                        </div>
                    </div>
                </div>`;

        pinboard.innerHTML += htmlOutput;
    })}