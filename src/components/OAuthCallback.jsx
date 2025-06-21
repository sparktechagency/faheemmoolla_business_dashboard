import { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { message, Spin } from 'antd';

// import { saveToken } from '../../features/auth/authService';

const OAuthCallback = () => {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  

  useEffect(() => {

    const handleCallback = async () => {

      try {

        const token = searchParams.get('token');

        const role = searchParams.get('role');

        const error = searchParams.get('error');

        if (error) {

          message.error('Authentication failed. Please try again.');

          navigate('/auth/login');

          return;

        }

        if (token) {

          // Save token using your existing auth service

          // saveToken(token);
          localStorage.setItem("pronab", token);

          // Store user role if provided

          if (role) {

            localStorage.setItem('userRole', role);

          }

          // Optional: Decode token to get user info

          try {

            const tokenPayload = JSON.parse(atob(token.split('.')[1]));

            localStorage.setItem("businessLoginId", tokenPayload._id);

          } catch (e) {

            console.warn('Could not decode token:', e);

          }

          message.success('Login successful!');

          // Redirect based on role

          if (role === 'BUSINESSMAN') {

            navigate('/business-dashboard');

          } else {

            navigate('/dashboard');

          }

        } else {

          message.error('No authentication token received.');

          navigate('/auth/login');

        }

      } catch (error) {

        console.error('OAuth callback error:', error);

        message.error('Authentication failed. Please try again.');

        navigate('/auth/login');

      }

    };

    handleCallback();

  }, [navigate, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <Spin size="large" />
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">

            Completing your login...
          </h3>
          <p className="mt-2 text-sm text-gray-600">

            Please wait while we redirect you to your dashboard.
          </p>
        </div>
      </div>
    </div>

  );

};

export default OAuthCallback;

