const { stkPush } = require('../src/mpesa-stk-push');

/**
 * Basic Test Suite for M-Pesa STK Push Simulation
 * Tests core functionality and basic validation
 */

console.log('🧪 M-Pesa STK Push - Basic Test Suite');
console.log('=====================================\n');

let testsPassed = 0;
let testsTotal = 0;
const testResults = [];

/**
 * Test runner function
 * @param {string} description - Test description
 * @param {Function} testFunction - Test function to execute
 */
function test(description, testFunction) {
    testsTotal++;
    const testNumber = testsTotal;
    
    try {
        const startTime = Date.now();
        testFunction();
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`✅ Test ${testNumber}: ${description} (${duration}ms)`);
        testsPassed++;
        
        testResults.push({
            number: testNumber,
            description,
            status: 'PASSED',
            duration: `${duration}ms`
        });
    } catch (error) {
        console.log(`❌ Test ${testNumber}: ${description}`);
        console.log(`   Error: ${error.message}\n`);
        
        testResults.push({
            number: testNumber,
            description,
            status: 'FAILED',
            error: error.message
        });
    }
}

/**
 * Assertion helper function
 * @param {*} actual - Actual value
 * @param {*} expected - Expected value
 * @param {string} message - Error message
 */
function assertEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`${message}\n   Expected: ${JSON.stringify(expected)}\n   Got: ${JSON.stringify(actual)}`);
    }
}

/**
 * Assert that value is truthy
 * @param {*} value - Value to check
 * @param {string} message - Error message
 */
function assertTrue(value, message) {
    if (!value) {
        throw new Error(`${message}\n   Expected: truthy\n   Got: ${value}`);
    }
}

/**
 * Assert that value is falsy
 * @param {*} value - Value to check
 * @param {string} message - Error message
 */
function assertFalse(value, message) {
    if (value) {
        throw new Error(`${message}\n   Expected: falsy\n   Got: ${value}`);
    }
}

// ============================================================================
// BASIC FUNCTIONALITY TESTS
// ============================================================================

test('Valid STK Push request should return success', () => {
    const result = stkPush("254706322944", 5000, "School Fees");
    
    assertEqual(result.status, "success", "Status should be success");
    assertTrue(result.transactionId, "Transaction ID should exist");
    assertEqual(typeof result.transactionId, "string", "Transaction ID should be string");
    assertEqual(result.transactionId.length, 8, "Transaction ID should be 8 characters");
    assertEqual(result.message, "STK Push initiated", "Message should match expected");
});

test('Valid minimum amount should work', () => {
    const result = stkPush("254706322944", 1, "Minimum Payment");
    assertEqual(result.status, "success", "Minimum amount should be accepted");
});

test('Valid maximum amount should work', () => {
    const result = stkPush("254706322944", 100000, "Maximum Payment");
    assertEqual(result.status, "success", "Maximum amount should be accepted");
});

test('Different valid phone numbers should work', () => {
    const phones = ["254706322944", "254712345678", "254798765432", "254723456789"];
    
    phones.forEach(phone => {
        const result = stkPush(phone, 1000, "Test Payment");
        assertEqual(result.status, "success", `Phone ${phone} should be valid`);
    });
});

// ============================================================================
// PHONE NUMBER VALIDATION TESTS
// ============================================================================

test('Invalid phone number - wrong country code should fail', () => {
    const result = stkPush("256706322944", 1000, "Payment");
    assertEqual(result.status, "error", "Wrong country code should be rejected");
    assertEqual(result.transactionId, null, "Transaction ID should be null on error");
    assertTrue(result.message.includes("Invalid phone number"), "Error message should mention phone number");
});

test('Invalid phone number - too short should fail', () => {
    const result = stkPush("25470632294", 1000, "Payment");
    assertEqual(result.status, "error", "Short phone number should be rejected");
});

test('Invalid phone number - too long should fail', () => {
    const result = stkPush("2547063229444", 1000, "Payment");
    assertEqual(result.status, "error", "Long phone number should be rejected");
});

test('Invalid phone number - non-string should fail', () => {
    const result = stkPush(254706322944, 1000, "Payment");
    assertEqual(result.status, "error", "Numeric phone number should be rejected");
});

test('Invalid phone number - contains letters should fail', () => {
    const result = stkPush("254abc322944", 1000, "Payment");
    assertEqual(result.status, "error", "Phone number with letters should be rejected");
});

// ============================================================================
// AMOUNT VALIDATION TESTS
// ============================================================================

test('Invalid amount - zero should fail', () => {
    const result = stkPush("254706322944", 0, "Payment");
    assertEqual(result.status, "error", "Zero amount should be rejected");
    assertTrue(result.message.includes("Invalid amount"), "Error message should mention amount");
});

