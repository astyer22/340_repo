// Client-side Validation Script 

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#updateForm');
    const errorMessagesDiv = document.getElementById('errorMessages');
    const submitButton = form.querySelector('input[type="submit"]');
  
    form.addEventListener('submit', function (event) {
      errorMessagesDiv.innerHTML = ''; // Clear previous errors
      errorMessagesDiv.style.display = 'none';
  
      const requiredFields = ['invMake', 'invModel', 'invYear', 'invPrice', 'invMiles', 'invColor'];
      let hasError = false;
  
      requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
          hasError = true;
          const errorMsg = `<p>${field.name.replace('inv_', '')} is required.</p>`;
          errorMessagesDiv.innerHTML += errorMsg;
        }
      });
  
      if (hasError) {
        event.preventDefault(); // Prevent form submission if there are errors
        errorMessagesDiv.style.display = 'block';
      } else {
        submitButton.disabled = true; // Disable the button on successful submission
      }
    });
  });
  
//   // Enable the submit button when a change is made to the form

const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button")
      updateBtn.removeAttribute("disabled")
    })