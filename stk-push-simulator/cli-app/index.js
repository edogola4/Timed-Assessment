const readline = require('readline-sync');
const crypto = require('crypto');

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

// Get input from user
const phone = readline.question("Enter phone number (e.g., 2547XXXXXXXX): ");
const amount = parseFloat(readline.question("Enter amount (1 - 100000): "));
const desc = readline.question("Enter transaction description: ");

console.log("\nResult:");
console.log(stkPush(phone, amount, desc));
