document.addEventListener("DOMContentLoaded", () => {
  const task = JSON.parse(localStorage.getItem("task"));
  if (task) {
    task.forEach((task) => {
      taskArray.push(task);
    });
    UpdateList();
  }
});

const saveToLocal = () => {
  localStorage.setItem("task", JSON.stringify(taskArray));
};

let taskArray = [];
let temp = [];
let actualArray;
let dragStartIndex;
let addTaskBtn = document.getElementById("addTaskBtn");

let clearBtn = document.getElementById("Clear_task");

clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  taskArray = [];
  UpdateList();
  saveToLocal();
});

addTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!addTaskBtn.classList.contains("pause")) addTask();
  else alert("Save the Task First");
});

const addTask = () => {
  let taskField = document.getElementById("task-value");
  let discritpionField = document.getElementById("task-discription");
  let task = taskField.value.trim();
  let discription = discritpionField.value.trim();

  if (task) {
    taskArray.push({ task, discription, completed: false });
    taskField.value = "";
    discritpionField.value = "";
    UpdateList();
    saveToLocal();
  }
};

const UpdateList = () => {
  const TaskList = document.getElementById("draggable-list");
  TaskList.innerHTML = "";
  taskArray.forEach((task, index) => {
    const taskItem = document.createElement("li");
    taskItem.setAttribute("data-index", index);
    taskItem.innerHTML = `
            <div class="draggable  ${
              taskArray[index].completed ? "InActive" : ""
            }" draggable = "true">
            <div class="taskNumber">
            <span class="Number">${index + 1}</span>
            </div>
            <div class = "checkBox">
             <input  type="checkbox" ${
               taskArray[index].completed ? "checked" : ""
             } class ="checkBox">
             </div>
             <div class="InputField">
             <h4>Task:</h4>
                   <span class="task-value">${task.task}</span>
              <h4>Discripton:</h4>     
                    <span  class="discripton-value">${task.discription}</span>
                    </div>    
                    <div class="editDeleteBtn">
                    <button class="edit" value="edit" onClick="Edit(${index})"> Edit </button>
                    <button class="delete" value="delete" onClick="Delete(${index})"> Delete </button>
                    </div>
                    </div>
                    `;
    taskItem.addEventListener("change", () => checkerUpdate(index));
    TaskList.append(taskItem);
  });
  addEventListeners();
};

const checkerUpdate = (index) => {
  taskArray[index].completed = !taskArray[index].completed;
  UpdateList();
  saveToLocal();
};

const Delete = (index) => {
  taskArray.splice(index, 1);
  UpdateList();
  saveToLocal();
};

const Edit = (index) => {
  if (!taskArray[index].completed) {
    temp = taskArray;
    actualArray = taskArray;
    taskArray = [];
    addTaskBtn.classList.add("pause");
    const TaskList = document.getElementById("draggable-list");
    TaskList.innerHTML = "";
    temp.forEach((task, num) => {
      if (num == index) {
        const taskItem = document.createElement("li");

        taskItem.innerHTML = `
            <div class="draggable" draggable = "true">
              <div class="taskNumber">
                     <span class="Number">${num + 1}</span>
              </div>
              <div class="EditInputField">
                     <input type="text" value="${
                       task.task
                     }" id="eTask" class="eTask" placeholder="Task">
                     <input type="text" value="${
                       task.discription
                     }" id="eDiscription" class="eDiscription" placeholder="Discription">
              </div>
              <div class="saveBtn">
                     <button class="editBtn" value="edit" onClick="Save(${num})"> save </button>
              </div>
             </div>
                     `;
        TaskList.append(taskItem);
      } else {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
            <div class="draggable InActive">
              <div class="taskNumber">
                     <span class="Number">${num + 1}</span>
              </div>
              <div class = "checkBox">
              <input type="checkbox" ${
                temp[num].completed ? "checked" : ""
              } class ="checkBox">
                   </div>
                   <div class="InputField">
                   <h4>Task:</h4> 
                  <span class="task-value">${task.task}</span>
                  <h4>Discripton:</h4> 
                  <span  class="discripton-value">${task.discription}</span>
                   </div>

                    <div class="editDeleteBtn">
                    <button class="edit" value="edit" > Edit </button>
                    <button class="delete" value="delete"> Delete </button>
                    </div> 
                    </div>
                    `;
        TaskList.append(taskItem);
        taskItem.addEventListener("change", () => EditcheckerUpdate(num));
      }
    });
  } else {
    alert("Can not Edit Completed task ");
  }
};

const Save = (x) => {
  const task = document.getElementById("eTask").value;
  const discription = document.getElementById("eDiscription").value;
  actualArray[x].task = task;
  actualArray[x].discription = discription;
  addTaskBtn.classList.remove("pause");
  taskArray = actualArray;
  temp = [];
  UpdateList();
  saveToLocal();
};

//Edit Check Updater
const EditcheckerUpdate = (index) => {
  temp[index].completed = !temp[index].completed;
};

//Drag and Drop
const addEventListeners = () => {
  const draggable = document.querySelectorAll(".draggable");
  const dragListItems = document.querySelectorAll(".draggable-list li");
  draggable.forEach((draggable) => {
    draggable.addEventListener("dragstart", dragStart);
  });
  dragListItems.forEach((item) => {
    item.addEventListener("dragover", dragOver);
    item.addEventListener("dragleave", dragLeave);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("drop", dragDrop);
  });
};

function dragStart() {
  dragStartIndex = +this.closest("li").getAttribute("data-index");
}
function dragOver(e) {
  e.preventDefault();
  this.classList.add("over");
}
function dragLeave() {
  console.log(this);
  this.classList.remove("over");
}
function dragEnter() {
  this.classList.add("over");
}
function dragDrop() {
  const dragEndIndex = this.getAttribute("data-index");
  swapItems(dragStartIndex, dragEndIndex);
}

function swapItems(fromIndex, toIndex) {
  let t;
  t = taskArray[fromIndex];
  taskArray[fromIndex] = taskArray[toIndex];
  taskArray[toIndex] = t;
  UpdateList();
  saveToLocal();
}
