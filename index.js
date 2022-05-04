import { addEntryToDb, getEntryFromDb, deleteEntryFromDb, clearAllEntries } from "./database.js"

const addTodo = (e) => {
    e.preventDefault();
    addEntryToDb('todolist', todoInput.value);
    showTodoList(e);
    todoInput.value = null;
}

const deleteTodo = (e) => {
    e.preventDefault();
    const todoDelete = e.target.parentNode.parentNode.firstChild;
    deleteEntryFromDb('todolist', todoDelete.innerText)
        .then(() => showTodoList(e));
}

const showTodoList = async (e) => {
    if(e) e.preventDefault()

    todoListTag.innerHTML = ""

    const todoList = await getEntryFromDb('todolist')
    todoList.forEach((todo) => {
        // todoListTag.innerHTML += `
        // <li>
        //     <span class="list_name">${todo}</span>
        //     <input type="checkbox" name="checklist">
        //     <label for="checklist"></label>
        //     <button class="list_edit_btn"><i class="fa-solid fa-pencil"></i></button>
        //     <button class="list_delete_btn"><i class="fa-solid fa-trash-can"></i></button>
        // </li>`
        const todoItemElem = document.createElement("li");

        // const listNameElem = document.createElement("span");
        // listNameElem.classList.add("list_name");
        // listNameElem.innerHTML = todo;

        const checkboxElem = document.createElement("input");
        checkboxElem.setAttribute("type", "checkbox");
        checkboxElem.setAttribute("name", "checklist");
        // checkboxElem.addEventListener("click", completeTodo);
        // checkboxElem.innerText = '✔';

        // const checklistElem = document.createElement("label");
        // checklistElem.setAttribute("for", "chekclist");

        const editButtonElem = document.createElement("button");
        editButtonElem.classList.add("list_edit_btn");
        editButtonElem.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
        //editButtonElem.addEventListener("click", updateTodo);

        const deleteButtonElem = document.createElement("button");
        deleteButtonElem.classList.add("list_delete_btn");
        deleteButtonElem.addEventListener("click", deleteTodo);
        deleteButtonElem.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;

        todoItemElem.innerHTML += `<span class="list_name">${todo}</span>`;
        todoItemElem.appendChild(checkboxElem);
        todoItemElem.innerHTML += `<label for="checklist"></label>`;
        todoItemElem.appendChild(editButtonElem);
        todoItemElem.appendChild(deleteButtonElem);

        todoListTag.appendChild(todoItemElem);
    })
}

//const getListButton = document.querySelector('#buttonGetWordList')
const todoListTag = document.querySelector('#list_check')

const todoInput = document.querySelector('#todo')
const addTodoButton = document.querySelector('#todo_submit_btn')

// const deleteTodoButtons = document.querySelectorAll('.list_delete_btn')

//getListButton.addEventListener("click", showWordList)
addTodoButton.addEventListener("click", addTodo)
// deleteWordButtons.forEach((deleteWordButton) => {
//     deleteWordButton.addEventListener("click", deleteWord);
// })

export { showTodoList };