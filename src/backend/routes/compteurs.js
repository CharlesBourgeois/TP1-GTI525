const express = require('express');
const router = express.Router();
const Compteur = require('../models/Compteur'); // Assuming the model is in the 'models' directory
const Passage = require('../models/Passage'); // This would be your model for the passages, adjust as needed

router.get('/', async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 10; // Default to 10 if not provided
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const implantation = req.query.implantation;
    const nom = req.query.nom;

    let query = {};
    if (implantation) {
      query.Anee_implante = implantation;
    }
    if (nom) {
      query.Nom = {$regex: nom, $options: 'i'}; // Case-insensitive search
    }

    const compteurs = await Compteur.find(query)
      .skip((page - 1) * limite)
      .limit(limite);

    res.json(compteurs);
  } catch (error) {
    res.status(500).json({message: "Internal Server Error", error: error});
  }
});

router.get('/:id', async (req, res) => {
  const compteurId = req.params.id;

  try {
    // Find the compteur by ID using Mongoose
    const compteur = await Compteur.findOne({ ID: compteurId });

    if (!compteur) {
      return res.status(404).json({ message: "Compteur not found" });
    }

    res.json(compteur);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

router.get('/:id/passages', async (req, res) => {
  const compteurId = req.params.id;
  const { debut, fin } = req.query;

  const startDate = new Date(`${debut.substring(0, 4)}-${debut.substring(4, 6)}-${debut.substring(6, 8)}`);
  const endDate = new Date(`${fin.substring(0, 4)}-${fin.substring(4, 6)}-${fin.substring(6, 8)}`);
  endDate.setHours(23, 59, 59, 999);

  try {
    const query = {
      Date: {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString()
      }
    };

    const passages = await Passage.find(query).lean();

    let totalPassages = 0;
    passages.forEach(passage => {
      if (passage[compteurId] !== undefined) {
        totalPassages += parseInt(passage[compteurId]);
      }
    });

    if (totalPassages === 0) {
      return res.status(404).json({ message: "No passages found for the specified compteur and date range" });
    }

    res.json({ totalPassages });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});



module.exports = router;
