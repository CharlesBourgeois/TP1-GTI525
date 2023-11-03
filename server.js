const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, 'dist/tp1-gti525-reseau-cyclabe')));

// Add a simple route for hello world
app.get('/hello', (req, res) => {
  res.send('Hello World');
});

// All other routes should redirect to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/tp1-gti525-reseau-cyclabe/index.html'));
});

const port = process.env.PORT || '3000';
app.set('port', port);

app.listen(port, () => console.log(`Server running on localhost:${port}`));
