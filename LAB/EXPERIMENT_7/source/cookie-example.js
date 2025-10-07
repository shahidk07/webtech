const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('hello')
});
app.get('/set-cookie', (req, res) => {
    res.cookie('username', 'John', { maxAge: 900000 });
    res.send('Cookie has been set');
});

app.get('/get-cookie', (req, res) => {
    const user = req.cookies['username'];
    res.send(`Cookie Retrieved: ${user}`);
});

app.get('/delete-cookie', (req, res) => {
    res.clearCookie('username');
    res.send('Cookie deleted');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
