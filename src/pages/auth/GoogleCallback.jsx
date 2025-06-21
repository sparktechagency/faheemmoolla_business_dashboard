// GoogleCallback.jsx - Component to handle Google OAuth callback
import { Spin, message } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../utils/BaseURL';

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Extract the authorization code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (code) {
          // Send the code to your backend to exchange for token
          const response = await fetch(`${baseURL}/api/v1/auth/google/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: code,
              state: state,
            }),
          });

          const data = await response.json();

          if (data.success && data.data && data.data.token) {
            // Store the token in localStorage as "businessToken"
            localStorage.setItem('businessToken', data.data.token);

            // Store user ID if available
            if (data.data.user && data.data.user._id) {
              localStorage.setItem('businessLoginId', data.data.user._id);
            }

            message.success('Google authentication successful!');

            // Redirect to dashboard
            navigate('/dashboard');
          } else {
            // Handle error
            console.error('Google authentication failed:', data.message);
            message.error(data.message || 'Google authentication failed');
            navigate('/auth/login');
          }
        } else {
          // No code found, redirect to login with error
          message.error('Authentication code not found');
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('Error during Google callback:', error);
        message.error('Authentication failed. Please try again.');
        navigate('/auth/login');
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <Spin size="large" />
        <p className="mt-4 text-lg text-gray-600">Processing Google authentication...</p>
        <p className="mt-2 text-sm text-gray-500">Please wait while we sign you in</p>
      </div>
    </div>
  );
}