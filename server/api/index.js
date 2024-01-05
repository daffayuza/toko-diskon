// server/api/index.js
const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/generate-voucher', (req, res) => {
  const { amount } = req.body;

  // Generate voucher code (you can use a more complex method)
  const voucherCode = Math.random().toString(36).substr(2, 8).toUpperCase();

  // Calculate expiration date (3 months from now)
  const expirationDate = new Date();
  expirationDate.setMonth(expirationDate.getMonth() + 3);

  // Insert voucher into the database
  const stmt = db.prepare('INSERT INTO vouchers (code, amount, expiration_date) VALUES (?, ?, ?)');
  stmt.run(voucherCode, amount, expirationDate.toISOString());
  stmt.finalize();

  res.json({ code: voucherCode, amount, expirationDate });
});

module.exports = router;
