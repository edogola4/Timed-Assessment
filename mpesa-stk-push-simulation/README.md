# 📲 M-Pesa STK Push Simulation

A **Node.js-based simulation** of M-Pesa STK Push transactions, tailored for **school fee payment systems** in Kenya. This tool provides secure, validated, and testable transactions for prototyping and development purposes.

---

## 📚 Table of Contents

- [📲 M-Pesa STK Push Simulation](#-m-pesa-stk-push-simulation)
  - [📚 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🚀 Installation](#-installation)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Running the App](#running-the-app)
    - [💻 Usage](#-usage)
      - [Basic Integration](#basic-integration)
      - [Sample Responses](#sample-responses)
    - [Success:](#success)
    - [Error:](#error)
    - [📖 API Reference](#-api-reference)

---

## ✨ Features

- 🔐 Secure transaction ID generation using `crypto`
- ✅ Strict input validation
- 🇰🇪 Phone number validation (`254XXXXXXXXX` format)
- 💰 Amount range enforcement (KES 1 - 100,000)
- 🏫 Education-focused transaction structure
- 🧪 High test coverage
- 📝 Descriptive error responses

---

## 🚀 Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Setup

```bash
git clone https://github.com/yourusername/mpesa-stk-push-simulation.git
cd mpesa-stk-push-simulation
npm install
```


### Running the App
```bash
node index.js
```

### 💻 Usage
#### Basic Integration
```bash
const { stkPush } = require('./src/mpesa-stk-push');

const result = stkPush("254706322944", 5000, "School Fees");
console.log(result);
```
#### Sample Responses
### Success:
```bash
{
  "status": "success",
  "transactionId": "ABCD1234",
  "message": "STK Push initiated"
}
```
### Error:
```bash 
{
  "status": "error",
  "transactionId": null,
  "message": "Invalid phone number format. Must be 12 digits starting with '254'"
}
```
### 📖 API Reference

