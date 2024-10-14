import express from 'express';
import dotenv from 'dotenv';
import { generateImage } from './genrateImageController.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration using an environment variable for the frontend URL
app.use(cors({
  origin: process.env.FRONTEND_URL, // This should be set in your .env file
  methods: ['GET', 'POST'],
  credentials: true // Allows cookies to be sent with requests
}));

app.use(express.static('public')); // Serves static files from the 'public' directory
app.use(express.json()); // Parses incoming JSON requests

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Endpoint to generate an image
app.post('/api/generate-image', async (req, res) => {
  const { prompt } = req.body; 
  
  if (!prompt || !prompt.length) {
    return res.status(400).send('Prompt is required');
  }

  try {
    await generateImage(prompt); 
    // Use HTTPS protocol
    const imageUrl = `https://${req.get('host')}/generated_image.jpg`;
    res.send(imageUrl); // Send the image URL as the response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating image'); // Handle errors gracefully
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
