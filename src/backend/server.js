const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compteurRoutes = require('./routes/compteurs');
const pisteRoutes = require('./routes/pistes');
const pointsdInteretRoutes = require('./routes/pointsdinteret');

const app = express();
const PORT = 8080;

// Connect to MongoDB
mongoose.connect('mongodb://mongodb:27017/db', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(express.json());
app.use('/static', express.static('public'));
app.use(cors({
  origin: 'http://localhost:4200'
}));

app.get('/gti525/v1/', (req, res) => {
  res.json({
    message: "Welcome to the API",
    endpoints: {
      compteurs: `${req.protocol}://${req.get('host')}/gti525/v1/compteurs`,
      id_compteur: `${req.protocol}://${req.get('host')}/gti525/v1/compteurs/:id`,
      passages_compteur: `${req.protocol}://${req.get('host')}/gti525/v1/compteurs/:id/passages`,
      pistes: `${req.protocol}://${req.get('host')}/gti525/v1/pistes`,
      id_piste: `${req.protocol}://${req.get('host')}/gti525/v1/pistes/:id`,
      pointsdInteret: `${req.protocol}://${req.get('host')}/gti525/v1/pointsdinteret`,
      id_pointsdInteret: `${req.protocol}://${req.get('host')}/gti525/v1/pointsdinteret/:id`,
      post_pointsdInteret: `${req.protocol}://${req.get('host')}/gti525/v1/pointsdinteret`,
      patch_pointsdInteret: `${req.protocol}://${req.get('host')}/gti525/v1/pointsdinteret/:id`,
      delete_pointsdInteret: `${req.protocol}://${req.get('host')}/gti525/v1/pointsdinteret/:id`,
    }
  });
});

// Routes
app.use('/gti525/v1/compteurs', compteurRoutes);
app.use('/gti525/v1/pistes', pisteRoutes);
app.use('/gti525/v1/pointsdinteret', pointsdInteretRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