test('Invalid amount - negative should fail', () => {
    const result = stkPush("254706322944", -100, "Payment");
    assertEqual(result.status, "error", "Negative amount should be rejected");
});

test('Invalid amount - too large should fail', () => {
    const result = stkPush("254706322944", 100001, "Payment");
    assertEqual(result.status, "error", "Amount over limit should be rejected");
});

test('Invalid amount - string should fail', () => {
    const result = stkPush("254706322944", "1000", "Payment");
    assertEqual(result.status, "error", "String amount should be rejected");
});

test('Invalid amount - NaN should fail', () => {
    const result = stkPush("254706322944", NaN, "Payment");
    assertEqual(result.status, "error", "NaN amount should be rejected");
});

// ============================================================================
// DESCRIPTION VALIDATION TESTS
// ============================================================================

test('Invalid description - empty string should fail', () => {
    const result = stkPush("254706322944", 1000, "");
    assertEqual(result.status, "error", "Empty description should be rejected");
    assertTrue(result.message.includes("Invalid transaction description"), "Error message should mention description");
});

test('Invalid description - whitespace only should fail', () => {
    const result = stkPush("254706322944", 1000, "   ");
    assertEqual(result.status, "error", "Whitespace-only description should be rejected");
});

test('Invalid description - non-string should fail', () => {
    const result = stkPush("254706322944", 1000, 123);
    assertEqual(result.status, "error", "Numeric description should be rejected");
});

test('Valid description with special characters should work', () => {
    const result = stkPush("254706322944", 1000, "School Fees - Term 1 (2024)");
    assertEqual(result.status, "success", "Description with special characters should work");
});

// ============================================================================
// TRANSACTION ID TESTS
// ============================================================================

test('Transaction IDs should be unique', () => {
    const result1 = stkPush("254706322944", 1000, "Payment 1");
    const result2 = stkPush("254706322944", 1000, "Payment 2");
    
    assertTrue(result1.transactionId !== result2.transactionId, "Transaction IDs should be unique");
});

test('Transaction ID format should be correct', () => {
    const result = stkPush("254706322944", 1000, "Payment");
    const transactionId = result.transactionId;
    
    assertEqual(transactionId.length, 8, "Transaction ID should be 8 characters");
    assertTrue(/^[A-Z0-9]+$/.test(transactionId), "Transaction ID should contain only uppercase letters and numbers");
});

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

test('Multiple invalid inputs should return first validation error', () => {
    const result = stkPush("123", 0, "");
    assertEqual(result.status, "error", "Should return error for multiple invalid inputs");
    assertTrue(result.message.includes("phone number"), "Should return phone number error first");
});

test('Function should handle undefined inputs gracefully', () => {
    const result = stkPush(undefined, undefined, undefined);
    assertEqual(result.status, "error", "Should handle undefined inputs");
});

test('Function should handle null inputs gracefully', () => {
    const result = stkPush(null, null, null);
    assertEqual(result.status, "error", "Should handle null inputs");
});

// ============================================================================
// TEST RESULTS SUMMARY
// ============================================================================

function displayTestSummary() {
    console.log('\n' + '═'.repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('═'.repeat(60));
    
    console.log(`\n📈 Overall Results:`);
    console.log(`   Tests Passed: ${testsPassed}/${testsTotal}`);
    console.log(`   Success Rate: ${((testsPassed/testsTotal) * 100).toFixed(1)}%`);
    
    if (testsPassed === testsTotal) {
        console.log(`   Status: 🎉 ALL TESTS PASSED!`);
    } else {
        console.log(`   Status: ⚠️  ${testsTotal - testsPassed} TEST(S) FAILED`);
        
        console.log(`\n❌ Failed Tests:`);
        testResults
            .filter(result => result.status === 'FAILED')
            .forEach(result => {
                console.log(`   ${result.number}. ${result.description}`);
                console.log(`      Error: ${result.error}`);
            });
    }
    
    console.log(`\n✅ Passed Tests:`);
    testResults
        .filter(result => result.status === 'PASSED')
        .forEach(result => {
            console.log(`   ${result.number}. ${result.description} (${result.duration})`);
        });
    
    console.log('\n' + '═'.repeat(60));
    
    // Next steps
    console.log('\n🚀 Next Steps:');
    if (testsPassed === testsTotal) {
        console.log('   • Run comprehensive tests: npm test');
        console.log('   • See usage examples: npm run example');
        console.log('   • Start integrating into your project!');
    } else {
        console.log('   • Fix failing tests');
        console.log('   • Check your implementation');
        console.log('   • Re-run tests');
    }
    
    console.log('\n🎯 Happy Testing! 🎯\n');
}

// Run summary
displayTestSummary();

// Exit with appropriate code
process.exit(testsPassed === testsTotal ? 0 : 1);