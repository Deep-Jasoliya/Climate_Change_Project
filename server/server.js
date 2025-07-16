const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors  = require('cors');
const authRoutes = require('./routes/auth');
const forecastRoutes = require('./routes/forecast');
const climateRoutes = require('./routes/climate');
const riskRoutes = require('./routes/risk');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/climate', climateRoutes);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch((err) => console.error(err));
