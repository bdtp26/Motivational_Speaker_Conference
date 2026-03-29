// Ivory Cathey 

// backend for the AJAX data has a landing page. creates the server and allows requests. 
// signup sned JSON via AJAX, req.body = JSON sent, sever logs it, sends back success response + confirmation 
// terrible class

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/signup", (req, res) => {
  console.log("Signup received:", req.body);
  res.json({
    success: true,
    id: Date.now(),
    message: "Signup data received by Node.js backend."
  });
});

app.post("/api/billing", (req, res) => {
  console.log("Billing received:", req.body);
  res.json({
    success: true,
    id: Date.now(),
    message: "Billing data received by Node.js backend."
  });
});

app.post("/api/returns", (req, res) => {
  console.log("Return request received:", req.body);
  res.json({
    success: true,
    id: Date.now(),
    message: "Return request received by Node.js backend."
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
