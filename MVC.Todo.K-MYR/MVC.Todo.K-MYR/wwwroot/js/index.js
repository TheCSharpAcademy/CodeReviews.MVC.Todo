const uri = "https://localhost:7055/Todos";
const animationContainer = document.getElementById("animation-container");
const pinboard = document.getElementById("pinboard-container");
const addPostIt = document.getElementById("addPostIt");
const addModal = document.getElementById("addTodo");
const editModal = document.getElementById("editTodo");
const postItColors = ["#f5f6f8", "#fff9b1", "#daf7a1", "#ffc000", "#c9df56", "#ff9d48", "#b6d7a8", "#ff6575", "#77ccc7", "#eca2c4", "#6ed8fa", "#ffcee0", "#b1d3f6", "#b485bc", "#8ca0ff"];
const pinColors = ["blue", "green", "orange", "pink", "red"]
const rotationLimit = 4.5;
const checkTransformScaling = "scale(1.4)";
const pinTransformScaling = "scale(1.35)";
const pencilTransformScaling = "scale(1.40)";


document.addEventListener("DOMContentLoaded", function () {
    getTodos();

    $("#addForm").validate({
        rules: {
            title_add: {
                required: true,
                minlength: 1,
                maxlength: 50
            },
            description_add: {
                maxlength: 250
            }
        },
        submitHandler: function (form) {
            const data = new FormData(form);
            addTodo(data.get('title_add'), data.get('description_add'));
            $("#addTodo").modal('hide');
            $("#title_add").val("");
            $("#description_add").val("");
        }
    });

    $("#editForm").validate({
        ignore: ".ignore",
        rules: {
            title_edit: {
                required: true,
                minlength: 1,
                maxlength: 50
            },
            description_edit: {
                maxlength: 250
            }
        },
        submitHandler: function (form) {
            const data = new FormData(form);
            updateTodo(data.get('id_edit'), data.get('title_edit'), data.get('description_edit'));
            $("#editTodo").modal('hide');
            $("#title_edit").val("");
            $("#description_edit").val("");
            $("#id_edit").val("");
        }
    });
});

async function getTodo(id) {
    try {

        const response = await fetch(`${uri}/${id}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Unable to fetch item", response.status);
        }

        return response.json();

    } catch (error) {
        throw error;
    }
}

function getTodos() {
    fetch(uri, {
        method: "GET",
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => displayTodos(data))
        .catch(error => console.log("Unable to fetch items", error));
}

async function addTodo(title, description) {
    try {
        const response = await fetch(`${uri}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Name: title, Description: description })
        });

        if (response.ok) {
            const postItElement = createPostItElement(await response.json());
            pinboard.insertBefore(postItElement, addPostIt);
        }
        else {
            console.error(`HTTP Post Error: ${response.status}`);
        }

    } catch (error) {
        console.error(error);
    };
}

async function patchTodo(patchDoc, id) {
    try {
        const response = await fetch(`${uri}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json-patch+json"
            },
            body: JSON.stringify(patchDoc)
        });

        if (!response.ok) {
            console.error(`HTTP Patch Error: ${response.status}`);
            return false;
        }

        return true;

    } catch (error) {
        console.error(error);
        return false;
    };
};

async function updateTodo(id, title, description) {
    try {
        const todo = await getTodo(id);
        todo.name = title;
        todo.description = description;

        const response = await fetch(`${uri}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(todo)
        });

        if (response.ok) {
            const heading = document.getElementById(`postIt_${id}`).querySelector('.heading');
            const postItBody = document.getElementById(`postIt_${id}`).querySelector('.postIt-body');

            postItBody.textContent = description ?? "";
            heading.textContent = title ?? "";
        }
        else {
            console.error(`HTTP PUT Error: ${response.status}`);
        }

    } catch (error) {
        console.error(error);
    };
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${uri}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            console.error(`HTTP Delete Error: ${response.status}`);
            return false;
        }

        return true;

    } catch (error) {
        console.error(error);
        return false;
    };
};

function displayTodos(data) {
    data.forEach(todo => {
        postItElement = createPostItElement(todo);
        pinboard.insertBefore(postItElement, addPostIt);
    });
};

