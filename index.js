"use strict";

function saveItem(itemName, item) {
  const saveItemStore = JSON.stringify(item);

  localStorage.setItem(itemName, saveItemStore);
}

//LIGHT AND DARK MODE
const modeIcon = document.querySelectorAll(".mode-icon");
const body = document.querySelector("body");
let lightMode = {
  lightModeOn: true,
};

for (const icon of modeIcon) {
  icon.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      lightMode.lightModeOn = false;
    } else if (!body.classList.contains("dark-mode")) {
      lightMode.lightModeOn = true;
    }
    saveItem("mode", lightMode);
  });
}

function loadDarkMode() {
  const savedMode = JSON.parse(localStorage.getItem("mode"));
  if (!savedMode.lightModeOn) {
    body.classList.add("dark-mode");
  }
}

//CREATE TO DO ITEM
const todoInput = document.querySelector("#item-todo");
const todoList = document.querySelector(".todo-items-list");
let todoListStore = JSON.parse(localStorage.getItem("todo-list"));

if (todoListStore === null || todoListStore.length === 0) {
  todoListStore = [];
}

function addToDoItem(item) {
  const todoListEl = `
  <div class="todo-item">
    <span class="check-todo">
      <img class="check-icon" src="images/done_FILL0_wght400_GRAD0_opsz24.svg" />
    </span>
    <p class="todo-name">${item}</p>
    <img
      class="delete-todo"
      alt="delete-item-icon"
      src="images/close_FILL1_wght100_GRAD-25_opsz24.svg"
    />
  </div>`;

  todoList.insertAdjacentHTML("beforeend", todoListEl);
}

function updateToDoList(item) {
  todoListStore.push(item);
  saveItem("todo-list", todoListStore);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && todoInput.value !== "" && todoInput.value !== " ") {
    const todoItem = `${todoInput.value[0].toUpperCase()}${todoInput.value
      .slice(1)
      .toLowerCase()}`;
    updateToDoList(todoItem);
    loadTodoList(todoListStore);
    todoInput.value = "";
  }
});

//DELETE TODO ITEM
function resetTodoList() {
  let listEl = document.getElementById("todo-items-list");

  listEl.innerHTML = "";
}

function deleteTodoItem() {
  let closeBtnEl = document.querySelectorAll(".delete-todo");
  let todoItemListEl = document.querySelectorAll(".todo-name");
  let closeBtn = [...closeBtnEl];
  let todoItemList = [...todoItemListEl];

  closeBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      resetTodoList();
      const btnIndex = closeBtn.indexOf(btn);
      const itemDelete = todoItemList[btnIndex].textContent;
      const itemDeleteIndex = todoListStore.indexOf(itemDelete);
      todoListStore.splice(itemDeleteIndex, 1);
      saveItem("todo-list", todoListStore);
      loadTodoList(todoListStore);
    });
  });
}

//CHECK ITEMS COMPLETED
let completedTodo = JSON.parse(localStorage.getItem("completedTodo"));

if (completedTodo === null || completedTodo.length === 0) {
  completedTodo = [];
}

function checkTodo() {
  const checkItems = document.getElementsByClassName("todo-item");
  const checkItemsArr = [...checkItems];
  const checkEl = document.getElementsByClassName("check-todo");
  const checkBtns = [...checkEl];

  function loadCompletedItem() {
    completedTodo.forEach((i) => {
      checkItemsArr[i].classList.add("checked-todo-item");
    });
  }

  loadCompletedItem();

  function showCompletedNum() {
    const completedItemsEl = document.querySelector(".num-items-completed");
    completedItemsEl.textContent = completedTodo.length;
  }

  showCompletedNum();

  function showItemsLeft() {
    const itemsLeftEl = document.querySelector(".num-items-left");
    itemsLeftEl.textContent = checkItemsArr.length - completedTodo.length;
  }

  showItemsLeft();

  for (const checkBtn of checkBtns) {
    checkBtn.addEventListener("click", () => {
      const checkBtnIndex = checkBtns.indexOf(checkBtn);
      checkItemsArr[checkBtnIndex].classList.toggle("checked-todo-item");

      if (
        checkItemsArr[checkBtnIndex].classList.contains("checked-todo-item")
      ) {
        completedTodo.push(checkBtnIndex);
      } else if (
        !checkItemsArr[checkBtnIndex].classList.contains("checked-todo-item") &&
        completedTodo.includes(checkBtnIndex)
      ) {
        const btnRemoveIndex = completedTodo.indexOf(checkBtnIndex);
        completedTodo.splice(btnRemoveIndex, 1);
      }
      showCompletedNum();
      showItemsLeft();
      saveItem("completedTodo", completedTodo);
    });
  }
}

//CLEAR COMPLETED
const clearBtn = document.querySelector(".clear-completed");
function clearCompleted() {
  completedTodo.forEach((item) => {
    todoListStore.splice(item, 1);
    completedTodo = [];
  });
  saveItem("completedTodo", completedTodo);
  saveItem("todo-list", todoListStore);
  try {
    loadTodoList(todoListStore);
  } catch {}
}

clearBtn.addEventListener("click", clearCompleted);

//SWITCH TABS
const allTabs = document.querySelectorAll(".menu-item");
const tabs = [...allTabs];

function switchTab(tabBtn) {
  const i = tabs.indexOf(tabBtn);
  const numTabs = [];
  tabs.forEach((tab) => {
    numTabs.push(tabs.indexOf(tab));
  });

  numTabs.forEach((num) => {
    if (num === i) {
      tabs[num].classList.add("current-tab");
    } else {
      tabs[num].classList.remove("current-tab");
    }
  });

  const todoBox = document.querySelector(".todo-items");
  if (switchedTab === true) {
    todoBox.classList.add("switched-tab");
  } else {
    todoBox.classList.remove("switched-tab");
  }
}

//GET ALL
const allBtn = document.querySelector(".all-btn");
let switchedTab = false;
function getAllItems() {
  try {
    loadTodoList(todoListStore);
  } catch {}

  switchedTab = false;
  switchTab(allBtn);
}

allBtn.addEventListener("click", getAllItems);

//GET COMPLETED
const completedBtn = document.querySelector(".completed-btn");
function getCompleteItems() {
  const completeItems = [];
  completedTodo.forEach((i) => {
    completeItems.push(todoListStore[i]);
  });
  try {
    loadTodoList(completeItems);
  } catch {}

  switchedTab = true;
  switchTab(completedBtn);
}

completedBtn.addEventListener("click", getCompleteItems);

//GET ACTIVE
const activeBtn = document.querySelector(".active-btn");
function getActiveItems() {
  const allItems = [...todoListStore];
  completedTodo.forEach((i) => {
    allItems.splice(i, 1);
  });
  try {
    loadTodoList(allItems);
  } catch {}

  switchedTab = true;
  switchTab(activeBtn);
}

activeBtn.addEventListener("click", getActiveItems);

function loadTodoList(todoItems) {
  resetTodoList();
  for (const item of todoItems) {
    addToDoItem(item);
  }
  checkTodo();
  deleteTodoItem();
}

document.addEventListener("DOMContentLoaded", () => {
  loadDarkMode();
  try {
    loadTodoList(todoListStore);
  } catch {}
});
