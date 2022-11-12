$(document).ready(onReady);

let showComplete = true;

function onReady() {
    console.log('jquery loaded');
    getTasks();
    clickListeners();
}

function clickListeners() {
    $('#submitButton').on('click', function() { // confirms fields have data before running POST
        if ($('#ownerInput').val() && $('#dateInput').val() && $('#taskDescriptionInput').val()) {
            postTask();
        } else {
            alert('Complete Missing Fields');
        }
    });
    $('#taskListDiv').on('click', '.deleteButton', deleteTask);
    $('#taskListDiv').on('click', '.completeButton', completeTask);
    $('#hideButton').on('click', hideCompleted);
    $('#showButton').on('click', showCompleted);

    // testing date field to verify data for sql
    // $('#dateInput').on('change', function () {console.log($(this).val());})
};

function showCompleted() {
    $('.onHide').show();
    $('.onShow').hide();
    showComplete = true;
}

function hideCompleted() {
    $('.onHide').hide();
    $('.onShow').show();
    showComplete = false;
}

// GET tasks from database
function getTasks() {
    // console.log('in getTasks');
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
        // console.log('post success response', response);
        $('#ownerInput').val('');
        $('#dateInput').val('');
        $('#taskDescriptionInput').val('');
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
            <div class="taskItem ${task.is_complete === true ? 'onHide' : ''}">
                <h4>Owner: ${task.owner}</h4>
                <section><span>Date Required Complete: </span>${task.f_date}</section>
                <section><span>Task Status: </span>${task.is_complete == true ? 'Completed' : 'Not Complete'}</section>
                <p><span>Details: </span>${task.details}</p>
                <p>
                    <button class="btn btn-secondary completeButton" data-id="${task.id}" data-complete="${task.is_complete}">${task.is_complete === true ? 'Undo Complete' : 'Mark Completed'}</button>
                    <button class="btn btn-danger deleteButton" data-id="${task.id}">Delete</button>
                </p>
            </div>            
        `);
    };

    (showComplete ? showCompleted() : hideCompleted());

};


            // <tr>
            //     <td>${task.owner}</td>
            //     <td>${task.date}</td>
            //     <td>${task.details}</td>
            //     <td>${task.is_complete}</td>
            //     <td><button class="completeButton" data-id="${task.id}" data-complete="${task.is_complete}">Complete</button></td>
            //     <td><button class="deleteButton" data-id="${task.id}">Delete</button></td>
            // </tr>