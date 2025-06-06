//importing
const cors=require('cors');
require('dotenv').config();
const express = require ('express');
const bodyParser = require('body-parser');
const restaurantRoutes = require('./routes/restaurant');
const locationRoutes = require('./routes/location');
const mealtypeRoutes = require('./routes/mealtype');
const menuRoutes = require('./routes/menu');
const paymentRoutes=require('./routes/payment');
const mongoose = require('mongoose');

const DBCONNECTIONSTRING= process.env.MONGO_URI;

//connect MongoDB
mongoose.connect(
  DBCONNECTIONSTRING,
    () => {
      console.log("MongoDb Connected");
    },
    e => console.log(e)
  );
  
mongoose.set('strictQuery', true);


//start the express server PORT
const PORT = process.env.PORT || 3038;

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

var app =express();


//middleware

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use("/restaurant", restaurantRoutes);
app.use("/location", locationRoutes);
app.use("/mealtype", mealtypeRoutes);
app.use("/menu",menuRoutes)
app.use("/pay",paymentRoutes)





app.listen(PORT, () => {
    console.log(`app running on PORT:${PORT}`);
  });
