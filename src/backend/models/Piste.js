const mongoose = require('mongoose');

const PisteSchema = new mongoose.Schema({
  type: { type: String, default: 'Feature' },
  properties: {
    ID_CYCL: Number,
    ID_TRC: Number,
    AFFICHEUR_DYNAMIQUE: String,
    AVANCEMENT_CODE: String,
    AVANCEMENT_DESC: String,
    COMPTEUR_CYCLISTE: String,
    LONGUEUR: Number,
    NBR_VOIE: Number,
    NOM_ARR_VILLE_CODE: String,
    NOM_ARR_VILLE_DESC: String,
    PROTEGE_4S: String,
    REV_AVANCEMENT_CODE: String,
    REV_AVANCEMENT_DESC: String,
    ROUTE_VERTE: String,
    SAISONS4: String,
    SAS_VELO: String,
    SEPARATEUR_CODE: String,
    SEPARATEUR_DESC: String,
    TYPE_VOIE_CODE: String,
    TYPE_VOIE_DESC: String,
    TYPE_VOIE2_CODE: String,
    TYPE_VOIE2_DESC: String,
    VILLE_MTL: String
  },
  geometry: {
    type: { type: String, enum: ['LineString'], default: 'LineString' },
    coordinates: [[[Number]]] // Array of arrays of arrays of numbers
  }
}, { collection: 'Reseau_cyclable' });

const Piste = mongoose.model('Piste', PisteSchema);

module.exports = Piste;
