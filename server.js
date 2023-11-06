const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Dev', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use('/static', express.static('public'));
app.use(cors({
  origin: 'http://localhost:4200'
}));

// Endpoint pour "compteurs"
app.get('/gti525/v1/compteurs/:compteurId', async (req, res) => {
  const { debut, fin } = req.query; // Extracting the query parameters
  //on ne les utilise pas encore

  try {
      const compteur = await Compteur.findById(req.params.compteurId);
      if (!compteur) {
          return res.status(404).json({ message: "Compteur not found" });
      }
      res.json(compteur);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Endpoint for "pistes"
app.get('/gti525/v1/pistes', (req, res) => {
    // Return the bike paths as JSON
    // Here we are reading from a static file, but you can also connect to a database
    res.sendFile(__dirname + '/src/assets/reseau_cyclable.geojson');
});

// Endpoint for "pointsdinteret"
app.get('/gti525/v1/pointsdinteret', (req, res) => {
    // Return the points of interest as JSON
    res.sendFile(__dirname + '/src/assets/fontaines.csv'); // Assuming this CSV is JSON-compatible
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});