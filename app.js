<script type="module">
  import { Toast } from 'bootstrap.esm.min.js'

  Array.from(document.querySelectorAll('.toast'))
    .forEach(toastNode => new Toast(toastNode))
</script>


const form = document.querySelector("form");
const membersArea = document.getElementById("membersArea");

const email = document.getElementById("email");
const nameInput = document.getElementById("fname");
const phone = document.getElementById("number");
const age = document.getElementById("age");
const address = document.getElementById("address");

let members = JSON.parse(localStorage.getItem("members")) || [];
let editIndex = null;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Required fields, can work with Brian's HTML on home/signup pages
  if (!email.value || !nameInput.value || !age.value || !address.value) {
    alert("Please fill out all required fields.");
    return;
  }

  // Email check, needs to include proper formatting
  if (!email.value.includes("@")) {
    alert("Invalid email.");
    return;
  }

  // No letters for age
  if (isNaN(age.value)) {
    alert("Age must be a number.");
    return;
  }

  const member = {
    email: email.value,
    name: nameInput.value,
    phone: phone.value,
    age: age.value,
    address: address.value
  };

  // Can edit members with a push
  if (editIndex !== null) {
    members[editIndex] = member;
    editIndex = null;
  } else {
    members.push(member);
  }

  // Json file storage, have to include JSON file
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
        <button onclick="editMember(${i})">Edit</button>
      </div><hr>
    `;
  });

  // Json proof
  membersArea.innerHTML += `
    <h4>Stored JSON</h4>
    <pre>${JSON.stringify(members, null, 2)}</pre>
  `;
}

window.editMember = function (index) {
  const m = members[index];
  email.value = m.email;
  nameInput.value = m.name;
  phone.value = m.phone;
  age.value = m.age;
  address.value = m.address;
  editIndex = index;
};

// Show all data
render();
