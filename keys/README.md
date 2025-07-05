# Private Keys Directory

This directory is for storing private keys and certificates.

## MusicKit Setup

1. Place your Apple MusicKit private key (.p8 file) in this directory
2. Update the `.env` file with the correct path:
   ```
   MUSICKIT_PRIVATE_KEY_PATH=./keys/AuthKey_XXXXXXXXXX.p8
   ```

## Security Notes

- Files in this directory are ignored by Git (except this README)
- Never commit private keys to version control
- In production, use environment variables or secure key management services