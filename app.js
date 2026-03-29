//Ivory Cathey

const toastEl = document.getElementById("msgToast");
const toastTitleEl = document.getElementById("toastTitle");
const toastBodyEl = document.getElementById("toastBody");
const toast = (toastEl && window.bootstrap) ? new window.bootstrap.Toast(toastEl) : null;

function showToast(title, message) {
  if (!toast) {
    alert(title + ": " + message);
    return;
  }
  toastTitleEl.textContent = title;
  toastBodyEl.textContent = message;
  toast.show();
}

function initializeProducts() {
  let products = JSON.parse(localStorage.getItem("products"));

  if (!products || !Array.isArray(products) || products.length === 0) {
    products = [
      { id: "NYC-1DAY", title: "NYC 1-Day Pass", category: "NYC", unit: "Pass", price: 40, info: "Pick any single day", image: "NewYorkSkyline.jpg" },
      { id: "NYC-WEND", title: "NYC Weekend Pass", category: "NYC", unit: "Pass", price: 80, info: "Attend full event", image: "NewYorkSkyline.jpg" },
      { id: "NYC-VIP", title: "NYC VIP Pass", category: "NYC", unit: "Pass", price: 120, info: "All-access + food & drinks", image: "NewYorkSkyline.jpg" },

      { id: "MIA-1DAY", title: "Miami 1-Day Pass", category: "Miami", unit: "Pass", price: 40, info: "Pick any single day", image: "MiamiSkyline.jpg" },
      { id: "MIA-WEND", title: "Miami Weekend Pass", category: "Miami", unit: "Pass", price: 80, info: "Attend full event", image: "MiamiSkyline.jpg" },
      { id: "MIA-VIP", title: "Miami VIP Pass", category: "Miami", unit: "Pass", price: 120, info: "All-access + food & drinks", image: "MiamiSkyline.jpg" },

      { id: "LA-1DAY", title: "LA 1-Day Pass", category: "LA", unit: "Pass", price: 40, info: "Pick any single day", image: "LosAngelesSkyline.jpg" },
      { id: "LA-WEND", title: "LA Weekend Pass", category: "LA", unit: "Pass", price: 80, info: "Attend full event", image: "LosAngelesSkyline.jpg" },
      { id: "LA-VIP", title: "LA VIP Pass", category: "LA", unit: "Pass", price: 120, info: "All-access + food & drinks", image: "LosAngelesSkyline.jpg" }
    ];

    localStorage.setItem("products", JSON.stringify(products));
  }
}

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
      image: product.image || "",
      quantity: 1
    });
  }

  saveCart(cart);
}

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
      showToast("Error", "Please select at least one ticket.");
      return;
    }

    selectedIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) addToCart(product);
    });

    window.location.href = "checkout.html";
  });
}

function renderCartPage() {
  const cartItems = document.getElementById("cartItems");
  const summaryArea = document.getElementById("summaryArea");
  const clearCartBtn = document.getElementById("clearCartBtn");
  if (!cartItems || !summaryArea || !clearCartBtn) return;

  function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
      cartItems.innerHTML = `<p><strong>Your cart is empty.</strong></p>`;
      summaryArea.innerHTML = "<p>No items in cart.</p>";
      return;
    }

    let html = `
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Product</th>
              <th>City</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
    `;

    cart.forEach(item => {
      const subtotal = item.price * item.quantity;
      html += `
        <tr>
          <td>
            <strong>${item.title}</strong><br>
            <small class="text-muted">${item.info || ""}</small>
          </td>
          <td>${item.category}</td>
          <td>$${Number(item.price).toFixed(2)}</td>
          <td>${item.quantity}</td>
          <td>$${subtotal.toFixed(2)}</td>
          <td>
            <button class="btn btn-sm btn-outline-danger remove-cart-item" data-id="${item.id}">Remove</button>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table></div>`;
    cartItems.innerHTML = html;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    summaryArea.innerHTML = `
      <p><strong>Items:</strong> ${itemCount}</p>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
    `;
  }

  clearCartBtn.addEventListener("click", function () {
    saveCart([]);
    renderCart();
  });

  cartItems.addEventListener("click", function (e) {
    if (!e.target.classList.contains("remove-cart-item")) return;
    const id = e.target.getAttribute("data-id");
    const cart = getCart().filter(item => item.id !== id);
    saveCart(cart);
    renderCart();
  });

  renderCart();
}

function setupBillingForm() {
  const billingForm = document.getElementById("billingForm");
  if (!billingForm) return;

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function lettersOnly(value) {
    return /^[A-Za-z\s]+$/.test(value.trim());
  }

  function numbersOnly(value) {
    return /^\d+$/.test(value.trim());
  }

  function zipValid(value) {
    return /^\d{5}$/.test(value.trim());
  }

  billingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
      showToast("Error", "Cart is empty.");
      return;
    }

    const billing = {
      fullName: document.getElementById("billingName").value.trim(),
      email: document.getElementById("billingEmail").value.trim(),
      phone: document.getElementById("billingPhone").value.trim(),
      address: document.getElementById("billingAddress").value.trim(),
      city: document.getElementById("billingCity").value.trim(),
      state: document.getElementById("billingState").value.trim(),
      zip: document.getElementById("billingZip").value.trim(),
      cardType: document.getElementById("cardType").value.trim(),
      cardNumber: document.getElementById("cardNumber").value.trim(),
      cardExp: document.getElementById("cardExp").value.trim(),
      code: document.getElementById("cardCode").value.trim(),
      items: cart,
      submittedAt: new Date().toISOString()
    };

    if (!billing.fullName) {
      showToast("Error", "Full name is required.");
      return;
    }

    if (!validEmail(billing.email)) {
      showToast("Error", "Invalid email.");
      return;
    }

    if (!billing.address) {
      showToast("Error", "Address required.");
      return;
    }

    if (!lettersOnly(billing.city)) {
      showToast("Error", "City must be letters only.");
      return;
    }

    if (!billing.state) {
      showToast("Error", "Select a state.");
      return;
    }

    if (!zipValid(billing.zip)) {
      showToast("Error", "Zip must be 5 digits.");
      return;
    }

    if (!numbersOnly(billing.cardNumber)) {
      showToast("Error", "Card number must be numeric.");
      return;
    }

    if (!billing.cardExp) {
      showToast("Error", "Expiration required.");
      return;
    }

    if (!numbersOnly(billing.code) || (billing.code.length !== 3 && billing.code.length !== 4)) {
      showToast("Error", "Invalid security code.");
      return;
    }

    const jsonString = JSON.stringify(billing, null, 2);
    localStorage.setItem("billingDetails", jsonString);

    const jsonOut = document.getElementById("billingJsonOut");
    if (jsonOut) jsonOut.textContent = jsonString;

    const ajaxStatus = document.getElementById("billingAjaxStatus");
    if (ajaxStatus) {
      ajaxStatus.textContent = "Saved locally. No server required.";
    }

    showToast("Success", "Billing submitted.");
    billingForm.reset();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initializeProducts();
  updateCartCount();
  setupTicketForm();
  renderCartPage();
  setupBillingForm();
});
