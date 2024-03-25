window.onload = getTodos()

document.getElementById('todoModal').addEventListener('show.bs.modal', event => createModal(event))
document.getElementById('todoModal').querySelector('form').addEventListener('submit', handleForm)

function handleForm(event){
    event.preventDefault()
    const formData = new FormData(event.target)
    const todo = Object.fromEntries(formData);
    if(todo.id == 0){
        postTodos(todo)
    }
    else{
        putTodos(todo)
    }
    var modal = bootstrap.Modal.getInstance(document.getElementById('todoModal'))
    modal.hide()
}

function postTodos(todo){
    const apiAddress = `https://localhost:7048/todolist`  
    fetch(apiAddress,
    {
        method: 'POST',
        headers: {
            'Accept' : 'application/json, text/plain, */*' ,
            'Content-Type' : 'application/json'},
        body: JSON.stringify(todo)
    })
    .then( response => {
        if(response.status == 201){
            return response.json()
        }
        else{
            throw new Error('Server error, please try again later.')
        }
    })
    .then( body => {
        document.getElementById('todoAccordion').appendChild(generateAccordion(body))
    })
    .catch( e => {
        window.alert(e)
        console.log('Catch', e)})
}

function putTodos(todo){
    const apiAddress = `https://localhost:7048/todolist/update/${todo.id}`
    fetch(apiAddress,
    {
        method: 'PUT',
        headers: {
            'Accept' : 'application/json, text/plain, */*' ,
            'Content-Type' : 'application/json'},
        body: JSON.stringify(todo)
    })
    .then( response => {
            if(response.status == 200){
                return response.json()
            }
            else{
                throw new Error('Server error, please try again later.')
            }
        })
    .then( body => {
        document.getElementById(`accordion${body.id}`).replaceWith(generateAccordion(body))
    })
    .catch( e => {
        window.alert(e)
        console.log('Catch', e)
    })
}

function getTodos(){
    const apiAddress = 'https://localhost:7048/todolist'
    fetch(apiAddress)
    .then( response => {
        if( response.status == 200){
            return response.json()
        }
        else{
            throw new Error('Server error, please try again later.')            
        }
    })
    .then( data => {
        const accordion = document.getElementById('todoAccordion')
        data.forEach(element => {
            accordion.appendChild(generateAccordion(element))
        });
    })
    .catch( e => {
        window.alert(e)
        console.log('Catch', e)})
}

function deleteTodo(id)
{
    const apiAddress = `https://localhost:7048/todolist/delete/${id}`
    fetch(apiAddress,
    {
        method: 'DELETE',
        headers: {
            'Accept' : 'application/json, text/plain, */*' ,
            'Content-Type' : 'application/json'}
    })
    .then( response => {
        if( response.status == 200){
            return
        }
        else{
            throw new Error('Server error, please try again later.')            
        }
    })
    .then( () => {
        document.getElementById(`accordion${id}`).remove()    
    })
    .catch( e => {
        console.log('Catch', e)})
}

function generateAccordion(obj)
{
    const accordion = document.getElementById('accordionTemplate').cloneNode(true)
    accordion.setAttribute('id', `accordion${obj.id}`) 
    accordion.hidden = false

    const button = accordion.querySelector('button')
    button.setAttribute('data-bs-target', `#collapse${obj.id}`)
    button.setAttribute('aria-controls', `collapse${obj.id}`)
    switch(obj.status)
    {
        case 'In Progress':
            button.setAttribute('class', button.getAttribute('class')+' bg-primary-subtle')
            break;
        case 'Completed':
            button.setAttribute('class', button.getAttribute('class')+' bg-success-subtle')
            break;
        case 'On Hold':
            button.setAttribute('class', button.getAttribute('class')+' bg-warning-subtle')
            break;
        case 'Delayed':
            button.setAttribute('class', button.getAttribute('class')+' bg-danger-subtle')
            break;
    }

    const title = accordion.querySelector('#todotitleTemplate')
    title.setAttribute('id', `todotitle${obj.id}`)
    title.innerHTML = obj.title

    const status = accordion.querySelector('#todostatusTemplate')
    status.setAttribute('id', `todostatus${obj.id}`)
    status.innerHTML = obj.status

    const button2 = accordion.getElementsByTagName('button')[1]
    button2.setAttribute('data-bs-id', `${obj.id}`)

    const button3 = accordion.getElementsByTagName('button')[2]
    button3.setAttribute('onclick', `deleteTodo(${obj.id})`)

    const collapse = accordion.querySelector('#collapseTemplate')
    collapse.setAttribute('id', `collapse${obj.id}`)

    const description = accordion.querySelector('#tododescriptionTemplate')
    description.setAttribute('id', `tododescription${obj.id}`)
    description.innerHTML = obj.description

    return accordion
}

function createModal(event)
{
    const exampleModal = document.getElementById('todoModal')
    const id = event.relatedTarget.getAttribute('data-bs-id')
    const title = event.relatedTarget.getAttribute('data-bs-title')

    const modalTitle = exampleModal.querySelector('.modal-title')
    const modalid = exampleModal.querySelector('#todoid')
    const modalTodoTitle = exampleModal.querySelector('#inputTitle')
    const modalStatus = exampleModal.querySelector('#inputStatus')
    const modalTodoDesc = exampleModal.querySelector('#inputTextArea')
    const modalButton = exampleModal.querySelector('#inputButton')

    modalTitle.textContent = `${title} Todo`
    modalid.setAttribute('value', `${id}`)

    if(id > 0)
    {
        const todoItem = document.getElementById(`accordion${id}`)
        const todoTitle = todoItem.querySelector(`#todotitle${id}`).innerHTML
        const todoStatus = todoItem.querySelector(`#todostatus${id}`).innerHTML
        const todoDescription = todoItem.querySelector(`#tododescription${id}`).innerHTML

        modalTodoTitle.value = todoTitle
        modalStatus.value = todoStatus
        modalTodoDesc.value = todoDescription
        modalButton.innerHTML = 'Update'
    }
    else
    {
        modalTodoTitle.value = ''
        modalTodoDesc.value = ''
        modalButton.innerHTML = 'Create'
    }
}
