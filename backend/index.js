import express from 'express';
import fetch from 'node-fetch';
import pkg from '@apollo/client';
import {getDeviceController} from './controllers/getDeviceController.js';
import { createDeviceController } from './controllers/createDeviceController.js';
const { gql, ApolloClient, InMemoryCache, HttpLink } = pkg;
import cors from 'cors'
import { fetchMonitorAndUpdateDevice } from './controllers/fetchMonitorController.js';


// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Nhost configuration


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/getDevice/:deviceId', getDeviceController);
app.post('/api/createDevice', createDeviceController);
app.post('/api/fetchMonitorAndUpdateDevice', fetchMonitorAndUpdateDevice);


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));