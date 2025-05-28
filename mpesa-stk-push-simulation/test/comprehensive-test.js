const { 
    stkPush, 
    isValidPhoneNumber, 
    isValidAmount, 
    isValidTransactionDesc, 
    generateTransactionId 
} = require('../src/mpesa-stk-push');

console.log('🔬 M-Pesa STK Push - Comprehensive Test Suite');
console.log('============================================\n');

let testsPassed = 0;
let testsTotal = 0;
let testCategories = {
    'Phone Validation': { passed: 0, total: 0 },
    'Amount Validation': { passed: 0, total: 0 },
    'Description Validation': { passed: 0, total: 0 },
    'Transaction ID': { passed: 0, total: 0 },
    'Integration': { passed: 0, total: 0 },
    'Performance': { passed: 0, total: 0 },
    'Edge Cases': { passed: 0, total: 0 }
};

function test(category, description, testFunction) {
    testsTotal++;
    testCategories[category].total++;
    
    try {
        const startTime = process.hrtime.bigint();
        testFunction();
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - startTime) / 1000000;
        
        console.log(`✅ ${category}: ${description} (${duration.toFixed(2)}ms)`);
        testsPassed++;
        testCategories[category].passed++;
    } catch (error) {
        console.log(`❌ ${category}: ${description}`);
        console.log(`   💥 ${error.message}\n`);
    }
}

function assertEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`${message}\n   Expected: ${JSON.stringify(expected)}\n   Actual: ${JSON.stringify(actual)}`);
    }
}

function assertTrue(value, message) {
    if (!value) throw new Error(`${message} - Expected truthy, got: ${value}`);
}

function assertFalse(value, message) {
    if (value) throw new Error(`${message} - Expected falsy, got: ${value}`);
}

function assertThrows(fn, message) {
    try {
        fn();
        throw new Error(`${message} - Expected function to throw`);
    } catch (error) {}
}

function assertRange(value, min, max, message) {
    if (value < min || value > max) {
        throw new Error(`${message} - Value ${value} not in range [${min}, ${max}]`);
    }
}

// 📱 Phone Number Validation
test('Phone Validation', 'Wrong length numbers should fail', () => {
    const wrongLengthNumbers = ["254706322", "25470632294", "2547063229444", "254706322944555"];
    wrongLengthNumbers.forEach(phone => {
        assertFalse(isValidPhoneNumber(phone), `${phone} should be invalid`);
        const result = stkPush(phone, 1000, "Test");
        assertEqual(result.status, "error", `${phone} should fail in STK Push`);
    });
});

// 💰 Amount Validation
test('Amount Validation', 'Valid amounts should pass', () => {
    [1, 100, 99999, 100000].forEach(amount => {
        assertTrue(isValidAmount(amount), `Amount ${amount} should be valid`);
    });
});

test('Amount Validation', 'Invalid amounts should fail', () => {
    [-1, 0, 100001, NaN].forEach(amount => {
        assertFalse(isValidAmount(amount), `Amount ${amount} should be invalid`);
        const result = stkPush("254706322944", amount, "Test");
        assertEqual(result.status, "error", `Amount ${amount} should fail in STK Push`);
    });
});

// 📝 Description Validation
test('Description Validation', 'Non-empty descriptions should pass', () => {
    ["Fees", "Tuition Payment", "   x  ", "A"].forEach(desc => {
        assertTrue(isValidTransactionDesc(desc), `Description "${desc}" should be valid`);
    });
});

test('Description Validation', 'Empty or whitespace-only descriptions should fail', () => {
    ["", "   "].forEach(desc => {
        assertFalse(isValidTransactionDesc(desc), `Description "${desc}" should be invalid`);
        const result = stkPush("254706322944", 5000, desc);
        assertEqual(result.status, "error", `Description "${desc}" should fail in STK Push`);
    });
});

// 🧾 Transaction ID Generator
test('Transaction ID', 'Generates 8-character alphanumeric strings', () => {
    for (let i = 0; i < 10; i++) {
        const id = generateTransactionId();
        assertTrue(/^[A-Z0-9]{8}$/.test(id), `Transaction ID ${id} should match pattern`);
    }
});

test('Transaction ID', 'IDs should be unique across 1000 runs', () => {
    const ids = new Set();
    for (let i = 0; i < 1000; i++) {
        ids.add(generateTransactionId());
    }
    assertEqual(ids.size, 1000, `Transaction IDs should be unique`);
});

// 🔄 Integration Test
test('Integration', 'Valid input should return success response', () => {
    const result = stkPush("254706322944", 5000, "School Fees");
    assertEqual(result.status, "success", "Should return success");
    assertTrue(result.transactionId, "Should include transactionId");
    assertEqual(result.message, "STK Push initiated", "Should include correct message");
});

test('Integration', 'Invalid input should return error response', () => {
    const result = stkPush("1234567890", -1, "");
    assertEqual(result.status, "error", "Should return error for all invalid inputs");
    assertEqual(result.transactionId, null, "Should not include transactionId");
    assertEqual(result.message, "Invalid inputs", "Should include correct error message");
});

// 🚀 Performance
test('Performance', 'Should process under 50ms per request', () => {
    const start = Date.now();
    for (let i = 0; i < 100; i++) {
        stkPush("254706322944", 100, "Fee");
    }
    const duration = Date.now() - start;
    assertTrue(duration < 5000, `Performance test: took ${duration}ms for 100 calls`);
});

// ⚠️ Edge Cases
test('Edge Cases', 'Whitespace description trimmed and validated', () => {
    const result = stkPush("254706322944", 100, "   Payment   ");
    assertEqual(result.status, "success", "Whitespace description should still work");
});

test('Edge Cases', 'Phone number with spaces or symbols should fail', () => {
    const invalidPhones = ["254 706 322 944", "254-706-322-944", "25470632294a"];
    invalidPhones.forEach(phone => {
        const result = stkPush(phone, 100, "Test");
        assertEqual(result.status, "error", `${phone} should fail`);
    });
});

// Summary
console.log('\n📊 Test Summary');
console.log('--------------');
Object.keys(testCategories).forEach(category => {
    const { passed, total } = testCategories[category];
    const percent = ((passed / total) * 100).toFixed(1);
    console.log(`✅ ${category}: ${passed}/${total} passed (${percent}%)`);
});

console.log(`\n🧪 TOTAL: ${testsPassed}/${testsTotal} tests passed`);
