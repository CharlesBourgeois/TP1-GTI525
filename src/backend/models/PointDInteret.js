const mongoose = require('mongoose');

const pointDInteretSchema = new mongoose.Schema({
  Etat: String,
  Proximite_jeux_repere: String,
  Arrondissement: String,
  Remarque: String,
  Nom_parc_lieu: String,
  ID: {
    type: String,
    required: true,
    unique: true
  },
  Y: String,
  Longitude: String,
  Latitude: String,
  X: String,
  Date_installation: String,
  Intersection: String,
  Precision_localisation: String
}, { collection: 'Fontaines' });

const PointDInteret = mongoose.model('PointDInteret', pointDInteretSchema);

module.exports = PointDInteret;
