require('dotenv').config();
const express = require('express');
const cors = require('cors');

const sequelize = require('./db');
const router = require('./routes');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://job-front.herokuapp.com']
}));

app.use(express.json());
app.use('/api', router);

const start = async () => {
  try {
    await sequelize.authenticate(); // connect to db
    // await sequelize.sync(); // updates db model (from model file)
    app.listen(PORT, () => console.log(`listen ${PORT}`))
  } catch (err) {
    console.log(err);
  }
}

start();