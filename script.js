var selectedRow = null

window.onload = function(){
    let roleId = localStorage.getItem("roleId");
    if(roleId == 1){
        document.getElementById("userBtn").style.display = "inline-block";
        document.getElementById("reportBtn").style.display = "inline-block";
        document.getElementById("reports").style.display = "inline-block";
    }
}

function readUserData() {
    console.log("userId from local storage", localStorage.getItem("userId"));
    // Call api to get users data
    const apiUrl = 'http://localhost:5039/api/UserRegistration/getalluser'; // Example API endpoint

    fetch(apiUrl)
    .then(response => {
        // Check if the request was successful (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the JSON response body
        return response.json();
    })
    .then(data => {
        console.log('Fetched data:', data);
        const dropdown = document.getElementById("user_dropdown");
        var table = document.getElementById("userList").getElementsByTagName('tbody')[0];
        for(let i = 0; i < data.length; i++)
        {
            var newRow = table.insertRow(i);
            cell1 = newRow.insertCell(0);
            cell1.innerHTML = data[i].userId;
            cell2 = newRow.insertCell(1);
            cell2.innerHTML = data[i].firstName + data[i].lastName;
            cell3 = newRow.insertCell(2);
            cell3.innerHTML = data[i].email;
            cell4 = newRow.insertCell(3);
            cell4.innerHTML = data[i].roleId;
            cell5 = newRow.insertCell(4);
            cell5.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                            <a onClick="onDelete(this)">Delete</a>`;

            const option = document.createElement('option');
            option.value = data[i].userId; // Assuming 'id' is the value you want to assign
            option.textContent = data[i].firstName +" "+ data[i].lastName; // Assuming 'name' is the text to display
            dropdown.appendChild(option);
        }
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch operation
        console.error('Error fetching data:', error);
    });
}

function readReportsData(reportListName) {
    const apiUrl = 'http://localhost:5039/api/Reports/getreports?userId=' + localStorage.getItem("userId");

    fetch(apiUrl)
   .then(response => {
        
        if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        var table = document.getElementById(reportListName).getElementsByTagName('tbody')[0];
        for(let i = 0; i < data.length; i++)
        {
            var newRow = table.insertRow(i);
            cell1 = newRow.insertCell(0);
            cell1.innerHTML = data[i].name;
            cell2 = newRow.insertCell(1);
            cell2.innerHTML = data[i].description;
            cell3 = newRow.insertCell(2);
            cell3.innerHTML = `<a href="${data[i].link}" target="_blank">${data[i].link}</a>`; //data[i].link;
            cell4 = newRow.insertCell(3);
            cell4.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                                <a onClick="onDelete(this)">Delete</a>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function onSubmitCreateUser() {
    let data = {};
    data["email"] = document.getElementById("email").value;
    data["password"] = document.getElementById("password").value;
    data["firstName"] = document.getElementById("firstName").value;
    data["lastName"] = document.getElementById("lastName").value;
    data["roleId"] = document.getElementById("role").value;
    
    const apiUrl = "http://localhost:5039/api/UserRegistration/createuser";
    fetch(apiUrl, {
    method: 'POST', // Specify the HTTP method as POST
    headers: {
        'Content-Type': 'application/json', // Indicate the content type of the request body
    },
    body: JSON.stringify(data), // Convert the data object to a JSON string
    })
    .then(response => {
        if (!response.ok) {
        // Handle HTTP errors (e.g., 404, 500)
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json(); // Parse the JSON response
    })
    .then(responseData => {
        // Process the successful response data
        alert("Data Saved Successfully: ");
    })
    .catch(error => {
        // Handle network errors or errors thrown during response processing
        console.error('Error:', error);
    });

    return true;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("fullName").value = selectedRow.cells[0].innerHTML;
    document.getElementById("email").value = selectedRow.cells[1].innerHTML;
    document.getElementById("salary").value = selectedRow.cells[2].innerHTML;
}

function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.fullName;
    selectedRow.cells[1].innerHTML = formData.email;
    selectedRow.cells[2].innerHTML = formData.salary;
    selectedRow.cells[3].innerHTML = formData.city;
}

function onSubmitAddReport(){
    const apiUrl = 'http://localhost:5039/api/reports/addreport';
    const postData = {
        reportName: document.getElementById("reportName").value,
        link: document.getElementById("reportLink").value,
        description : document.getElementById("reportDescription").value,
        userId : document.getElementById("user_dropdown").value
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData) // Convert JavaScript object to JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        isValid = true;
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert("Reports Added Successfully");
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Please Enter Valid Username and Password");
        isValid = false;
    });
}

function onDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        // row = td.parentElement.parentElement;
        //    //get the array of all cells in that row 
        // var cells     = row.getElementsByTagName("td");
        // var textfield = cells[1].getElementsByTagName("input")[0]; 
        // alert(row.cell1);
        // alert(row.getElementsByTagName("td"));
        // alert(textfield);
        //document.getElementById("employeeList").deleteRow(row.rowIndex);
        //resetForm();
    }
}

function onClickUserData(){
    readUserData();
    document.getElementById("createUserBtn").style.display = "block";
    document.getElementById("userRegistration").style.display = "none";
    document.getElementById("report_table").style.display = "none";
    document.getElementById("user_table").style.display = "block";
    document.getElementById("addReportBtn").style.display = "none";
    document.getElementById("addReportForm").style.display = "none";
}

function onClickReportsManagement(){
    readReportsData("reportList");
    document.getElementById("addReportForm").style.display = "none";
    document.getElementById("createUserBtn").style.display = "none";
    document.getElementById("addReportBtn").style.display = "block";
    document.getElementById("userRegistration").style.display = "none";
    document.getElementById("user_table").style.display = "none";
    document.getElementById("report_table").style.display = "block";
}

function onClickReportsData(){
    readReportsData("reportListByUser");
    document.getElementById("addReportForm").style.display = "none";
    document.getElementById("createUserBtn").style.display = "none";
    document.getElementById("addReportBtn").style.display = "none";
    document.getElementById("userRegistration").style.display = "none";
    document.getElementById("user_table").style.display = "none";
    document.getElementById("report_table").style.display = "block";
}

function onClickCreateUser(){
    document.getElementById("addReportForm").style.display = "none";
    document.getElementById("createUserBtn").style.display = "none";
    document.getElementById("report_table").style.display = "none";
    document.getElementById("user_table").style.display = "none";
    document.getElementById("userRegistration").style.display = "block";
}

function onClickAddReport(){
    readUserData();
    document.getElementById("addReportBtn").style.display = "none";
    document.getElementById("report_table").style.display = "none";
    document.getElementById("user_table").style.display = "none";
    document.getElementById("userRegistration").style.display = "none";
    document.getElementById("addReportForm").style.display = "block";
}

function onClickCloseBtn(){
    document.getElementById("userRegistration").style.display = "none";
    document.getElementById("user_table").style.display = "block";
    document.getElementById("createUserBtn").style.display = "block";
}