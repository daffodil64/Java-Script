// ============================================
// Load data using fetch()
// ============================================

function loadUsingFetch() {

    fetch("students-fetch.json")

        .then(response => response.json())

        .then(data => {

            displayData(data);

        })

        .catch(error => {

            console.error("Fetch Error:", error);

        });
}


// ============================================
// Load data using jQuery $.getJSON()
// ============================================

function loadUsingJQuery() {

    $.getJSON("students-jquery.json")

        .done(function(data) {

            displayData(data);

        })

        .fail(function(error) {

            console.error("jQuery Error:", error);

        });
}


// ============================================
// Display data in table
// ============================================

function displayData(data) {

    let tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = "";

    data.forEach(function(student) {

        let row = `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.course}</td>
                <td>${student.marks}</td>
            </tr>
        `;

        tableBody.innerHTML += row;

    });
}