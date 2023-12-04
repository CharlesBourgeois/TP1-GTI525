const express = require('express');
const router = express.Router();
const PointDInteret = require('../models/PointDInteret');

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
    if (type === 'Atelier réparation') {
      query.Etat = 'Atelier réparation';
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

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pointDInteret = await PointDInteret.findOne({ ID: id });
    if (!pointDInteret) {
      return res.status(404).json({ message: "Point of interest not found" });
    }
    res.json(pointDInteret);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});


router.post('/', async (req, res) => {
  try {
    const newPointDInteret = new PointDInteret(req.body);
    const savedPointDInteret = await newPointDInteret.save();
    res.status(201).json(savedPointDInteret);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});


router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const pointDInteret = await PointDInteret.findOneAndUpdate({ ID: id }, updates, { new: true });
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
    const pointDInteret = await PointDInteret.findOneAndDelete({ ID: id });
    if (!pointDInteret) {
      return res.status(404).json({ message: "Point of interest not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});



module.exports = router;
