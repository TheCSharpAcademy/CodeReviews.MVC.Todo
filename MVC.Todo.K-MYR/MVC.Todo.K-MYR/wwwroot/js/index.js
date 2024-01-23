const uri = "https://localhost:7055/Todos";
const pinboard = document.getElementById("pinboard-container");
const postItColors = ["#f5f6f8", "#fff9b1", "#daf7a1", "#ffc000", "#c9df56", "#ff9d48", "#b6d7a8", "#ff6575", "#77ccc7", "#eca2c4", "#6ed8fa", "#ffcee0", "#b1d3f6", "#b485bc", "#8ca0ff"];
const pinColors = ["blue", "green", "orange", "pink", "red"]
const rotationLimit = 4.5;

document.addEventListener("DOMContentLoaded", function () {
    getTodos();
});

function getTodos() {
    fetch(uri)
        .then(response => response.json())
        .then(data => displayTodos(data))
        .catch(error => console.log("Unable to fetch items", error));
}

function updateTodo(patchDoc, id) {
    fetch(`${uri}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json-patch+json"
        },
        body: JSON.stringify(patchDoc)
    })
        .then((response) => {
            if (!response.ok) {
                console.log(`HTTP Patch Error: ${response.status}`);                
            }
        })        
        .catch((error) => {
            console.error(error)
        });
}

function displayTodos(data) {       
    let rotation = 0;
    let pinColorIndex = 0;
    let postItColorIndex = 0;
    let postItElement;

    pinboard.innerHTML = '';

    data.forEach(todo => {
        rotation = Math.floor(randNum(rotationLimit, - rotationLimit) * 100) / 100;
        pinColorIndex = Math.round(randNum(0, pinColors.length - 1));
        postItColorIndex = Math.round(randNum(0, postItColors.length - 1));

        postItElement = createPostItElement(todo, postItColors[postItColorIndex], pinColors[pinColorIndex], rotation);
        pinboard.appendChild(postItElement);
    });
};

function createPostItElement(item, postItColor, pinColor, rotation) {
    const postItContainer = document.createElement('div');
    postItContainer.dataset.Id = item.Id
    postItContainer.classList.add('postIt-container', 'm-3');
    postItContainer.style.backgroundColor = postItColor;
    postItContainer.style.transform = `rotate(${rotation}deg)`;

    const pinImage = document.createElement('img');
    pinImage.classList.add('pin');
    pinImage.src = `/img/pin-${pinColor}.png`;
    pinImage.alt = 'Pinboard pin';

    const checkmarkImage = document.createElement('img');
    checkmarkImage.classList.add('checkmark');

    if (item.isCompleted)
        checkmarkImage.classList.add('show');

    checkmarkImage.src = '/img/checkmark.png';
    checkmarkImage.alt = 'Completed Task Check Mark';

    checkmarkImage.addEventListener('click', () => {
        updateTodo(
            [{
                op: "replace",
                path: "/IsCompleted",
                value: !item.IsCompleted
            }],
            item.Id
        );  
        getTodos();
    });

    const postIt = document.createElement('div');
    postIt.classList.add('postIt');

    const heading = document.createElement('h4');
    heading.classList.add('text-center', 'px-2', 'my-2', 'text-truncate');
    heading.textContent = item.name ?? '';

    const horizontalRule = document.createElement('hr');
    horizontalRule.classList.add('mx-2', 'my-3');

    const postItBody = document.createElement('div');
    postItBody.classList.add('postIt-body', 'mx-3', 'overflow-auto');
    postItBody.textContent = item.description ?? '';

    postIt.appendChild(heading);
    postIt.appendChild(horizontalRule);
    postIt.appendChild(postItBody);

    postItContainer.appendChild(pinImage);
    postItContainer.appendChild(checkmarkImage);
    postItContainer.appendChild(postIt);

    

    return postItContainer;
}

function randNum(min, max) {
    return Math.random() * (max - min) + min;
}