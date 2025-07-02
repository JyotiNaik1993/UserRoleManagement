function onFormSubmit(){
    // Call Api to validate email address and password
    let isValid = false;
    // if (document.getElementById("fullName").value == "") {
    //     isValid = false;
    //     document.getElementById("fullNameValidationError").classList.remove("hide");
    // } else {
    //     isValid = true;
    //     if (!document.getElementById("fullNameValidationError").classList.contains("hide"))
    //         document.getElementById("fullNameValidationError").classList.add("hide");
    // }
    const apiUrl = 'http://localhost:5039/api/Auth/validateuser';
    const postData = {
        email: document.getElementById("emailAddress").value,
        password: document.getElementById("password").value
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
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("roleId", data.roleId);
        window.location.href = "userManagement.html"
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Please Enter Valid Username and Password");
        isValid = false;
    });
    
    return isValid;
}