// This is a Node.js script to generate MusicKit tokens
// Run this separately or integrate with your backend

import jwt from 'jsonwebtoken';
import fs from 'fs';

// Configuration - Replace these with your actual values
const TEAM_ID = 'YOUR_TEAM_ID'; // Your Apple Team ID (top right of developer portal)
const KEY_ID = 'YOUR_KEY_ID'; // Your MusicKit Key ID (from when you created the key)
const PRIVATE_KEY_PATH = './AuthKey_YOUR_KEY_ID.p8'; // Path to your downloaded .p8 file

export function generateToken() {
  try {
    // Read the private key
    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');

    // Token payload
    const payload = {
      iss: TEAM_ID, // Issuer (your Team ID)
      iat: Math.floor(Date.now() / 1000), // Issued at
      exp: Math.floor(Date.now() / 1000) + (180 * 24 * 60 * 60), // Expires in 180 days
    };

    // Generate token
    const token = jwt.sign(payload, privateKey, {
      algorithm: 'ES256',
      header: {
        alg: 'ES256',
        kid: KEY_ID,
      },
    });

    return token;
  } catch (error) {
    throw error;
  }
}

// If running this file directly
if (import.meta.url === `file://${process.argv[1]}`) {
}