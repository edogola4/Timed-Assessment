// ==================== examples/usage-examples.js ====================
const { stkPush } = require('../src/mpesa-stk-push');

console.log('=== M-Pesa STK Push Usage Examples ===\n');

// Example 1: School Fees Payment
console.log('📚 Example 1: School Fees Payment');
const schoolFees = stkPush("254706322944", 15000, "Term 1 School Fees - John Doe");
console.log(JSON.stringify(schoolFees, null, 2));

// Example 2: Exam Fees
console.log('\n📝 Example 2: Exam Registration Fees');
const examFees = stkPush("254712345678", 2500, "KCSE Exam Registration");
console.log(JSON.stringify(examFees, null, 2));

// Example 3: Transport Fees
console.log('\n🚌 Example 3: Transport Fees');
const transportFees = stkPush("254798765432", 5000, "Monthly Transport Fee");
console.log(JSON.stringify(transportFees, null, 2));

// Example 4: Book Purchase
console.log('\n📖 Example 4: School Books Purchase');
const bookFees = stkPush("254723456789", 3200, "Mathematics Textbooks");
console.log(JSON.stringify(bookFees, null, 2));

// Example 5: Error Handling
console.log('\n❌ Example 5: Error Handling');
function handlePayment(phone, amount, description) {
    const result = stkPush(phone, amount, description);
    
    if (result.status === 'success') {
        console.log(`✅ Payment initiated successfully!`);
        console.log(`Transaction ID: ${result.transactionId}`);
        console.log(`Phone: ${phone}`);
        console.log(`Amount: KES ${amount}`);
        console.log(`Description: ${description}`);
    } else {
        console.log(`❌ Payment failed: ${result.message}`);
    }
    
    return result;
}

// Valid payment
console.log('\nValid Payment:');
handlePayment("254706322944", 8000, "Library Fees");

// Invalid payment
console.log('\nInvalid Payment:');
handlePayment("0706322944", 0, "");

// Example 6: Bulk Payments Simulation
console.log('\n🔄 Example 6: Bulk Payments Simulation');
const students = [
    { phone: "254706322944", amount: 15000, name: "John Doe" },
    { phone: "254712345678", amount: 15000, name: "Jane Smith" },
    { phone: "254798765432", amount: 12000, name: "Bob Johnson" },
    { phone: "254723456789", amount: 18000, name: "Alice Brown" }
];

console.log('Processing bulk payments...');
students.forEach((student, index) => {
    const result = stkPush(student.phone, student.amount, `School Fees - ${student.name}`);
    console.log(`${index + 1}. ${student.name}: ${result.status} ${result.status === 'success' ? '- ' + result.transactionId : '- ' + result.message}`);
});

console.log('\n=== Examples Complete ===');