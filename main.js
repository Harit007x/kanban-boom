const form = document.querySelector("#task-form")
const todoLane = document.querySelector("#todo-lane")
const taskLanes = document.querySelectorAll(".tasks-lane")
const saveBtn = document.querySelector("#save");
const syncBtn = document.querySelector('#sync');

const todoArray = []
const doingArray = []
const doneArray = []

let source = null
let target = null

const stored = JSON.parse(localStorage.getItem('tasks'));

form.addEventListener('submit', (event) => {
    event.preventDefault()
    // console.log("clicked", event.target[0].value)

    // capturing the input value
    const task = event.target[0].value

    const div = document.createElement('div')
    const para = document.createElement('p')
    div.className = "task"
    para.innerText = task
    div.appendChild(para)

    div.setAttribute('draggable', 'true')
    div.addEventListener('dragstart', (event) => {
        div.classList.add('is-dragging')
        source = event.target.parentNode.id
        // console.log("drag start", event, source)
    })
    
    div.addEventListener('dragend', (event) => {
        div.classList.remove('is-dragging')
        target = event.target.parentNode.id
        // console.log("end = ", target)
    })

    todoLane.appendChild(div)    

    todoArray.push(task)
    event.target[0].value = ""
    // console.log(todoArray)
    
})

taskLanes.forEach(phase => {
    phase.addEventListener('dragover', (e) => {
        console.log("heyy")
        e.preventDefault();
        const bottomTask = closestSibling(phase, e.clientY);
        console.log("bpttpm,", bottomTask) 
        const currentTask = document.querySelector('.is-dragging');
        if (!bottomTask) {
            phase.appendChild(currentTask)
        } else {
          phase.insertBefore(currentTask, bottomTask);
        }
    })
});

saveBtn.addEventListener('click', () => {
    const tasks = JSON.stringify({
        todo: todoArray,
        doing: doingArray,
        done: doneArray
    });
    localStorage.setItem('tasks', tasks);
    alert('Successfully saved')
});

function recalculateTasksArr(task) {
    let sourceArr = [];
    let targetArr = [];

    if (source === "todo-lane") {
        sourceArr = [...todoItems];
    } else if (source === "doing-lane") {
        sourceArr = [...doingItems]
    } else {
        sourceArr = [...doneItems];
    }

    if (target === "todo-lane") {
        targetArr = [...todoItems];
    } else if (target === "doing-lane") {
        targetArr = [...doingItems]
    } else {
        targetArr = [...doneItems];
    }

    const taskIndex = sourceArr.findIndex((el) => el === task);
    sourceArr.splice(taskIndex,1);
    targetArr.push(task);

    if (source === "todo-lane") {
        todoItems = sourceArr;
    } else if (source === "doing-lane") {
        doingItems = sourceArr
    } else {
        doneItems = sourceArr;
    }

    if (target === "todo-lane") {
        todoItems = targetArr;
    } else if (target === "doing-lane") {
        doingItems = targetArr
    } else {
        doneItems = targetArr;
    }

    console.log(todoItems, doingItems, doneItems)
}


function closestSibling(phase, mouseY) {
    const els = phase.querySelectorAll(".task:not(.is-dragging)");
    let closestTask = null;
    let closestOffset = -100000000000000;

    els.forEach(task => {
        const {top} = task.getBoundingClientRect();
        console.log ("top",mouseY, top)
        const offset = (mouseY - top);
        console.log("off =", offset)
        if (offset < 0 ) {
            // closestOffset = offset;
            closestTask = task;
        }
    });
    return closestTask;
}