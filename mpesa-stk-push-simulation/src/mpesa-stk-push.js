const crypto = require('crypto');

/**
 * Simulates an M-Pesa STK Push transaction for school fee payments
 * @param {string} phoneNumber - Phone number in format "254XXXXXXXXX"
 * @param {number} amount - Transaction amount (1-100000)
 * @param {string} transactionDesc - Description of the transaction
 * @returns {Object} Response object with status, transactionId, and message
 */
function stkPush(phoneNumber, amount, transactionDesc) {
    // Step 1: Input validation
    const validationResult = validateInputs(phoneNumber, amount, transactionDesc);
    
    if (!validationResult.isValid) {
        return {
            status: "error",
            transactionId: null,
            message: validationResult.message
        };
    }
    
    // Step 2: Generate random transaction ID
    const transactionId = generateTransactionId();
    
    // Step 3: Simulate successful STK Push initiation
    return {
        status: "success",
        transactionId: transactionId,
        message: "STK Push initiated"
    };
}

/**
 * Validates all input parameters
 * @param {string} phoneNumber - Phone number to validate
 * @param {number} amount - Amount to validate
 * @param {string} transactionDesc - Description to validate
 * @returns {Object} Validation result with isValid flag and message
 */
function validateInputs(phoneNumber, amount, transactionDesc) {
    // Validate phone number first
    if (!isValidPhoneNumber(phoneNumber)) {
        return {
            isValid: false,
            message: "Invalid phone number format. Must be 12 digits starting with '254'"
        };
    }
    
    // Validate amount
    if (!isValidAmount(amount)) {
        return {
            isValid: false,
            message: "Invalid amount. Must be a positive number between 1 and 100000"
        };
    }
    
    // Validate transaction description
    if (!isValidTransactionDesc(transactionDesc)) {
        return {
            isValid: false,
            message: "Invalid transaction description. Must be non-empty string"
        };
    }
    
    return {
        isValid: true,
        message: "All inputs are valid"
    };
}

/**
 * Validates phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidPhoneNumber(phoneNumber) {
    // Check if phoneNumber is a string
    if (typeof phoneNumber !== 'string') {
        return false;
    }
    
    // Check if it starts with "254" and is exactly 12 digits
    const phoneRegex = /^254\d{9}$/;
    return phoneRegex.test(phoneNumber);
}

/**
 * Validates transaction amount
 * @param {number} amount - Amount to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidAmount(amount) {
    // Check if amount is a number
    if (typeof amount !== 'number' || isNaN(amount)) {
        return false;
    }
    
    // Check if amount is within valid range
    return amount >= 1 && amount <= 100000;
}

/**
 * Validates transaction description
 * @param {string} transactionDesc - Description to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidTransactionDesc(transactionDesc) {
    // Check if transactionDesc is a string and not empty
    return typeof transactionDesc === 'string' && transactionDesc.trim().length > 0;
}

/**
 * Generates a random 8-character alphanumeric transaction ID
 * @returns {string} Random transaction ID
 */
function generateTransactionId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let transactionId = '';
    
    // Generate 8 random characters
    for (let i = 0; i < 8; i++) {
        const randomBytes = crypto.randomBytes(1);
        const randomIndex = randomBytes[0] % characters.length;
        transactionId += characters[randomIndex];
    }
    
    return transactionId;
}

// Export the function for use in other modules
module.exports = { 
    stkPush,
    // Export helper functions for testing purposes
    isValidPhoneNumber,
    isValidAmount,
    isValidTransactionDesc,
    generateTransactionId
};