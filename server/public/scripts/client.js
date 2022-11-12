$(document).ready(onReady);

function onReady() {
    console.log('jquery loaded');
    getTasks();
    clickListeners();
}

function clickListeners() {
    $('#submitButton').on('click', postTask);
    $('#taskListDiv').on('click', '.deleteButton', deleteTask);
    $('#taskListDiv').on('click', '.completeButton', completeTask);
};


// GET tasks from database
function getTasks() {
    console.log('in getTasks');
    $.ajax({
        method: 'GET',
        url: '/tasks'
    }).then(function(response) {
        renderTable(response.rows);
    }).catch(function(error) {
        alert('error GETting tasks', error);
    });
};

// POST new task to sever/database
function postTask() {
    // console.log('in postTask');
    let newTask = {
        owner: $('#ownerInput').val(),
        date: $('#dateInput').val(),
        details: $('#taskDescriptionInput').val(),
        is_complete: false
    };

    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: newTask
    }).then(function(response) {
        console.log('post success response', response);
        getTasks();
    }).catch(function (error) {
        alert('error POSTing', error);
    });
};

// PUT to update task as complete
function completeTask() {
    let isComplete = $(this).data('complete');
    let taskId = $(this).data('id');

    $.ajax({
        method: 'PUT',
        url: '/tasks/complete/' + taskId,
        data: {
            isComplete : isComplete
        }
    }).then(function(response) {
        getTasks();
    }).catch(function(error) {
        alert('error updating task', error);
    });
};


// DELETE task from database
function deleteTask() {
    let taskId = $(this).data('id');

    $.ajax({
        method: 'DELETE',
        url: '/tasks/' + taskId
    }).then(function (){
        getTasks();
    }).catch(function (error) {
        alert('error DELETEing task', error);
    });
};

function renderTable(tasks) {
    $('#taskListDiv').empty();

    for (let task of tasks) {
        $('#taskListDiv').append(`
            <div class="taskItem">
                <h4>Owner: ${task.owner}</h4>
                <section>Date Required Complete: ${task.date}</section>
                <section>Task Status: ${task.is_complete == true ? 'Completed' : 'Not Complete'}</section>
                <p>
                    <button class="completeButton" data-id="${task.id}" data-complete="${task.is_complete}">Complete</button>
                    <button class="deleteButton" data-id="${task.id}">Delete</button>
                </p>
                <p>${task.details}</p>
            </div>            
        `);
    };
};


            // <tr>
            //     <td>${task.owner}</td>
            //     <td>${task.date}</td>
            //     <td>${task.details}</td>
            //     <td>${task.is_complete}</td>
            //     <td><button class="completeButton" data-id="${task.id}" data-complete="${task.is_complete}">Complete</button></td>
            //     <td><button class="deleteButton" data-id="${task.id}">Delete</button></td>
            // </tr>