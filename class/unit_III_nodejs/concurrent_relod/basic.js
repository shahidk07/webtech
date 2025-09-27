// basic.js
const express = require('express');
const path = require('path'); // ⬅️ You must require the 'path' module
const app = express();
const PORT = 3000; // ⬅️ Using the PORT variable

// The express.static middleware should point to the current directory
// since all your files are in the same folder.
// The single dot ('.') means "the current directory".
// Note: If you ONLY want to serve index.html, you can remove this line.
// app.use(express.static('.'));

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from backend!!!!' });
});

app.get('/', (req, res) => {
    // __dirname is the absolute path to the current directory
    // We send the index.html file located in that same directory
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 💡 IMPORTANT: Use the defined variable PORT (or port) consistently
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});