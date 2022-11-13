$(document).ready(onReady);

let showComplete = true;
let sortOrder = 'dateAsc'; // default sort order, switch statement on router uses this to determine query SORT BY
let mode = 'new'; // two modes, 'new' and 'edit', sets default to new
let editStatus;

function onReady() {
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
    $('#taskListDiv').on('click', '.editButton', editTask);
    $('#hideButton').on('click', hideCompleted);
    $('#showButton').on('click', showCompleted);
    $('#cancelButton').on('click', getTasks)
    $('.sort-button').on('click', sortTasks);
};

function showCompleted() { // used for filtering out completed tasks
    $('.onHide').show();
    $('.onShow').hide();
    showComplete = true;
};

function hideCompleted() { // used for filtering out completed tasks
    $('.onHide').hide();
    $('.onShow').show();
    showComplete = false;
};

function sortTasks() { // sets query SORT BY variable and sends to server via getTasks
    sortOrder = $(this).data('id');
    getTasks();
}

// Sets page up for editing task
// hides all tasks, sets input fields to the values of task being edited
function editTask() {
    $('#ownerInput').val($(this).parent().siblings(':first-child').data('owner'));
    $('#dateInput').val($(this).parent().siblings(':nth-child(2)').data('date'));
    $('#taskDescriptionInput').val($(this).parent().siblings(':nth-child(5)').data('details'));
    mode = 'edit';
    editStatus = $(this).data('id');
    $('.taskItem').hide();
    $('.hide').show();
    $('.show').hide();
    $('#cancelButton').show();
    $('#hideButton').hide();
    $('#showButton').hide();
}

// GET tasks from database
function getTasks() {
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

    // sets input values to object variable for sending to server
    let newTask = {
        owner: $('#ownerInput').val(),
        date: $('#dateInput').val(),
        details: $('#taskDescriptionInput').val(),
        is_complete: false
    };


// checks if we are in edit task mode. If we are,
// do a PUT API instead
    if (mode === 'edit') {
        $.ajax({
            method: 'PUT',
            url: '/tasks/edit/' + editStatus,
            data: newTask
        }).then(function(response) {
            getTasks();
        }).catch(function (error) {
            alert('error POSTing', error);
        });
    } else {
        $.ajax({
            method: 'POST',
            url: '/tasks',
            data: newTask
        }).then(function(response) {
            $('#ownerInput').val('');
            $('#dateInput').val('');
            $('#taskDescriptionInput').val('');
            getTasks();
        }).catch(function (error) {
            alert('error POSTing', error);
        });
    };
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

    // object to send to server
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
    // resets elements and mode to match initial page load
    $('#taskListDiv').empty();
    $('#ownerInput').val('');
    $('#dateInput').val('');
    $('#taskDescriptionInput').val('');
    $('#cancelButton').hide();
    $('#hideButton').show();
    mode = 'new';

    // renders a new div for each task item
    for (let task of tasks) {
        $('#taskListDiv').append(`
            <div class="shadow mb-2 taskItem ${task.is_complete === true ? 'onHide' : ''}">
                <h4 data-owner="${task.owner}">Owner: ${task.owner}</h4>
                <section data-date="${task.f_date}"><span class="lead">Date Required Complete: </span>${task.f_date}</section>
                <section><span class="lead">Task Status: </span>${task.is_complete == true ? 'Completed' : 'Not Complete'}</section>
                <section class="${task.completed_on ? 'show' : 'hide'}"><span class="lead">Completed On: </span>${task.completed_on}</section>
                <section data-details="${task.details}"><span class="lead">Details: </span>${task.details}</section>
                <p class="mt-3 mb-3">
                    <button class="btn btn-secondary btn-sm completeButton" data-id="${task.id}" data-complete="${task.is_complete}">${task.is_complete === true ? 'Undo Complete' : 'Mark Completed'}</button>
                    <button class="btn btn-warning btn-sm editButton" data-id=${task.id}>Edit</button>
                    <button class="btn btn-danger btn-sm deleteButton" data-id="${task.id}">Delete</button>
                </p>
            </div>            
        `);
    };

    $('.hide').hide();
    $('.show').show();
    (showComplete ? showCompleted() : hideCompleted()); // hides or shows completed each time it renders to match users selected preference

};