function createPostItElement(item) {
    const rotation = Math.floor(randNum(rotationLimit, - rotationLimit) * 100) / 100;
    const pinColor = pinColors[Math.round(randNum(0, pinColors.length - 1))];
    const postItColor = postItColors[Math.round(randNum(0, postItColors.length - 1))];

    const postItContainer = document.createElement('div');
    postItContainer.id = `postIt_${item.id}`;
    postItContainer.classList.add('postIt-container', 'fadeIn');
    postItContainer.style = `--rot: ${rotation}deg; --bg-col: ${postItColor}`;

    const pinImage = document.createElement('img');
    pinImage.classList.add('pin');
    pinImage.src = `/img/pin-${pinColor}.png`;
    pinImage.alt = 'Pinboard pin';

    const editImage = document.createElement('img');
    editImage.classList.add('pencil');
    editImage.src = "/img/pencil_white.svg";
    editImage.alt = 'Pencil icon';
    editImage.setAttribute("data-bs-toggle", "modal");
    editImage.setAttribute("data-bs-target", "#editTodo");


    const checkmarkImage = document.createElement('img');
    checkmarkImage.classList.add('checkmark');

    if (item.isCompleted)
        checkmarkImage.classList.add('show');

    checkmarkImage.src = '/img/checkmark.png';
    checkmarkImage.alt = 'Completed Task Check Mark';

    const postIt = document.createElement('div');
    postIt.classList.add('postIt');

    const heading = document.createElement('h4');
    heading.classList.add('heading', 'text-center', 'px-2', 'my-2', 'text-truncate');
    heading.textContent = item.name ?? '';

    const horizontalRule = document.createElement('hr');
    horizontalRule.classList.add('mx-2', 'my-3');

    const postItBody = document.createElement('div');
    postItBody.classList.add('postIt-body', 'mx-3', 'overflow-auto');
    postItBody.textContent = item.description ?? '';

    editImage.addEventListener('click', async function () {
        const pencilTransform = this.style.transform;
        this.style.transform = pencilTransformScaling;
        setTimeout(() => {
            this.style.transform = pencilTransform;
        }, 180);

        $("#editTodoLabel").text(`Edit '${heading.textContent}'`);
        $("#title_edit").val(heading.textContent);
        $("#description_edit").val(postItBody.textContent);
        $("#id_edit").val(item.id);
    });
    checkmarkImage.addEventListener('click', async function () {
        anime({
            targets: checkmarkImage,
            easing: 'easeOutCubic',
            scale: [1, 2],
            duration: 150,
            direction: 'alternate',
            autoplay: true
        });
        try {
            const todo = await getTodo(item.id);
            const isSuccess = await patchTodo(
                [{
                    op: "replace",
                    path: "/IsCompleted",
                    value: !todo.isCompleted
                }],
                todo.id
            );

            if (isSuccess) {
                if (todo.isCompleted) {
                    this.classList.remove('show');
                } else {
                    animateStars(postItContainer);
                    this.classList.add('show');
                }
            }
        } catch (error) {
            console.error(error);
        }
    });

    pinImage.addEventListener('click', async function () {
        const pinTransform = this.style.transform;
        this.style.transform = pinTransformScaling;
        setTimeout(() => {
            this.style.transform = pinTransform;
        }, 180);

        try {
            const isSuccess = await deleteTodo(item.id);

            if (isSuccess) {
                postItContainer.classList.remove('fadeIn');
                postItContainer.classList.add('fallDown');
            };
        } catch (error) {
            console.error(error);
        }
    });
    postItContainer.addEventListener('animationend', function (e) {
        if (e.animationName == 'fallDown') {
            this.remove();
        }
    });

    postIt.appendChild(heading);
    postIt.appendChild(horizontalRule);
    postIt.appendChild(postItBody);

    postItContainer.appendChild(pinImage);
    postItContainer.appendChild(editImage);
    postItContainer.appendChild(checkmarkImage);
    postItContainer.appendChild(postIt);

    return postItContainer;
}

async function animateStars(elem) {
    const rect = elem.getBoundingClientRect();
    const stars = createStars();
    anime.set(stars, {
        left: (rect.left + 150) + "px",
        top: (rect.top + 150) + "px",
        opacity: 1
    });
    anime.timeline()
        .add({
            targets: stars,
            easing: 'linear',
            translateX: {
                value: [0, (el, i) => { return anime.random(20, 60) * Math.pow(-1, i) }
                ],
                easing: 'linear'
            },
            translateY: {
                value: [0, (el, i) => { return - anime.random(100, 150) }
                ],
                easing: 'easeOutSine'
            },
            loop: false,
            duration: 300
        })
        .add({
            targets: stars,
            opacity: {
                value: [0.8, 0],
                easing: 'easeInExpo'
            },
            translateX: {
                value: (el, i) => { return '+=' + (anime.random(60, 140) * Math.pow(-1, i)) }
                ,
                easing: 'linear'
            },
            translateY: {
                value: '+=' + anime.random(500, 700),
                easing: 'easeInSine'
            },
            loop: false,
            duration: 800

        }).finished.then(() => {
            for (let i = 0; i < stars.length; i++) {
                animationContainer.removeChild(stars[i])
            }
        });
}

function createStars() {
    const classes = ['star-xl', 'star-xl', 'star-md', 'star-md', 'star-sm', 'star-sm', 'star-sm'];
    let stars = [];

    for (let i = 0; i < classes.length; i++) {
        const star = document.createElement('img');
        star.src = "/img/star.svg";
        star.classList.add('star', classes[i]);
        animationContainer.appendChild(star);
        stars.push(star);
    }

    return stars;
}

function randNum(min, max) {
    return Math.random() * (max - min) + min;
}
