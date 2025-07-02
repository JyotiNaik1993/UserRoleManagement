var selectedRow = null

window.onload = function() {
    if (validate()) {
        readUserData();
        //insertUserRecord(userData);
        let reportsData = readReportsData();
        insertReportsRecord(reportsData);
        // if (selectedRow == null)
        //     insertNewRecord(formData);
        // else
        //     updateRecord(formData);
        // resetForm();
    }
}

function readUserData() {
    // Call api to get users data
    const apiUrl = 'https://jsonplaceholder.typicode.com/users'; // Example API endpoint

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
        var table = document.getElementById("userList").getElementsByTagName('tbody')[0];
        for(let i = 0; i < data.length; i++)
        {
            var newRow = table.insertRow(i);
            cell1 = newRow.insertCell(0);
            cell1.innerHTML = data[i].name;
            cell2 = newRow.insertCell(1);
            cell2.innerHTML = data[i].email;
            cell3 = newRow.insertCell(2);
            cell3.innerHTML = data[i].username;
            cell4 = newRow.insertCell(3);
            cell4.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                            <a onClick="onDelete(this)">Delete</a>`;
        }
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch operation
        console.error('Error fetching data:', error);
    });
}

function readReportsData() {
    // Call api to get users data
    var formData = {};
    //console.log(formData);
    formData["name"] = "Report1";
    formData["description"] = "test report"
    formData["link"] = "www.google.com"
    return formData;
}

function insertUserRecord(data) {
    console.log("FullName", data)
    console.log(data.fullName);
    var table = document.getElementById("userList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.fullName;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.email;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.role;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>`;
}

function insertReportsRecord(data) {
    var table = document.getElementById("reportList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.name;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.description;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.link;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>`;
}

function resetForm() {
    document.getElementById("fullName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("salary").value = "";
    document.getElementById("city").value = "";
    selectedRow = null;
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

function onDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        row = td.parentElement.parentElement;
        document.getElementById("employeeList").deleteRow(row.rowIndex);
        resetForm();
    }
}
function validate() {
    // Call Api to validate email address and password
    isValid = true;
    // if (document.getElementById("fullName").value == "") {
    //     isValid = false;
    //     document.getElementById("fullNameValidationError").classList.remove("hide");
    // } else {
    //     isValid = true;
    //     if (!document.getElementById("fullNameValidationError").classList.contains("hide"))
    //         document.getElementById("fullNameValidationError").classList.add("hide");
    // }
    return isValid;
}

function onClickUserData(){
    console.log("On Click User Data");
    document.getElementById("createUserBtn").style.display = "block";
    document.getElementById("userRegistration").style.display = "none";
    document.getElementById("report").style.display = "none";
    document.getElementById("user").style.display = "block";
}

function onClickReportsData(){
    console.log("On Click Reports Data");
    document.getElementById("createUserBtn").style.display = "none";
    document.getElementById("userRegistration").style.display = "none";
    document.getElementById("user").style.display = "none";
    document.getElementById("report").style.display = "block";
}

function onClickCreateUser(){
    document.getElementById("createUserBtn").style.display = "none";
    document.getElementById("report").style.display = "none";
    document.getElementById("user").style.display = "none";
    document.getElementById("userRegistration").style.display = "block";
    // window.location.href = "userRegistration.html"; 
}

function onClickCloseBtn(){
    document.getElementById("userRegistration").style.display = "none";
    document.getElementById("user").style.display = "block";
    document.getElementById("createUserBtn").style.display = "block";
}

async function fetchData() {
    let userData = {};
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts/1';
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
    //   userData["fullName"] = data[0].name;
      console.log("UserData", userData);
      console.log('Fetched data:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
}