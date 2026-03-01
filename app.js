// Ivory Cathey

// Bootstrap toast
const toastEl = document.getElementById("msgToast");
const toastTitleEl = document.getElementById("toastTitle");
const toastBodyEl = document.getElementById("toastBody");
const toast = (toastEl && window.bootstrap) ? new window.bootstrap.Toast(toastEl) : null;

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

// Tickets.html form
const ticketForm = document.getElementById("ticketForm");

if (ticketForm) {
  ticketForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nyc = ticketForm.nycTicket.value;
    const miami = ticketForm.miamiTicket.value;
    const la = ticketForm.laTicket.value;

    const selections = [];

    if (nyc) selections.push({ city: "New York City", ticket: nyc });
    if (miami) selections.push({ city: "Miami", ticket: miami });
    if (la) selections.push({ city: "Los Angeles", ticket: la });

    localStorage.setItem("ticketSelections", JSON.stringify(selections));

    window.location.href = "checkout.html";
  });
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
render();

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
    membersArea.innerHTML += `<p>${m.name} (${m.email})</p>`;
  });
}

   
  }
}


// Product Management jQuery + JSON (localStorage) + search + update
$(function () {
  // For tickets.html -- only place that has products
  if (!document.getElementById("productForm")) return;

  let products = JSON.parse(localStorage.getItem("products")) || [
    { id: "NYC-1DAY", title: "NYC 1-Day Pass", category: "NYC", unit: "Pass", price: "40", info: "Pick any single day" },
    { id: "NYC-WEND", title: "NYC Weekend Pass", category: "NYC", unit: "Pass", price: "80", info: "Full event access" },
    { id: "NYC-VIP", title: "NYC VIP Pass", category: "NYC", unit: "Pass", price: "120", info: "All-access + food & drinks" }
  ];

  function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
  }

  function renderProducts(list) {
    $("#productCards").html("");

    list.forEach(p => {
      $("#productCards").append(`
        <div class="product-card">
          <strong>${p.title}</strong><br>
          ID: ${p.id}<br>
          Category: ${p.category}<br>
          Unit: ${p.unit}<br>
          Price: $${p.price}<br>
          ${p.info ? "Info: " + p.info + "<br>" : ""}
          <button class="editBtn" data-id="${p.id}">Edit</button>
        </div>
      `);
    });

    $("#productsJson").text(JSON.stringify(products, null, 2));
  }

  saveProducts();
  renderProducts(products);

  // Create/Update w field validation
  $("#productForm").on("submit", function (e) {
    e.preventDefault();

    const p = {
      id: $("#prodId").val().trim(),
      title: $("#prodTitle").val().trim(),
      category: $("#prodCategory").val().trim(),
      unit: $("#prodUnit").val().trim(),
      price: $("#prodPrice").val().trim(),
      info: $("#prodInfo").val().trim()
    };

    // Simple extra validation: price must be a number
    if (isNaN(p.price)) {
      alert("Price must be a number.");
      return;
    }

    const idx = products.findIndex(x => x.id === p.id);
    if (idx >= 0) products[idx] = p; else products.push(p);

    saveProducts();
    this.reset();
    renderProducts(products);
  });

  // jQuery search
  $("#searchBox").on("keyup", function () {
    const q = $(this).val().toLowerCase();
    const filtered = products.filter(p =>
      p.id.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
    renderProducts(filtered);
  });

  $("#clearSearch").on("click", function () {
    $("#searchBox").val("");
    renderProducts(products);
  });

  // jQuery update -- edit loads product
  $("#productCards").on("click", ".editBtn", function () {
    const id = $(this).data("id");
    const p = products.find(x => x.id === id);
    if (!p) return;

    $("#prodId").val(p.id);
    $("#prodTitle").val(p.title);
    $("#prodCategory").val(p.category);
    $("#prodUnit").val(p.unit);
    $("#prodPrice").val(p.price);
    $("#prodInfo").val(p.info);
  });
});
