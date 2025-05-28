#!/usr/bin/env node

const { stkPush } = require('./src/mpesa-stk-push');

/**
 * Main entry point for the M-Pesa STK Push simulation
 */
function main() {
    console.log('🚀 M-Pesa STK Push Simulation');
    console.log('================================\n');

    // Demo function to showcase functionality
    runDemo();
    
    // Show usage instructions
    showUsageInstructions();
}

/**
 * Runs a demonstration of the STK Push functionality
 */
function runDemo() {
    console.log('📱 Running Live Demo...\n');
    
    // Test Case 1: Valid School Fee Payment
    console.log('1️⃣  Valid School Fee Payment:');
    console.log('   Input: stkPush("254706322944", 5000, "School Fees")');
    const result1 = stkPush("254706322944", 5000, "School Fees");
    console.log('   Output:', JSON.stringify(result1, null, 4));
    
    console.log('\n' + '─'.repeat(50) + '\n');
    
    // Test Case 2: Invalid Phone Number
    console.log('2️⃣  Invalid Phone Number:');
    console.log('   Input: stkPush("123456789012", 1000, "Payment")');
    const result2 = stkPush("123456789012", 1000, "Payment");
    console.log('   Output:', JSON.stringify(result2, null, 4));
    
    console.log('\n' + '─'.repeat(50) + '\n');
    
    // Test Case 3: Invalid Amount
    console.log('3️⃣  Invalid Amount (Zero):');
    console.log('   Input: stkPush("254706322944", 0, "Payment")');
    const result3 = stkPush("254706322944", 0, "Payment");
    console.log('   Output:', JSON.stringify(result3, null, 4));
    
    console.log('\n' + '─'.repeat(50) + '\n');
    
    // Test Case 4: Empty Description
    console.log('4️⃣  Empty Description:');
    console.log('   Input: stkPush("254706322944", 2500, "")');
    const result4 = stkPush("254706322944", 2500, "");
    console.log('   Output:', JSON.stringify(result4, null, 4));
    
    console.log('\n' + '─'.repeat(50) + '\n');
    
    // Test Case 5: Maximum Amount
    console.log('5️⃣  Maximum Valid Amount:');
    console.log('   Input: stkPush("254712345678", 100000, "Annual Fees")');
    const result5 = stkPush("254712345678", 100000, "Annual Fees");
    console.log('   Output:', JSON.stringify(result5, null, 4));
    
    console.log('\n' + '═'.repeat(50) + '\n');
}

/**
 * Shows usage instructions and available commands
 */
function showUsageInstructions() {
    console.log('📖 Usage Instructions:');
    console.log('─────────────────────\n');
    
    console.log('🔧 Available Commands:');
    console.log('  npm start          - Run this demo');
    console.log('  npm test           - Run comprehensive tests');
    console.log('  npm run test:basic - Run basic tests');
    console.log('  npm run example    - See more usage examples');
    console.log('  npm run dev        - Run in development mode\n');
    
    console.log('📋 Function Usage:');
    console.log('  const { stkPush } = require("./src/mpesa-stk-push");');
    console.log('  const result = stkPush(phoneNumber, amount, description);\n');
    
    console.log('✅ Valid Input Examples:');
    console.log('  • Phone: "254706322944" (12 digits, starts with 254)');
    console.log('  • Amount: 5000 (number between 1-100000)');
    console.log('  • Description: "School Fees" (non-empty string)\n');
    
    console.log('❌ Invalid Input Examples:');
    console.log('  • Phone: "0706322944" (missing country code)');
    console.log('  • Amount: 0 or 150000 (outside valid range)');
    console.log('  • Description: "" (empty string)\n');
    
    console.log('🎯 Next Steps:');
    console.log('  1. Run tests: npm test');
    console.log('  2. See examples: npm run example');
    console.log('  3. Read documentation: README.md');
    console.log('  4. Integrate into your project\n');
    
    console.log('🌟 Happy Coding! 🌟');
}

/**
 * Interactive mode for testing custom inputs
 */
function interactiveMode() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    console.log('\n🔥 Interactive Mode - Test Your Own Inputs!');
    console.log('Type "exit" to quit\n');
    
    function promptUser() {
        rl.question('Enter phone number (254XXXXXXXXX): ', (phone) => {
            if (phone.toLowerCase() === 'exit') {
                rl.close();
                return;
            }
            
            rl.question('Enter amount (1-100000): ', (amount) => {
                rl.question('Enter description: ', (desc) => {
                    const result = stkPush(phone, parseInt(amount), desc);
                    console.log('\nResult:', JSON.stringify(result, null, 2));
                    console.log('\n' + '─'.repeat(30));
                    promptUser();
                });
            });
        });
    }
    
    promptUser();
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--interactive') || args.includes('-i')) {
    interactiveMode();
} else if (args.includes('--help') || args.includes('-h')) {
    showUsageInstructions();
} else {
    // Run main demo
    main();
}

// Export for use as a module
module.exports = { stkPush };