// Ivory Cathey

// Bootstrap toast
const toastEl = document.getElementById("msgToast");
const toastTitleEl = document.getElementById("toastTitle");
const toastBodyEl = document.getElementById("toastBody");
const toast = (toastEl && window.bootstrap) ? new window.bootstrap.Toast(toastEl) : null;


  
  // Fallback if the toast HTML isn't present yet
function showToast(title, message) {
  if (!toast) {
    alert(`${title}: ${message}`);
    return;
  }
  toastTitleEl.textContent = title;
  toastBodyEl.textContent = message;
  toast.show();
}

// Tickets.html form
function initializeProducts() {
  let products = JSON.parse(localStorage.getItem("products"));

  if (!products || !Array.isArray(products) || products.length === 0) {
    products = [
      { id: "NYC-1DAY", title: "NYC 1-Day Pass", category: "NYC", unit: "Pass", price: 40, info: "Pick any single day" },
      { id: "NYC-WEND", title: "NYC Weekend Pass", category: "NYC", unit: "Pass", price: 80, info: "Attend full event" },
      { id: "NYC-VIP",  title: "NYC VIP Pass", category: "NYC", unit: "Pass", price: 120, info: "All-access + food & drinks" },

      { id: "MIA-1DAY", title: "Miami 1-Day Pass", category: "Miami", unit: "Pass", price: 40, info: "Pick any single day" },
      { id: "MIA-WEND", title: "Miami Weekend Pass", category: "Miami", unit: "Pass", price: 80, info: "Attend full event" },
      { id: "MIA-VIP",  title: "Miami VIP Pass", category: "Miami", unit: "Pass", price: 120, info: "All-access + food & drinks" },

      { id: "LA-1DAY", title: "LA 1-Day Pass", category: "LA", unit: "Pass", price: 40, info: "Pick any single day" },
      { id: "LA-WEND", title: "LA Weekend Pass", category: "LA", unit: "Pass", price: 80, info: "Attend full event" },
      { id: "LA-VIP",  title: "LA VIP Pass", category: "LA", unit: "Pass", price: 120, info: "All-access + food & drinks" }
    ];

    localStorage.setItem("products", JSON.stringify(products));
  }
}

// cart
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cartCountEl = document.getElementById("cartCount");
  if (!cartCountEl) return;

  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalItems;
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      category: product.category,
      unit: product.unit,
      price: Number(product.price),
      info: product.info,
      quantity: 1
    });
  }

  saveCart(cart);
}

// tix
function populateTicketDropdowns() {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const nycSelect = document.querySelector("select[name='nycTicket']");
  const miamiSelect = document.querySelector("select[name='miamiTicket']");
  const laSelect = document.querySelector("select[name='laTicket']");

  function populate(select, cityKeys) {
    if (!select) return;

    select.innerHTML = `<option value="">Select a ticket...</option>`;

    products
      .filter(product => cityKeys.includes(product.category))
      .forEach(product => {
        select.innerHTML += `
          <option value="${product.id}">
            ${product.title} — $${Number(product.price).toFixed(2)}
          </option>
        `;
      });
  }

  populate(nycSelect, ["NYC", "New York", "New York City"]);
  populate(miamiSelect, ["Miami", "MIA"]);
  populate(laSelect, ["LA", "Los Angeles"]);
}

function setupTicketForm() {
  const ticketForm = document.getElementById("ticketForm");
  if (!ticketForm) return;

  populateTicketDropdowns();

  ticketForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const products = JSON.parse(localStorage.getItem("products")) || [];

    const nycSelect = document.querySelector("select[name='nycTicket']");
    const miamiSelect = document.querySelector("select[name='miamiTicket']");
    const laSelect = document.querySelector("select[name='laTicket']");

    const selectedIds = [
      nycSelect ? nycSelect.value : "",
      miamiSelect ? miamiSelect.value : "",
      laSelect ? laSelect.value : ""
    ].filter(value => value !== "");

    if (selectedIds.length === 0) {
      showToast("No Tickets Selected", "Please select at least one ticket.");
      return;
    }

    selectedIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) {
        addToCart(product);
      }
    });

    window.location.href = "checkout.html";
  });
}
// signup
function setupSignupForm() {
  const signupForm = document.querySelector(".signup-form");
  if (!signupForm) return;

  const email = document.getElementById("email");
  const nameInput = document.getElementById("fname");
  const phone = document.getElementById("phone");
  const age = document.getElementById("age");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const state = document.getElementById("inputState");
  const zip = document.getElementById("inputZip");

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (
      !nameInput.value.trim() ||
      !email.value.trim() ||
      !age.value.trim() ||
      !address.value.trim() ||
      !city.value.trim() ||
      !state.value.trim() ||
      !zip.value.trim()
    ) {
      showToast("Missing Information", "Please fill out all required fields.");
      return;
    }

    if (!validEmail(email.value)) {
      showToast("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (isNaN(age.value) || Number(age.value) <= 0) {
      showToast("Invalid Age", "Age must be a valid number.");
      return;
    }

    const members = JSON.parse(localStorage.getItem("members")) || [];

    const member = {
      name: nameInput.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      age: age.value.trim(),
      address: address.value.trim(),
      city: city.value.trim(),
      state: state.value.trim(),
      zip: zip.value.trim()
    };

    members.push(member);
    localStorage.setItem("members", JSON.stringify(members));

    showToast("Success", "Sign-up submitted successfully.");
    signupForm.reset();
  });
}

// starttup / dynamic listening
document.addEventListener("DOMContentLoaded", function () {
  initializeProducts();
  updateCartCount();
  setupTicketForm();
  setupSignupForm();
});
  populate(miamiSelect, "Miami");
  populate(laSelect, "LA");
});
