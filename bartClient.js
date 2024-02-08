 
const fs = require('fs').promises;
const http = require('http');
const https = require('https');

async function summarizeText(text, address) {
    try {
        // Determine if the address uses HTTP or HTTPS
        const protocol = address.startsWith('https') ? https : http;
        // Extract hostname and port from the address
        const urlPattern = /^(https?:\/\/)?([^\/:]+)(:([0-9]+))?\/?/;
        const matches = address.match(urlPattern);
        if (!matches) {
            throw new Error('Invalid address format');
        }
        const hostname = matches[2];
        const port = matches[4] || (address.startsWith('https') ? 443 : 80); // Default ports for HTTP/HTTPS

        const options = {
            hostname,
            port,
            path: '/summarize',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const data = JSON.stringify({text});

        await new Promise((resolve, reject) => {
            const req = protocol.request(options, (res) => {
                let responseBody = '';

                res.on('data', (chunk) => {
                    responseBody += chunk;
                });

                res.on('end', () => {
                    try {
                        const response = JSON.parse(responseBody);
                        console.log('Summary:', response.summary);
                        resolve();
                    } catch (error) {
                        reject(new Error('Error parsing response'));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            // Send the request
            req.write(data);
            req.end();
        });
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}


// Check command line arguments
if (process.argv.length < 4) {
    console.error('Usage: node client.js [-t <file>] <text> <server_address:port>');
    process.exit(1);
}

// Parse command line arguments
let textArgIndex = 2;
if (process.argv[2] === '-t') {
    if (process.argv.length < 5) {
        console.error('Usage: node client.js -t <file> <server_address:port>');
        process.exit(1);
    }
    textArgIndex = 3;
}

// Get the address argument
const address = process.argv[textArgIndex + 1];

// Handle -t option for targeting a .txt file
if (process.argv[2] === '-t') {
    const filePath = process.argv[3];
    fs.readFile(filePath, 'utf-8')
        .then((content) => summarizeText(content, address))
        .catch((error) => console.error('Error reading the file:', error.message));
} else {
    const text = process.argv[2];
    summarizeText(text, address);
}
