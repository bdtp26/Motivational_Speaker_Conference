// Ivory Cathey

const toastEl = document.getElementById("msgToast");
const toastTitleEl = document.getElementById("toastTitle");
const toastBodyEl = document.getElementById("toastBody");
const toast = (toastEl && window.bootstrap) ? new window.bootstrap.Toast(toastEl) : null;

function showToast(title, message) {
  if (!toast) {
    alert(`${title}: ${message}`);
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
      showToast("No Tickets Selected", "Please select at least one ticket.");
      return;
    }

    selectedIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) addToCart(product);
    });

    window.location.href = "checkout.html";
  });
}

function setupSignupForm() {
  const signupForm = document.getElementById("signupForm");
  const pageTitle = document.querySelector("h2");
  if (!signupForm || !pageTitle || !pageTitle.textContent.toLowerCase().includes("sign up")) return;

  const email = document.getElementById("email");
  const nameInput = document.getElementById("fname");
  const phone = document.getElementById("phone");
  const participationType = document.getElementById("participationType");

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!nameInput.value.trim() || !email.value.trim() || !participationType.value.trim()) {
      showToast("Missing Information", "Please fill out all required fields.");
      return;
    }

    if (!validEmail(email.value)) {
      showToast("Invalid Email", "Please enter a valid email address.");
      return;
    }

    const selectedSessions = Array.from(
      document.querySelectorAll("input[name='session']:checked")
    ).map(box => box.value);

    const member = {
      fullName: nameInput.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      participationType: participationType.value.trim(),
      sessions: selectedSessions,
      submittedAt: new Date().toISOString()
    };

    const members = JSON.parse(localStorage.getItem("members")) || [];
    members.push(member);
    localStorage.setItem("members", JSON.stringify(members));

    const jsonString = JSON.stringify(member, null, 2);
    const jsonOut = document.getElementById("jsonOut");
    if (jsonOut) jsonOut.textContent = jsonString;

    const ajaxStatus = document.getElementById("ajaxStatus");
    if (ajaxStatus) ajaxStatus.textContent = "Sending...";

    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonString
      });

      const result = await response.json();

      if (ajaxStatus) {
        ajaxStatus.textContent = "Success! Sign-up sent to backend. Response ID: " + result.id;
      }

      if (window.angular) {
        const scope = angular.element(document.body).scope();
        if (scope) {
          scope.$applyAsync(() => {
            scope.jsonPreview = jsonString;
            scope.ajaxStatus = "Success! Sign-up sent to backend. Response ID: " + result.id;
          });
        }
      }

      showToast("Success", "Sign-up submitted successfully.");
      signupForm.reset();
    } catch (error) {
      if (ajaxStatus) ajaxStatus.textContent = "AJAX request failed.";
      showToast("Error", "Could not send data.");
    }
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
      <p class="small text-muted mb-0">Complete the billing form to submit your order details.</p>
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

  billingForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
      showToast("Cart Empty", "Please add ticket products before submitting billing details.");
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

    if (
      !billing.fullName || !billing.email || !billing.address || !billing.city ||
      !billing.state || !billing.zip || !billing.cardType || !billing.cardNumber ||
      !billing.cardExp || !billing.code
    ) {
      showToast("Missing Information", "Please complete all required billing fields.");
      return;
    }

    if (!validEmail(billing.email)) {
      showToast("Invalid Email", "Please enter a valid billing email address.");
      return;
    }

    const jsonString = JSON.stringify(billing, null, 2);
    localStorage.setItem("billingDetails", jsonString);

    const jsonOut = document.getElementById("billingJsonOut");
    if (jsonOut) jsonOut.textContent = jsonString;

    const ajaxStatus = document.getElementById("billingAjaxStatus");
    if (ajaxStatus) ajaxStatus.textContent = "Sending billing details...";

    try {
      const response = await fetch("http://localhost:3000/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonString
      });

      const result = await response.json();

      if (ajaxStatus) {
        ajaxStatus.textContent = "Success! Billing details sent to backend. Response ID: " + result.id;
      }

      if (window.angular) {
        const scope = angular.element(document.body).scope();
        if (scope) {
          scope.$applyAsync(() => {
            scope.billingJsonPreview = jsonString;
            scope.billingAjaxStatus = "Success! Billing details sent to backend. Response ID: " + result.id;
          });
        }
      }

      showToast("Success", "Billing details submitted successfully.");
    } catch (error) {
      if (ajaxStatus) ajaxStatus.textContent = "AJAX request failed.";
      showToast("Error", "Could not send billing details.");
    }
  });
}

