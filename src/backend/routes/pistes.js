const express = require('express');
const router = express.Router();
const Piste = require('../models/Piste');
const Passage = require("../models/Passage"); // Assuming the model is in the 'models' directory
const Compteur = require("../models/Compteur"); // Assuming the model is in the 'models' directory


router.get('/', async (req, res) => {
  try {
    const { populaireDebut, populaireFin } = req.query;
    let query = {};

    if (populaireDebut) {
      const startDate = new Date(`${populaireDebut.substring(0, 4)}-${populaireDebut.substring(4, 6)}-${populaireDebut.substring(6, 8)}`);
      query.Date = { $gte: startDate.toISOString() };
    }

    if (populaireFin) {
      const endDate = new Date(`${populaireFin.substring(0, 4)}-${populaireFin.substring(4, 6)}-${populaireFin.substring(6, 8)}`);
      endDate.setHours(23, 59, 59, 999);
      query.Date = query.Date || {};
      query.Date.$lte = endDate.toISOString();
    }

    if (!populaireDebut && !populaireFin) {
      const pistes = await Piste.find({});
      const featureCollection = {
        type: 'FeatureCollection',
        features: pistes
      };
      return res.json(featureCollection);
    }

    const passages = await Passage.find(query).lean();
    let compteurTotals = {};

    passages.forEach(passage => {
      Object.keys(passage).forEach(key => {
        if (key !== '_id' && key !== 'Date') {
          compteurTotals[key] = (compteurTotals[key] || 0) + parseInt(passage[key], 10);
        }
      });
    });

    let arrondissementPassages = {};
    let arrondissementCompteurCounts = {};

    for (let compteurId in compteurTotals) {
      const compteur = await Compteur.findOne({ ID: compteurId });
      if (compteur && compteur.Nom) {
        arrondissementPassages[compteur.Nom] = (arrondissementPassages[compteur.Nom] || 0) + compteurTotals[compteurId];
        arrondissementCompteurCounts[compteur.Nom] = (arrondissementCompteurCounts[compteur.Nom] || 0) + 1;
      }
    }

    let arrondissementPopularity = {};
    for (let arrondissement in arrondissementPassages) {
      if (arrondissementCompteurCounts[arrondissement]) {
        arrondissementPopularity[arrondissement] = arrondissementPassages[arrondissement] / arrondissementCompteurCounts[arrondissement];
      }
    }

    let sortedArrondissements = Object.entries(arrondissementPopularity).sort((a, b) => b[1] - a[1]).slice(0, 3);
    let topArrondissements = sortedArrondissements.reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

    res.json({ topArrondissements  });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const piste = await Piste.findOne({'properties.ID_CYCL': req.params.id});
    if (!piste) {
      return res.status(404).json({message: "Bike path not found"});
    }
    res.json(piste);
  } catch (error) {
    res.status(500).json({message: "Internal Server Error", error: error});
  }
});


module.exports = router;
