import React, { useState, useEffect } from 'react';
import { ensureToken, revokeToken, SCOPES, getAccessTokenSync } from '../auth/google';

export default function Login() {
  const [token, setToken] = useState(getAccessTokenSync());
  const [error, setError] = useState('');

  useEffect(() => {
    // no-op, button triggers token request
  }, []);

  const handleSignIn = async () => {
    setError('');
    try {
      // Request minimal scopes up front; pages will request more as needed
      await ensureToken(['openid', 'email', 'profile']);
      setToken(getAccessTokenSync());
    } catch (e) {
      setError(String(e));
    }
  };

  const handleSignOut = () => {
    revokeToken();
    setToken(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Google Sign-In</h1>
      <p className="mb-4">Sign in with your Google account to enable Calendar, Gmail, and Tasks features.</p>
      <div className="flex gap-3">
        <button onClick={handleSignIn} className="px-4 py-2 rounded bg-blue-600 text-white">Sign In with Google</button>
        <button onClick={handleSignOut} className="px-4 py-2 rounded bg-gray-700 text-white">Sign Out</button>
      </div>
      {token ? <p className="mt-4 text-green-700 break-all">Access Token present.</p> : <p className="mt-4">Not signed in.</p>}
      {error && <pre className="mt-4 text-red-700 whitespace-pre-wrap">{error}</pre>}
    </div>
  );
}
