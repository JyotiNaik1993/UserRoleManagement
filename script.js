var selectedRow = null

window.onload = function(){
    let roleId = localStorage.getItem("roleId");
    if(roleId == 1){
        onClickUserData();
        document.getElementById("userBtn").style.display = "inline-block";
        document.getElementById("reportBtn").style.display = "inline-block";
        document.getElementById("reports").style.display = "none";
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
            cell4.innerHTML = data[i].roleName;
            cell5 = newRow.insertCell(4);
            cell5.innerHTML = `<a class="edit_delete" onClick="onEdit(this)">Edit</a>
                            <a class="edit_delete" onClick="onDelete(this)">Delete</a>`;

            const option = document.createElement('option');
            option.value = data[i].userId; // Assuming 'id' is the value you want to assign
            option.textContent = data[i].firstName +" "+ data[i].lastName; // Assuming 'name' is the text to display
            dropdown.appendChild(option);
        }
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch operation
        console.error('Error fetching data:', error);
        insertUsersRecord();
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
            cell2.innerHTML = `<a target="_blank" href="${data[i].link}">${data[i].name}</a>`;
            cell3 = newRow.insertCell(2);
            cell3.innerHTML = data[i].description;
            cell4 = newRow.insertCell(3);
            cell4.innerHTML = `<a class="edit_delete" onClick="editReportsRow(this)">Edit</a>
                                <a class="edit_delete" onClick="onDeleteReport(this)">Delete</a>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        insertReportsRecord();
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

function editReportsRow(button) {
    const row = button.parentNode.parentNode;
    const reportId = row.cells[0];
    const reportName = row.cells[1];
    const reportDescription = row.cells[2];

    if (button.textContent === 'Edit') {
        // Switch to edit mode
        row.classList.add('edit-mode');
        reportId.innerHTML = `<input type="text" value="${reportId.textContent}">`;
        reportName.innerHTML = `<input type="text" value="${reportName.textContent}">`;
        reportDescription.innerHTML = `<input type="text" value="${reportDescription.textContent}">`;
        console.log(row);
        button.textContent = 'Save';
    } else {
        // Save changes
        console.log(row);
        const newId = reportId.querySelector('input').value;
        const newName = reportName.querySelector('input').value;
        const newDescrition = reportDescription.querySelector('input').value;
        reportId.textContent = newId;
        reportName.textContent = newName;
        reportDescription.textContent = newDescrition;
        row.classList.remove('edit-mode');
        UpdateUserReport(newId,newName,newDescrition);
        button.textContent = 'Edit';
    }
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
    const postData = {
        reportName: document.getElementById("reportName").value,
        link: document.getElementById("reportLink").value,
        description : document.getElementById("reportDescription").value,
        userId : document.getElementById("user_dropdown").value
    };
    const apiUrl = 'http://localhost:5039/api/reports/addreport';

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
        deleteUser(row.cells[0].innerText);
    }
}

function onDeleteReport(td) {
    // document.getElementById("deleteRecord").style.display = "block";
    if (confirm('Are you sure to delete this report ?')) {
        row = td.parentElement.parentElement;
        deleteReport(row.cells[0].innerText);
    }
}

function onClickUserData(){
    readUserData();
    //insertUsersRecord();
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
    cell1.innerHTML = `<a target="_blank" href="https://www.youtube.com" target="_blank">Report1</a>`;;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = "Test Report";
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = "report description";
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = `<button class="edit_delete" onclick="editReportsRow(this)">Edit</button>
                        <button class="edit_delete" onclick="deleteRow(this)">Delete</button>`
}

function insertUsersRecord(data) {
    var table = document.getElementById("userList").getElementsByTagName('tbody')[0];
    let fullName = "chahat" +" "+ "jain";
    let newRow = table.insertRow(0);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = 1;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = fullName;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = "chahatjain218@gmail.com";
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = "Manager"
    cell5 = newRow.insertCell(4);
    cell5.innerHTML = `<button class="edit_delete" onClick="editUserRow(this)">Edit</button>
                    <button class="edit_delete" onClick="onDelete(this)">Delete</button>`;
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

function logout(){
    window.location.href= "index.html";
}

function openForm() {
    document.getElementById("userRegistration").style.display = "block";
}
  
function closeForm() {
    document.getElementById("userRegistration").style.display = "none";
}

function openReportForm() {
    document.getElementById("addReportForm").style.display = "block";
}
  
function closeReportForm() {
    document.getElementById("addReportForm").style.display = "none";
}

function onCloseDeleteRecord(){
    document.getElementById("deleteRecord").style.display = "none";
}

function UpdateUserReport(reportId, reportName, reportDescription){
    const apiUrl = 'http://localhost:5039/api/Reports/updatereport';
    const postData = {
        reportId: reportId,
        name: reportName,
        description: reportDescription
    };
    console.log("api post data", postData);
    fetch(apiUrl, {
        method: 'PUT',
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

function UpdateUserData(userid,firstName, lastName, email, roleId){
    const apiUrl = 'http://localhost:5039/api/UserRegistration/updateuser?userId='+ userid;
    const postData = {
        email: email,
        firstName: firstName,
        lastName : lastName,
        roleId : roleId
    };

    console.log("api post data", postData);

    fetch(apiUrl, {
        method: 'PUT',
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

function editUserRow(button) {
    const row = button.parentNode.parentNode;
    const userid = row.cells[0].textContent;
    const fullName = row.cells[1];
    const email = row.cells[2];
    const role = row.cells[3];

    if (button.textContent === 'Edit') {
        // Switch to edit mode
        row.classList.add('edit-mode');
        fullName.innerHTML = `<input type="text" value="${fullName.textContent}">`;
        email.innerHTML = `<input type="text" value="${email.textContent}">`;
        role.innerHTML = `<select id="role" name="role" required>
              <option value="select">
                  --Select--
              </option>
              <option value="1">
                  Admin
              </option>
              <option value="2">
                  Manager
              </option>
              <option value="3">
                  Staff
              </option>
              <option value="4">
                  Vendor
              </option>
          </select>`;
        button.textContent = 'Save';
    } else {
        // Save changes
        const selectElement = document.getElementById('role');
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const selectedValue = selectedOption.value;
        const newFullName = fullName.querySelector('input').value;
        const newEmail = email.querySelector('input').value;
        const newRole = selectedValue;

        fullName.textContent = newFullName;
        email.textContent = newEmail;
        role.textContent = newRole;
        row.classList.remove('edit-mode');

        UpdateUserData(userid, newFullName.split(' ')[0], newFullName.split(' ')[1], email.textContent, role.textContent);
        button.textContent = 'Edit';
    }
}