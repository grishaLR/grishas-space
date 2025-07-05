import { FC, useState } from 'react';
import { initializeMusicKit, authorizeAppleMusic, isAuthorized, searchAppleMusic } from '@/services/appleMusic';
import { Button } from '@components/primitives';

export const MusicKitTest: FC = () => {
  const [status, setStatus] = useState<string>('Not initialized');
  const [isInitialized, setIsInitialized] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);

  const handleInitialize = async () => {
    try {
      setStatus('Initializing MusicKit...');
      await initializeMusicKit();
      setIsInitialized(true);
      setAuthorized(isAuthorized());
      setStatus('✅ MusicKit initialized successfully');
    } catch (error) {
      setStatus(`❌ Failed: ${error.message}`);
    }
  };

  const handleAuthorize = async () => {
    try {
      setStatus('Requesting Apple Music authorization...');
      await authorizeAppleMusic();
      setAuthorized(true);
      setStatus('✅ Authorized with Apple Music');
    } catch (error) {
      setStatus(`❌ Authorization failed: ${error.message}`);
    }
  };

  const handleSearch = async () => {
    try {
      setStatus('Searching Apple Music...');
      const results = await searchAppleMusic('Manu Chao');
      setSearchResults(results);
      setStatus(`✅ Found ${results.songs?.data?.length || 0} songs`);
    } catch (error) {
      setStatus(`❌ Search failed: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid var(--primary-purple)', 
      borderRadius: '10px',
      margin: '20px',
      background: 'rgba(155, 89, 182, 0.1)'
    }}>
      <h3 style={{ color: 'var(--primary-purple)' }}>🍎 Apple Music API Test</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong> <span style={{ color: 'var(--primary-green)' }}>{status}</span>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Button 
          variant="grishas-space" 
          onClick={handleInitialize}
          disabled={isInitialized}
        >
          1. Initialize MusicKit
        </Button>
        
        <Button 
          variant="grishas-space" 
          onClick={handleAuthorize}
          disabled={!isInitialized || authorized}
        >
          2. Authorize Apple Music
        </Button>
        
        <Button 
          variant="grishas-space" 
          onClick={handleSearch}
          disabled={!authorized}
        >
          3. Test Search
        </Button>
      </div>

      {searchResults && (
        <div style={{ 
          background: 'rgba(46, 204, 113, 0.1)', 
          padding: '15px', 
          borderRadius: '8px',
          border: '1px solid var(--primary-green)'
        }}>
          <h4 style={{ color: 'var(--primary-green)' }}>Search Results:</h4>
          <pre style={{ 
            color: 'var(--text-primary)', 
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {JSON.stringify(searchResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};