function setupReturnsPage() {
  const returnsForm = document.getElementById("returnsForm");
  const productsArea = document.getElementById("returnProductsArea");
  const searchBox = document.getElementById("returnSearchBox");
  const clearBtn = document.getElementById("clearReturnSearchBtn");
  if (!returnsForm || !productsArea || !searchBox || !clearBtn) return;

  const products = JSON.parse(localStorage.getItem("products")) || [];

  function renderProducts(list) {
    productsArea.innerHTML = "";
    if (list.length === 0) {
      productsArea.innerHTML = `<p class="text-muted mb-0">No matching products found.</p>`;
      return;
    }

    list.forEach(product => {
      productsArea.innerHTML += `
        <div class="col-md-6">
          <div class="card p-3 h-100">
            <img src="${product.image || ''}" alt="${product.title}" class="img-fluid rounded mb-3 return-product-image">
            <h5>${product.title}</h5>
            <div><strong>ID:</strong> ${product.id}</div>
            <div><strong>City:</strong> ${product.category}</div>
            <div><strong>Price:</strong> $${Number(product.price).toFixed(2)}</div>
            <button class="btn btn-outline-primary mt-3 select-return-product"
              data-id="${product.id}"
              data-title="${product.title}"
              data-price="$${Number(product.price).toFixed(2)}"
              data-image="${product.image || ''}">
              Select Product
            </button>
          </div>
        </div>
      `;
    });
  }

  renderProducts(products);

  $(searchBox).on("keyup", function () {
    const q = $(this).val().toLowerCase();
    const filtered = products.filter(p =>
      p.id.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
    renderProducts(filtered);
  });

  $(clearBtn).on("click", function () {
    $("#returnSearchBox").val("");
    renderProducts(products);
  });

  productsArea.addEventListener("click", function (e) {
    if (!e.target.classList.contains("select-return-product")) return;

    const productName = e.target.getAttribute("data-title");
    const price = e.target.getAttribute("data-price");
    const image = e.target.getAttribute("data-image");

    document.getElementById("selectedReturnProduct").value = productName;
    document.getElementById("selectedReturnPrice").value = price;

    if (window.angular) {
      const scope = angular.element(document.body).scope();
      if (scope) {
        scope.$applyAsync(() => {
          scope.returnForm.productName = productName;
          scope.returnForm.price = price;
          scope.returnForm.image = image;
        });
      }
    }
  });

  returnsForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const returnRequest = {
      fullName: document.getElementById("returnName").value.trim(),
      email: document.getElementById("returnEmail").value.trim(),
      productName: document.getElementById("selectedReturnProduct").value.trim(),
      price: document.getElementById("selectedReturnPrice").value.trim(),
      reason: document.getElementById("returnReason").value.trim(),
      condition: document.getElementById("productCondition").value.trim(),
      details: document.getElementById("returnDetails").value.trim(),
      submittedAt: new Date().toISOString()
    };

    if (!returnRequest.fullName || !returnRequest.email || !returnRequest.productName || !returnRequest.reason || !returnRequest.condition) {
      showToast("Missing Information", "Please complete all required return fields.");
      return;
    }

    const jsonString = JSON.stringify(returnRequest, null, 2);
    localStorage.setItem("returnRequest", jsonString);

    const jsonOut = document.getElementById("returnsJsonOut");
    if (jsonOut) jsonOut.textContent = jsonString;

    const ajaxStatus = document.getElementById("returnsAjaxStatus");
    if (ajaxStatus) ajaxStatus.textContent = "Sending return request...";

    try {
      const response = await fetch("http://localhost:3000/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonString
      });

      const result = await response.json();

      if (ajaxStatus) {
        ajaxStatus.textContent = "Success! Return request sent to backend. Response ID: " + result.id;
      }

      if (window.angular) {
        const scope = angular.element(document.body).scope();
        if (scope) {
          scope.$applyAsync(() => {
            scope.returnsJsonPreview = jsonString;
            scope.returnsAjaxStatus = "Success! Return request sent to backend. Response ID: " + result.id;
          });
        }
      }

      showToast("Success", "Return request submitted successfully.");
      returnsForm.reset();
    } catch (error) {
      if (ajaxStatus) ajaxStatus.textContent = "AJAX request failed.";
      showToast("Error", "Could not send return request.");
    }
  });
}

if (window.angular) {
  const app = angular.module("conferenceApp", []);

  app.controller("SignupController", function ($scope) {
    $scope.signup = {};
    $scope.jsonPreview = '{\n  "message": "Submit the form to generate JSON"\n}';
    $scope.ajaxStatus = "Waiting for submission...";
  });

  app.controller("CheckoutController", function ($scope) {
    $scope.billing = {};
    $scope.billingJsonPreview = '{\n  "message": "Submit billing details to generate JSON"\n}';
    $scope.billingAjaxStatus = "Waiting for billing submission...";
  });

  app.controller("ReturnsController", function ($scope) {
    $scope.returnForm = {};
    $scope.returnsJsonPreview = '{\n  "message": "Submit a return request to generate JSON"\n}';
    $scope.returnsAjaxStatus = "Waiting for return submission...";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initializeProducts();
  updateCartCount();
  setupTicketForm();
  setupSignupForm();
  renderCartPage();
  setupBillingForm();
  setupReturnsPage();
});
