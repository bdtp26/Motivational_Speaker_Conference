// Ivory Cathey

import { Toast } from './bootstrap.esm.min.js';

// Bootstrap toast
const toastEl = document.getElementById("msgToast");
const toastTitleEl = document.getElementById("toastTitle");
const toastBodyEl = document.getElementById("toastBody");
const toast = toastEl ? new Toast(toastEl) : null;

function showToast(title, message) {
  
  // Fallback if the toast HTML isn't present yet
  if (!toast) {
    alert(`${title}: ${message}`);
    return;
  }
  toastTitleEl.textContent = title;
  toastBodyEl.textContent = message;
  toast.show();
}

// Brian's form
const form = document.querySelector("form");
if (!form) {
  console.warn("No form found on this page. app.js will not run.");
} else {
  const membersArea = document.getElementById("membersArea");
  if (!membersArea) {
    console.warn("No membersArea found on this page. app.js will not run.");
  } else {
    const email = document.getElementById("email");
    const nameInput = document.getElementById("fname");
    const phone = document.getElementById("phone");
    const age = document.getElementById("age");
    const address = document.getElementById("address");
    const state = document.getElementById("inputState");
    const city = document.getElementById("city");
    const zip = document.getElementById("inputZip");

    let members = JSON.parse(localStorage.getItem("members")) || [];

    function validEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!email.value || !nameInput.value || !age.value || !address.value) {
        showToast("Missing info", "Fill out Email, Full Name, Age, and Address.");
        return;
      }

      if (!validEmail(email.value)) {
        showToast("Invalid email", "Enter an email like name@example.com.");
        return;
      }

      if (isNaN(age.value)) {
        showToast("Invalid age", "Age must be a number.");
        return;
      }

      const member = {
        email: email.value.trim(),
        name: nameInput.value.trim(),
        phone: phone.value.trim(),
        age: age.value.trim(),
        address: address.value.trim(),
        city: city.value.trim(),
        state: state.value,
        zip: zip.value.trim()
      };

      // member info action
      members.push(member);
      showToast("Saved", "Member added successfully.");

      localStorage.setItem("members", JSON.stringify(members));

      form.reset();
      render();
    });

    function render() {
      membersArea.innerHTML = "";

      members.forEach((m) => {
        membersArea.innerHTML += `
          <div>
            <strong>${m.name}</strong> (${m.email})<br>
            Age: ${m.age} | Phone: ${m.phone}<br>
            Address: ${m.address}<br>
            City: ${m.city} | State: ${m.state} | Zip: ${m.zip}
          </div><hr>
        `;
      });

      membersArea.innerHTML += `
        <h4>Stored JSON</h4>
        <pre>${JSON.stringify(members, null, 2)}</pre>
      `;
    }

    render();
  }
}
