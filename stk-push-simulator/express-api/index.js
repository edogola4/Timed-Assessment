const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

function stkPush(phoneNumber, amount, transactionDesc) {
  const isPhoneValid = typeof phoneNumber === 'string' &&
                       phoneNumber.length === 12 &&
                       phoneNumber.startsWith('254') &&
                       /^\d{12}$/.test(phoneNumber);

  const isAmountValid = typeof amount === 'number' &&
                        amount >= 1 && amount <= 100000;

  const isDescValid = typeof transactionDesc === 'string' &&
                      transactionDesc.trim().length > 0;

  if (!isPhoneValid || !isAmountValid || !isDescValid) {
    return {
      status: "error",
      transactionId: null,
      message: "Invalid inputs"
    };
  }

  const transactionId = crypto.randomBytes(4).toString('hex').toUpperCase();

  return {
    status: "success",
    transactionId,
    message: "STK Push initiated"
  };
}

app.post('/stkpush', (req, res) => {
  const { phoneNumber, amount, transactionDesc } = req.body;
  const result = stkPush(phoneNumber, amount, transactionDesc);
  res.json(result);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
