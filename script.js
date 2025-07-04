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
        let table = document.getElementById("userList").getElementsByTagName('tbody')[0];
        for(let i = 0; i < data.length; i++)
        {
            let fullName = data[i].firstName +" "+ data[i].lastName;
            let newRow = table.insertRow(i);
            cell1 = newRow.insertCell(0);
            cell1.innerHTML = data[i].userId;
            cell2 = newRow.insertCell(1);
            cell2.innerHTML = fullName;
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

function readReportsDataManagement() {
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
        var table = document.getElementById("reportList").getElementsByTagName('tbody')[0];
        for(let i = 0; i < data.length; i++)
        {
            var newRow = table.insertRow(i);
            cell1 = newRow.insertCell(0);
            cell1.innerHTML =data[i].reportId;
            cell2 = newRow.insertCell(1);
            cell2.innerHTML = `<a target="_self" href="${data[i].link}">${data[i].name}</a>`;
            cell3 = newRow.insertCell(2);
            cell3.innerHTML = data[i].description;
            cell4 = newRow.insertCell(3);
            cell4.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                                <a onClick="onDeleteReport(this)">Delete</a>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function readReportsData() {
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
        var table = document.getElementById("reportListByUser").getElementsByTagName('tbody')[0];
        for(let i = 0; i < data.length; i++)
        {
            var newRow = table.insertRow(i);
            cell1 = newRow.insertCell(0);
            cell1.innerHTML = `<a target="_self" href="${data[i].link}">${data[i].name}</a>`;
            cell2 = newRow.insertCell(1);
            cell2.innerHTML = data[i].description;
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

function resetUserDataForm() {
    document.getElementById("userId").value = "";
    document.getElementById("fullName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("roleId").value = "";
    document.getElementById("city").value = "";
    selectedRow = null;
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
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert("Reports Added Successfully");
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Please Enter Valid Username and Password");
    });
}

function onDelete(td) {
    if (confirm('Are you sure to delete this user ?')) {
        row = td.parentElement.parentElement;
        //    //get the array of all cells in that row 
        // var cells     = row.getElementsByTagName("td");
        // var textfield = cells[1].getElementsByTagName("input")[0]; 
        // alert(row.cell1);
        // alert(row.getElementsByTagName("td"));
        // alert(textfield);
        console.log(row);
        console.log(row.cells[0].innerText);
        deleteUser(row.cells[0].innerText);
        //document.getElementById("employeeList").deleteRow(row.rowIndex);
        //resetForm();
    }
}
function onDeleteReport(td) {
    if (confirm('Are you sure to delete this report ?')) {
        row = td.parentElement.parentElement;
        console.log(row);
        console.log(row.cells[0].innerText);
        deleteReport(row.cells[0].innerText);
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
    document.getElementById("report_table_user").style.display = "none";
    clearTableData("reportList");
    clearTableData("reportListByUser");
}

function onClickReportsManagement(){
    readReportsDataManagement();
    document.getElementById("addReportForm").style.display = "none";
    document.getElementById("createUserBtn").style.display = "none";
    document.getElementById("addReportBtn").style.display = "block";
    document.getElementById("userRegistration").style.display = "none";
    document.getElementById("user_table").style.display = "none";
    document.getElementById("report_table").style.display = "block";
    document.getElementById("report_table_user").style.display = "none";
    clearTableData("userList");
    clearTableData("reportListByUser");
}

function onClickReportsData(){
    readReportsData();
    document.getElementById("addReportForm").style.display = "none";
    document.getElementById("createUserBtn").style.display = "none";
    document.getElementById("addReportBtn").style.display = "none";
    document.getElementById("userRegistration").style.display = "none";
    document.getElementById("user_table").style.display = "none";
    document.getElementById("report_table").style.display = "none";
    document.getElementById("report_table_user").style.display = "block";
    clearTableData("reportList");
    clearTableData("userList");
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

function onClickCloseReportBtn(){
    document.getElementById("addReportForm").style.display = "none";
    document.getElementById("report_table").style.display = "block";
    document.getElementById("addReportBtn").style.display = "block";
}

function clearTableData(tableId){
    var tableHeaderRowCount = 1;
    var table = document.getElementById(tableId);
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
    }
}

function insertReportsRecord(data) {
    var table = document.getElementById("reportList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = `<a target="_self" href="https://www.youtube.com" target="_blank">Report1</a>`;;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = "Test Report";
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = "www.google.com";
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>`;
}

function searchUserFunction(searchId, list){
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(searchId);
    filter = input.value.toUpperCase();
    table = document.getElementById(list);
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        } else {
        tr[i].style.display = "none";
        }
    }       
    }
}

function searchReportFunction(searchId, list){
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(searchId);
    filter = input.value.toUpperCase();
    table = document.getElementById(list);
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        } else {
        tr[i].style.display = "none";
        }
    }       
    }
}

function deleteUser(userid){
    const apiUrl = 'http://localhost:5039/api/UserRegistration/deleteuser?userId=' + userid;

    fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert("Deleted user with user id : ", userid);
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deleteReport(reportid){
    const apiUrl = 'http://localhost:5039/api/Reports/deletereport?reportId=' + reportid;

    fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert("Deleted report");
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function onSubmitAddReport(){
    const apiUrl = 'http://localhost:5039/api/Reports/createreport';
    const postData = {
        name: document.getElementById("reportName").value,
        description: document.getElementById("reportDescription").value,
        link: document.getElementById("reportLink").value,
        userId: document.getElementById("user_dropdown").value,
    };
    console.log(postData);
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
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
