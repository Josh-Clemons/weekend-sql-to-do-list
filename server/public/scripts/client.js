$(document).ready(onReady);

function onReady() {
    console.log('jquery loaded');
    getTasks();
    clickListeners();
}

function clickListeners() {
    $('#submitButton').on('click', postTask);
    $('#taskTableBody').on('click', '.deleteButton', deleteTask);
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
        getTasks()
    }).catch(function (error) {
        alert('error POSTing', error);
    });
};

// DELETE task from database
function deleteTask() {
    let taskId = $(this).data('id');

    $.ajax({
        method: 'DELETE',
        url: 'tasks/' + taskId
    }).then(function (){
        getTasks();
    }).catch(function (error) {
        alert('error DELETEing task', error);
    });
};

function renderTable(tasks) {
    $('#taskTableBody').empty();

    for (let task of tasks) {
        $('#taskTableBody').append(`
            <tr>
                <td>${task.owner}</td>
                <td>${task.date}</td>
                <td>${task.details}</td>
                <td>${task.is_complete}</td>
                <td><button data-id="${task.id}">Complete</button></td>
                <td><button class="deleteButton" data-id="${task.id}">Delete</button></td>
            </tr>
        `);
    };
};