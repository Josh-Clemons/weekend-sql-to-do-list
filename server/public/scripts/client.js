$(document).ready(onReady);

function onReady() {
    console.log('jquery loaded');
    getTasks();
    clickListeners();
}

function clickListeners() {
    $('#submitButton').on('click', postTask);
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

function postTask() {
    // console.log('in postTask');
    let newTask = {
        owner: $('#ownerInput').val(),
        date: $('#dateInput').val(),
        details: $('#taskDescriptionInput').val()
    }

    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: newTask
    }).then(function(response) {
        console.log('post success response', response);
    }).catch(function (error) {
        alert('error POSTing', error);
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
                <td><button>Complete</button></td>
                <td><button>Delete</button></td>
            </tr>
        `);
    };
};