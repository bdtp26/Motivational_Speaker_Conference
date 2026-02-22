<script type="module">
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

  // combination w Brian's HTML
  const form = document.querySelector("form");
  const membersArea = document.getElementById("membersArea");

  const email = document.getElementById("email");
  const nameInput = document.getElementById("fname");
  const phone = document.getElementById("phone");;
  const age = document.getElementById("age");
  const address = document.getElementById("address");

  let members = JSON.parse(localStorage.getItem("members")) || [];
  let editIndex = null;

  // Some regex for email reqs
  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Required fields
    if (!email.value || !nameInput.value || !age.value || !address.value) {
      showToast("Missing info", "Fill out Email, Full Name, Age, and Address.");
      return;
    }

    // Email formatting
    if (!validEmail(email.value)) {
      showToast("Invalid email", "Enter an email like name@example.com.");
      return;
    }

    // Age, no letters
    if (isNaN(age.value)) {
      showToast("Invalid age", "Age must be a number.");
      return;
    }

    const member = {
      email: email.value.trim(),
      name: nameInput.value.trim(),
      phone: phone.value.trim(),
      age: age.value.trim(),
      address: address.value.trim()
    };

    // Update or add
    if (editIndex !== null) {
      members[editIndex] = member;
      editIndex = null;
      showToast("Updated", "Member updated successfully.");
    } else {
      members.push(member);
      showToast("Saved", "Member added successfully.");
    }

    // JSON storage
    localStorage.setItem("members", JSON.stringify(members));

    form.reset();
    render();
  });

  function render() {
    membersArea.innerHTML = "";

    members.forEach((m, i) => {
      membersArea.innerHTML += `
        <div>
          <strong>${m.name}</strong> (${m.email})<br>
          Age: ${m.age} | Phone: ${m.phone}<br>
          Address: ${m.address}<br>
          <button type="button" onclick="editMember(${i})">Edit</button>
        </div><hr>
      `;
    });

    // JSON for deliverables
    membersArea.innerHTML += `
      <h4>Stored JSON</h4>
      <pre>${JSON.stringify(members, null, 2)}</pre>
    `;
  }

  // Utilizing global
  window.editMember = function (index) {
    const m = members[index];
    email.value = m.email;
    nameInput.value = m.name;
    phone.value = m.phone;
    age.value = m.age;
    address.value = m.address;
    editIndex = index;

    showToast("Edit mode", "Make changes and click Submit to update.");
  };

  render();
</script>
