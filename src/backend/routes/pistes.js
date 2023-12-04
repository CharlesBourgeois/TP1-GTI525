const express = require('express');
const router = express.Router();
const Piste = require('../models/Piste'); 


router.get('/', async (req, res) => {
  try {
    const pistes = await Piste.find({});

    const featureCollection = {
      type: 'FeatureCollection',
      features: pistes
    };

    res.json(featureCollection);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const piste = await Piste.findOne({ 'properties.ID_CYCL': req.params.id });
    if (!piste) {
      return res.status(404).json({ message: "Bike path not found" });
    }
    res.json(piste);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});


module.exports = router;
