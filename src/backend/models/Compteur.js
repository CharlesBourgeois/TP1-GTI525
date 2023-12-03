const mongoose = require('mongoose');

const CompteurSchema = new mongoose.Schema({
  Ancien_ID: String,
  Annee_implante: String,
  Nom: String,
  Latitude: String,
  Statut: String,
  ID: {
    type: String,
    required: true,
    unique: true
  },
  Longitude: String
}, { collection: 'Compteurs' });

const Compteur = mongoose.model('Compteur', CompteurSchema);

module.exports = Compteur;
