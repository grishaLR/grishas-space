import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://grishas.space'],
  credentials: true,
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// MusicKit token endpoint
app.get('/api/musickit-token', async (req, res) => {
  try {
    // Validate environment variables
    if (!process.env.APPLE_TEAM_ID || !process.env.MUSICKIT_KEY_ID || !process.env.MUSICKIT_PRIVATE_KEY_PATH) {
      throw new Error('Missing MusicKit configuration');
    }

    // Read the private key
    const privateKeyPath = path.resolve(process.env.MUSICKIT_PRIVATE_KEY_PATH);
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

    // Generate token with 6 months validity
    const token = jwt.sign({}, privateKey, {
      algorithm: 'ES256',
      expiresIn: '180d',
      issuer: process.env.APPLE_TEAM_ID,
      header: {
        alg: 'ES256',
        kid: process.env.MUSICKIT_KEY_ID,
      },
    });

    // Cache control - token is good for 6 months, cache for 1 day
    res.setHeader('Cache-Control', 'private, max-age=86400');
    
    res.json({ 
      token,
      expiresIn: 180 * 24 * 60 * 60, // seconds
      issuedAt: Math.floor(Date.now() / 1000),
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to generate token',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
});