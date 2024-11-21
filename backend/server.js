const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // Adjust for production security
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increased body size limit for file uploads
app.use(bodyParser.json({ 
    limit: '50mb',
    strict: true // Enforce JSON parsing
}));

// Validation Middleware
const validateInput = (req, res, next) => {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({
            is_success: false,
            error: "Invalid input: Data must be an array"
        });
    }

    if (data.some(item => typeof item !== 'string')) {
        return res.status(400).json({
            is_success: false,
            error: "Invalid input: All array elements must be strings"
        });
    }

    next();
};

function isPrime(num) {
    num = Number(num);
    if (num <= 1) return false;
    
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function getHighestLowercaseAlphabet(alphabets) {
    const lowercaseAlphabets = alphabets.filter(char => /[a-z]/.test(char));
    if (lowercaseAlphabets.length === 0) return [];
    
    return [lowercaseAlphabets.reduce((a, b) => a > b ? a : b)];
}

function determineFileMimeType(base64String) {
    if (!base64String) return '';

    const mimeTypes = [
        { type: 'image/png', signature: 'data:image/png' },
        { type: 'image/jpeg', signature: 'data:image/jpeg' },
        { type: 'application/pdf', signature: 'data:application/pdf' },
        { type: 'application/doc', signature: 'data:application/doc' }
    ];

    const matchedType = mimeTypes.find(mime => 
        base64String.startsWith(mime.signature)
    );

    return matchedType ? matchedType.type : 'application/octet-stream';
}

app.post('/bfhl', validateInput, (req, res) => {
    try {
        const { data, file_b64 } = req.body;

        const numbers = data.filter(item => /^\d+$/.test(item));
        const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));

        const isPrimeFound = numbers.some(num => isPrime(Number(num)));

        let fileValid = false;
        let fileMimeType = '';
        let fileSizeKb = 0;

        if (file_b64) {
            try {
                fileValid = file_b64.trim().length > 0;
                fileMimeType = determineFileMimeType(file_b64);
                
                fileSizeKb = Math.ceil(file_b64.length * 3 / 4 / 1024);
            } catch (fileError) {
                fileValid = false;
                console.error('File processing error:', fileError);
            }
        }

        const response = {
            is_success: true,
            user_id: "shradha_20112004",
            email: "shraddhasinghbais4@gmail.com",
            roll_number: "21100BTCSE09983",
            numbers,
            alphabets,
            highest_lowercase_alphabet: getHighestLowercaseAlphabet(alphabets),
            is_prime_found: isPrimeFound,
            file_valid: fileValid,
            file_mime_type: fileMimeType,
            file_size_kb: String(fileSizeKb)
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({
            is_success: false,
            error: "Internal server processing error"
        });
    }
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        is_success: false,
        error: "Critical server error"
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Access at: http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing HTTP server.');
    app.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

module.exports = app; 