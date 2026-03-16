// Native fetch is available in Node.js 18+


const API_URL = 'http://localhost:3001/api/products';

async function testValidations() {
    console.log("Starting Validation Tests...");

    // 1. Valid Product
    const validProduct = {
        name: "Nike Pegasus 40",
        price: 120,
        description: "Great running shoes",
        stock: 10,
        category: "Running",
        sku: "NKE-123"
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(validProduct),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        console.log(`[TEST 1] Create Valid Product: ${res.status === 201 ? 'SUCCESS' : 'FAILED'}`);
        if (res.status !== 201) console.log(data);
    } catch (e) {
        console.error("Error connecting to API", e);
    }

    // 2. Invalid Product (Short name, negative price, invalid category)
    const invalidProduct = {
        name: "Ab",
        price: -50,
        description: "A".repeat(1001),
        category: "InvalidCategory"
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(invalidProduct),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        console.log(`[TEST 2] Create Invalid Product: ${res.status === 400 ? 'SUCCESS (Blocked)' : 'FAILED (Allowed)'}`);
        if (res.status === 400) {
            console.log("Validation Errors received (Expected):", data.message);
        } else {
            console.log("Unexpected success:", data);
        }
    } catch (e) {
        console.error("Error connecting to API", e);
    }
}

// Wait a bit for server to start if running simultaneously, or just run
setTimeout(testValidations, 2000);
