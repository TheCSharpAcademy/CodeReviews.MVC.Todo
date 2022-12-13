# Todo MVC & Javascript

## Featuring

- SQLite database
- Entity FrameworkCore
- C# and JS
- Serilog
- MVC

## Requirements

- [x] Users should be able to Add, Delete, Update and Read from a database, using a SPA (single-page application). The user should never be redirected to a new page.
- [x] You need to use Entity Framework, raw SQL isn't allowed.
- [x] You don't need a navigation bar. No menu is necessary since you'll only have one page.
- [x] Once you execute any operation, the todo-list needs to be updated accordingly.
- [x] Your data model is only one table with to-dos. 

## Features

- The app features working CRUD functionality.
    - To add a todo - Click the "Create New" button, a form will appear, fill out the form and click add. The todoList will update with your new todo included.
    - All Todos are displayed by default. Checked/Completed Todos are displayed underneith unchecked ones and are greyed out.
    - To Update a todo - 
        - Click the pen button to the right hand side and the focus will automatically be put onto the corresponding inputbox. 
        - When focus is lost, the edit mode will be cancelled and the todo will be displayed as normal
        - Click the tick icon to confirm the change and then the todoList will display a new list with the change incuded.
        - The checkbox for the todo that is being edited will be disabled during editing.
    - To Delete a todo -
        - Click the bin icon next to the edit icon.

## How would I update it

If I continued working on flashcards I would start with the following to improve it:

- Add a search box to filer Todos.
- Fully implemened Due Date.
- Be able to sort by each column.
- Remove Todos from the list into their own archived list.

## Resources Used:

- ReadMe file based on [thags](https://github.com/thags/ConsoleTimeLogger/blob/master/README.md)

- Project based on the TodoList project by [thecsharpacademy](https://www.thecsharpacademy.com/project/26)

- Discord community for bug finding

- Serilog NuGet Package - [NuGet Gallery | Serilog 2.12.1-dev-01587](https://www.nuget.org/packages/Serilog/2.12.1-dev-01587)
