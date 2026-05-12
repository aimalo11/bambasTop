const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5174,
    path: '/',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (data.includes('<div id="root"></div>')) {
            console.log("SUCCESS: Root div found.");
        } else {
            console.log("WARNING: Root div not found?");
            console.log(data.substring(0, 200));
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
