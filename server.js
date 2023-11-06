const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
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

function findCompteurById(compteurId, callback) {
  let foundCompteur = null;
  fs.createReadStream(__dirname + '/src/assets/compteurs.csv')
    .pipe(csv())
    .on('data', (row) => {
      if (row.ID === compteurId) {
        foundCompteur = row;
      }
    })
    .on('end', () => {
      callback(foundCompteur);
    });
}

// Endpoint pour "compteurs"
app.get('/gti525/v1/compteurs/:compteurId', async (req, res) => {
  const { debut, fin } = req.query; 
  const { compteurId } = req.params;

  findCompteurById(compteurId, (compteur) => {
    if (!compteur) {
      return res.status(404).json({ message: "Compteur not found" });
    }
    res.json(compteur);
  });
});

// Endpoint for "pistes"
app.get('/gti525/v1/pistes', (req, res) => {
    // Return the bike paths as JSON
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