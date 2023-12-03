const express = require('express');
const router = express.Router();
const PointDInteret = require('../models/PointDInteret'); // assuming you have a model file

// Get a list of points of interest with optional filtering and pagination
router.get('/', async (req, res) => {
  try {
    const limite = parseInt(req.query.limite, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const type = req.query.type;
    const territoire = req.query.territoire;
    const nom = req.query.nom;

    let query = {};
    if (territoire) {
      query.Arrondissement = territoire;
    }
    if (nom) {
      query.Nom_parc_lieu = {$regex: nom, $options: 'i'};
    }

    const totalCount = await PointDInteret.countDocuments(query);
    const pointsDInteret = await PointDInteret.find(query)
      .skip((page - 1) * limite)
      .limit(limite);

    const totalPages = Math.ceil(totalCount / limite);

    res.json({
      totalPages: totalPages,
      currentPage: page,
      pointsDInteret: pointsDInteret
    });
  } catch (error) {
    res.status(500).json({message: "Internal Server Error", error: error});
  }
});

// Get a single point of interest by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id; // Get the custom ID from the request parameters
    const pointDInteret = await PointDInteret.findOne({ ID: id }); // Use findOne to search by custom ID
    if (!pointDInteret) {
      return res.status(404).json({ message: "Point of interest not found" });
    }
    res.json(pointDInteret);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});


// Add a new point of interest
router.post('/', async (req, res) => {
  try {
    const newPointDInteret = new PointDInteret(req.body); // Create a new document from the request body
    const savedPointDInteret = await newPointDInteret.save(); // Save it to the database
    res.status(201).json(savedPointDInteret);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});


router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const pointDInteret = await PointDInteret.findOneAndUpdate({ ID: id }, updates, { new: true }); // Update the document
    if (!pointDInteret) {
      return res.status(404).json({ message: "Point of interest not found" });
    }
    res.json(pointDInteret);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pointDInteret = await PointDInteret.findOneAndDelete({ ID: id }); // Delete the document
    if (!pointDInteret) {
      return res.status(404).json({ message: "Point of interest not found" });
    }
    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});



module.exports = router;
