# Project - To Do List - MVC + JS Fetch 

The goal of this project was to create a Minimal API for a to-do list, and have a SPA (single-page application) interact with it via Javascript Fetch

The project is part of TheCSharpAcademy: https://thecsharpacademy.com/project/26

### Requirements

*    This is an application where you should manage a todo list.
*    Users should be able to Add, Delete, Update and Read from a database, using a SPA (single-page application). The user should never be redirected to a new page.
*    You need to use Entity Framework, raw SQL isn't allowed.
*    You don't need a navigation bar. No menu is necessary since you'll only have one page.
*    Once you execute any operation, the todo-list needs to be updated accordingly.
*    Your data model is only one table with to-dos. You. might be tempted to create more complex data-models (categories of todos for example) but avoid that for now. We're focusing on the front-end.

### Features of the project

*   Uses InMemory Database for simplicity of testing (non-permanent)
*   Creates a minimal API following this [tutorial](https://learn.microsoft.com/en-us/aspnet/core/tutorials/min-web-api?view=aspnetcore-8.0&tabs=visual-studio)
*   Uses Bootstrap for nicer styling
*   Doesn't allow blank entry for description on add or edit
