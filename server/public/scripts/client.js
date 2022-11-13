$(document).ready(onReady);

let showComplete = true;
let sortOrder = 'dateAsc';

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
            Swal.fire({
                position: 'top',
                title: 'Complete all fields!'});
        };
    });
    $('#taskListDiv').on('click', '.deleteButton', deleteTask);
    $('#taskListDiv').on('click', '.completeButton', completeTask);
    $('#hideButton').on('click', hideCompleted);
    $('#showButton').on('click', showCompleted);
    $('.sort-button').on('click', sortTasks);

    // testing date field to verify data for sql
    // $('#dateInput').on('change', function () {console.log($(this).val());})
};

function showCompleted() {
    $('.onHide').show();
    $('.onShow').hide();
    showComplete = true;
};

function hideCompleted() {
    $('.onHide').hide();
    $('.onShow').show();
    showComplete = false;
};

function sortTasks() {
    sortOrder = $(this).data('id');
    getTasks();
}

// GET tasks from database
function getTasks() {
    // console.log('in getTasks');
    $.ajax({
        method: 'GET',
        url: '/tasks/' + sortOrder
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
    let dateStamp;

    if (!isComplete) { // if task is not completed, when complete button is clicked a date is assigned to datestamp
        dateStamp = new Date();
        let dd = String(dateStamp.getDate()).padStart(2, '0');
        let mm = String(dateStamp.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = dateStamp.getFullYear();
        dateStamp = mm + '/' + dd + '/' + yyyy;
    };

    let postObject = {
        isComplete: isComplete,
        dateStamp: dateStamp
    };
    // console.log('postObject', postObject);

    $.ajax({
        method: 'PUT',
        url: '/tasks/complete/' + taskId,
        data: postObject
    }).then(function(response) {
        getTasks();
    }).catch(function(error) {
        alert('error updating task', error);
    });
};


// DELETE task from database
function deleteTask() {
    let taskId = $(this).data('id');

    Swal.fire({
        title: 'Are you sure you want to delete?',
        showDenyButton: true,
        confirmButtonText: 'Delete',
        icon: 'warning'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: 'DELETE',
                url: '/tasks/' + taskId
            }).then(function (){
                getTasks();
            }).catch(function (error) {
                alert('error DELETEing task', error);
            });
        } else {
            return;
        }
    })

        

    
};

function renderTable(tasks) {
    
    $('#taskListDiv').empty();

    for (let task of tasks) {
        // console.log('task object', task);
        $('#taskListDiv').append(`
            <div class="shadow mb-2 taskItem ${task.is_complete === true ? 'onHide' : ''}">
                <h4>Owner: ${task.owner}</h4>
                <section><span class="lead">Date Required Complete: </span>${task.f_date}</section>
                <section><span class="lead">Task Status: </span>${task.is_complete == true ? 'Completed' : 'Not Complete'}</section>
                <section class="${task.completed_on ? 'show' : 'hide'}"><span class="lead">Completed On: </span>${task.completed_on}</section>
                <section><span class="lead">Details: </span>${task.details}</section>
                <p class="mt-3 mb-3">
                    <button class="btn btn-secondary completeButton" data-id="${task.id}" data-complete="${task.is_complete}">${task.is_complete === true ? 'Undo Complete' : 'Mark Completed'}</button>
                    <button class="btn btn-danger deleteButton" data-id="${task.id}">Delete</button>
                </p>
            </div>            
        `);
    };

    $('.hide').hide();
    $('.show').show();
    (showComplete ? showCompleted() : hideCompleted());

};