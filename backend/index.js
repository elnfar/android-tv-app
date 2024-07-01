import express from 'express';

import cors from 'cors'


// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());


app.post('/webhook', (req, res) => {
  // Extract data sent by Hasura from the request body
  const eventData = req.body;

  console.log('Received event data from Hasura:', eventData);

  res.status(200).json({ message: 'Webhook received and processed successfully' });
});




// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));